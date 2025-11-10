import { post, get } from "./apiClient";

export async function bankSurplus(shipId, year, amount) {
  return post("/banking/bank", { shipId, year, amount });
}

export async function applyBanked(shipId, year, amount) {
  return post("/banking/apply", { shipId, year, amount });
}

export async function fetchBankingRecords(shipId, year) {
  return get(`/banking/records?shipId=${shipId}&year=${year}`);
}
