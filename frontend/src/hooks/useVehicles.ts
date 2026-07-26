import { useCallback, useEffect, useState } from "react";
import { vehicleService } from "../services/vehicleService";
import type { Vehicle, VehicleDraft, VehicleFilters } from "../types/vehicle";
import { ApiError } from "../api/client";

interface UseVehiclesResult {
  vehicles: Vehicle[];
  total: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  createVehicle: (draft: VehicleDraft) => Promise<Vehicle>;
  updateVehicle: (id: string, draft: Partial<VehicleDraft>) => Promise<Vehicle>;
  deleteVehicle: (id: string) => Promise<void>;
  purchaseVehicle: (id: string) => Promise<Vehicle>;
  restockVehicle: (id: string, quantity?: number) => Promise<Vehicle>;
}

interface UseVehiclesOptions {
  useSearchEndpoint?: boolean;
}

export function useVehicles(filters: VehicleFilters, options: UseVehiclesOptions = {}): UseVehiclesResult {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const loader = options.useSearchEndpoint ? vehicleService.search : vehicleService.list;

    loader(filters)
      .then((res) => {
        if (cancelled) return;
        setVehicles(res.data);
        setTotal(res.total);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Failed to load inventory.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // filters is spread intentionally so a new object each render (from callers)
    // doesn't cause infinite loops; we depend on primitive values instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.search,
    filters.make,
    filters.model,
    filters.category,
    filters.status,
    filters.minPrice,
    filters.maxPrice,
    filters.limit,
    filters.sort,
    options.useSearchEndpoint,
    version,
  ]);

  const createVehicle = useCallback(async (draft: VehicleDraft) => {
    const res = await vehicleService.create(draft);
    setVersion((v) => v + 1);
    return res.data;
  }, []);

  const updateVehicle = useCallback(async (id: string, draft: Partial<VehicleDraft>) => {
    const res = await vehicleService.update(id, draft);
    setVehicles((prev) => prev.map((vehicle) => (vehicle.id === id ? res.data : vehicle)));
    setVersion((v) => v + 1);
    return res.data;
  }, []);

  const deleteVehicle = useCallback(async (id: string) => {
    await vehicleService.remove(id);
    setVersion((v) => v + 1);
  }, []);

  const purchaseVehicle = useCallback(async (id: string) => {
    const res = await vehicleService.purchase(id);
    setVehicles((prev) => prev.map((vehicle) => (vehicle.id === id ? res.data : vehicle)));
    return res.data;
  }, []);

  const restockVehicle = useCallback(async (id: string, quantity?: number) => {
    const res = await vehicleService.restock(id, quantity);
    setVehicles((prev) => prev.map((vehicle) => (vehicle.id === id ? res.data : vehicle)));
    return res.data;
  }, []);

  return {
    vehicles,
    total,
    isLoading,
    error,
    refetch,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    purchaseVehicle,
    restockVehicle,
  };
}
