import { post } from "./apiClient";

export async function createPool(year, shipIds) {
  return post("/pools", { year, shipIds });
}
