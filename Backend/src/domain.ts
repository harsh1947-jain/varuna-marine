// === DOMAIN LAYER: Entities & Pure Business Logic ===

export interface Route {
    id?: number;
    route_id: string;
    year: number;
    vessel_type?: string;        // NEW
    fuel_type?: string;          // NEW
    ghg_intensity: number;
    fuel_consumption_t?: number; // NEW
    distance_km?: number;        // NEW
    total_emissions_t?: number;  // NEW
    is_baseline: boolean;
}

export interface ComplianceRecord {
    ship_id: string;
    year: number;
    cb_gco2eq: number;
}

export interface BankEntry {
    id?: number;
    ship_id: string;
    year: number;
    amount_gco2eq: number;
    amount_used: number; // NEW
}

export interface PoolMember {
    ship_id: string;
    cb_before: number;
    cb_after: number;
}

export interface Pool {
    id?: number;
    year: number;
    members: PoolMember[];
}

// -- Pure Domain Logic --

export const REGULATORY_TARGET_2025 = 91.16;

// NEW: Implements ((comparison / baseline) - 1) * 100
export function calculateIntensityDiff(baseline: number, comparison: number): number {
     return ((comparison / baseline) - 1) * 100;
}

export function calculateCB(actualIntensity: number, energyMj: number = 1e6, target: number = REGULATORY_TARGET_2025): number {
    return (target - actualIntensity) * energyMj;
}

export function allocatePool(
  members: { ship_id: string; cb_before: number }[]
): { ship_id: string; cb_before: number; cb_after: number }[] {
  const surplus = members
    .filter((m) => m.cb_before > 0)
    .sort((a, b) => b.cb_before - a.cb_before);
  const deficits = members
    .filter((m) => m.cb_before < 0)
    .sort((a, b) => a.cb_before - b.cb_before);

  const result = members.map((m) => ({ ...m, cb_after: m.cb_before }));

  for (const def of deficits) {
    let remaining = Math.abs(def.cb_before);
    for (const sur of surplus) {
      const donor = result.find((r) => r.ship_id === sur.ship_id)!;
      const receiver = result.find((r) => r.ship_id === def.ship_id)!;

      const transferable = Math.min(donor.cb_after, remaining);
      donor.cb_after -= transferable;
      receiver.cb_after += transferable;
      remaining -= transferable;
      if (remaining <= 0) break;
    }
  }
  return result;
}
