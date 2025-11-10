import { Route, calculateIntensityDiff, allocatePool } from "./domain";
import * as Ports from "./ports";

/* -------------------------------------------------------------------------- */
/*                              Route Service                                 */
/* -------------------------------------------------------------------------- */
export class RouteService {
  constructor(private repo: Ports.RouteRepository) {}

  /** Fetch routes and compute compliance vs baseline */
  async getRouteComparison(year: number) {
    const routes = await this.repo.getAll(year);
    if (!routes || routes.length === 0)
      throw new Error(`No routes found for year ${year}`);

    const baseline = routes.find((r) => r.is_baseline);
    if (!baseline)
      throw new Error(`No baseline route set for year ${year}.`);

    return routes.map((r) => ({
      ...r,
      percentDiff: calculateIntensityDiff(baseline.ghg_intensity, r.ghg_intensity),
      isCompliant: r.ghg_intensity <= baseline.ghg_intensity,
    }));
  }

  /** Set baseline route for a given route ID */
  async setBaseline(id: number) {
    if (!id || typeof id !== "number")
      throw new Error("Invalid route ID for baseline setting.");

    return this.repo.setBaseline(id, true);
  }
}

/* -------------------------------------------------------------------------- */
/*                          Compliance + Banking Service                      */
/* -------------------------------------------------------------------------- */
export class ComplianceService {
  constructor(
    private complianceRepo: Ports.ComplianceRepository,
    private bankRepo: Ports.BankRepository
  ) {}

  /** Compute adjusted compliance balance considering banked surplus */
  async getAdjustedCB(shipId: string, year: number) {
    const snapshot = await this.complianceRepo.getForShip(shipId, year);
    const currentCB = snapshot ? snapshot.cb_gco2eq : 0;

    const bankedEntries = await this.bankRepo.getAvailable(shipId);
    const totalBankedAvailable = bankedEntries.reduce(
      (sum, e) => sum + (e.amount_gco2eq - e.amount_used),
      0
    );

    const adjusted = currentCB + totalBankedAvailable;
    return {
      year,
      shipId,
      raw_cb: currentCB,
      banked_available: totalBankedAvailable,
      adjusted_cb: adjusted,
      status: adjusted >= 0 ? "COMPLIANT" : "NON_COMPLIANT",
    };
  }

  /** Bank part of a positive compliance balance (surplus) */
  async bankSurplus(shipId: string, year: number, amount: number) {
    if (!shipId || !year) throw new Error("ShipId and year are required.");
    if (amount <= 0) throw new Error("Amount must be positive.");

    const snapshot = await this.complianceRepo.getForShip(shipId, year);
    if (!snapshot)
      throw new Error(`No compliance record found for ${shipId}, ${year}.`);
    if (snapshot.cb_gco2eq <= 0)
      throw new Error("No surplus to bank (CB must be > 0).");
    if (amount > snapshot.cb_gco2eq)
      throw new Error(
        `Cannot bank more than available surplus (Available: ${snapshot.cb_gco2eq}, Requested: ${amount}).`
      );

    await this.bankRepo.bankSurplus({
      ship_id: shipId,
      year,
      amount_gco2eq: amount,
      amount_used: 0,
    });
    return { success: true, message: `Banked ${amount} for ${shipId}` };
  }

  /** Apply banked surplus to offset a deficit */
  async applyBankedSurplus(shipId: string, targetYear: number, amountToApply: number) {
    if (!shipId || !targetYear)
      throw new Error("ShipId and targetYear are required.");
    if (amountToApply <= 0)
      throw new Error("Amount to apply must be positive.");

    const snapshot = await this.complianceRepo.getForShip(shipId, targetYear);
    if (!snapshot)
      throw new Error(`No compliance record for ${shipId}, ${targetYear}.`);
    if (snapshot.cb_gco2eq >= 0)
      throw new Error("No deficit to apply surplus to (CB must be < 0).");

    const bankedEntries = await this.bankRepo.getAvailable(shipId);
    const available = bankedEntries.reduce(
      (sum, e) => sum + (e.amount_gco2eq - e.amount_used),
      0
    );

    if (available < amountToApply)
      throw new Error(
        `Insufficient banked surplus (Available: ${available}, Requested: ${amountToApply}).`
      );

    await this.bankRepo.useAmount(shipId, amountToApply);
    await this.complianceRepo.incrementCB(shipId, targetYear, amountToApply);
    return {
      success: true,
      message: `Applied ${amountToApply} surplus to ${shipId} for ${targetYear}.`,
    };
  }
}

/* -------------------------------------------------------------------------- */
/*                                Pool Service                                */
/* -------------------------------------------------------------------------- */
export class PoolService {
  constructor(
    private poolRepo: Ports.PoolRepository,
    private complianceRepo: Ports.ComplianceRepository
  ) {}

  async createPool(year: number, shipIds: string[]) {
    if (!year || !shipIds?.length)
      throw new Error("Year and shipIds are required for pool creation.");

    // Step 1: Fetch compliance records
    const membersBefore: { ship_id: string; cb_before: number }[] = [];
    for (const shipId of shipIds) {
      const rec = await this.complianceRepo.getForShip(shipId, year);
      if (!rec)
        throw new Error(`Ship ${shipId} missing compliance record for ${year}`);
      membersBefore.push({ ship_id: shipId, cb_before: rec.cb_gco2eq });
    }

    // Step 2: Allocate pool balances
    const allocated = allocatePool(membersBefore);

    // Step 3: Validate pool rules
    const totalSum = allocated.reduce((sum, m) => sum + m.cb_after, 0);
    if (totalSum < 0)
      throw new Error("Pool sum is negative. Must be ≥ 0 for compliance.");

    for (const m of allocated) {
      const { cb_before, cb_after } = m;
      if (cb_after < 0 && cb_before >= 0)
        throw new Error("Surplus ship cannot exit negative.");
      if (cb_after < cb_before && cb_before < 0)
        throw new Error("Deficit ship cannot exit worse after pooling.");
    }

    // Step 4: Persist pool info
    const poolId = await this.poolRepo.create({ year, members: allocated });

    // Step 5: Update compliance balances
    for (const m of allocated) {
      const rec = await this.complianceRepo.getForShip(m.ship_id, year);
      if (!rec)
        throw new Error(`Missing compliance record for ${m.ship_id} during pool persistence for year ${year}.`);
      const diff = m.cb_after - rec.cb_gco2eq;
      if (diff !== 0) {
        // incrementCB takes delta value (can be positive or negative)
        await this.complianceRepo.incrementCB(m.ship_id, year, diff);
      }
    }

    return { pool_id: poolId, status: "FORMED", members: allocated };
  }
}

