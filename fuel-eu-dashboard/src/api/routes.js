import { get, post } from "./apiClient";

export async function fetchRoutes(year) {
  return get(`/routes${year ? `?year=${year}` : ""}`);
}

export async function setBaseline(id) {
  return post(`/routes/${id}/baseline`);
}

export async function fetchComparison(year = 2025) {
  return get(`/routes/comparison?year=${year}`);
}
