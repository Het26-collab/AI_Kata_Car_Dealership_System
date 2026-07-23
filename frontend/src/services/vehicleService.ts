import { apiClient } from "../api/client";
import type { ApiItemResponse, ApiListResponse } from "../types/api";
import type { FleetStats, Vehicle, VehicleDraft, VehicleFilters } from "../types/vehicle";

function buildQuery(filters: VehicleFilters = {}, options: { searchEndpoint?: boolean } = {}): string {
  const params = new URLSearchParams();
  if (options.searchEndpoint) {
    if (filters.make) params.set("make", filters.make);
    if (filters.model) params.set("model", filters.model);
  } else if (filters.search) {
    params.set("search", filters.search);
  }
  if (filters.category && filters.category !== "All") params.set("category", filters.category);
  if (!options.searchEndpoint && filters.status && filters.status !== "All") params.set("status", filters.status);
  if (filters.minPrice !== undefined) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== undefined) params.set("maxPrice", String(filters.maxPrice));
  if (!options.searchEndpoint && filters.sort) params.set("sort", filters.sort);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const vehicleService = {
  list: (filters?: VehicleFilters) =>
    apiClient.get<ApiListResponse<Vehicle>>(`/vehicles${buildQuery(filters)}`),

  search: (filters?: VehicleFilters) =>
    apiClient.get<ApiListResponse<Vehicle>>(`/vehicles/search${buildQuery(filters, { searchEndpoint: true })}`),

  getById: (id: string) => apiClient.get<ApiItemResponse<Vehicle>>(`/vehicles/${id}`),

  create: (draft: VehicleDraft) =>
    apiClient.post<ApiItemResponse<Vehicle>>("/vehicles", draft),

  update: (id: string, draft: Partial<VehicleDraft>) =>
    apiClient.put<ApiItemResponse<Vehicle>>(`/vehicles/${id}`, draft),

  remove: (id: string) => apiClient.delete<void>(`/vehicles/${id}`),

  purchase: (id: string) =>
    apiClient.post<ApiItemResponse<Vehicle>>(`/vehicles/${id}/purchase`),

  restock: (id: string, quantity?: number) =>
    apiClient.post<ApiItemResponse<Vehicle>>(`/vehicles/${id}/restock`, quantity ? { quantity } : {}),

  stats: () => apiClient.get<ApiItemResponse<FleetStats>>("/vehicles/stats"),
};
