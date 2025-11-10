import { get } from "./apiClient";

export async function fetchComplianceCB(shipId, year) {
  return get(`/compliance/cb?shipId=${shipId}&year=${year}`);
}

export async function fetchAdjustedCB(shipId, year) {
  return get(`/compliance/adjusted-cb?shipId=${shipId}&year=${year}`);
}
