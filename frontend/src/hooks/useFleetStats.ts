import { useEffect, useState } from "react";
import { vehicleService } from "../services/vehicleService";
import type { FleetStats } from "../types/vehicle";

export function useFleetStats() {
  const [stats, setStats] = useState<FleetStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    vehicleService
      .stats()
      .then((res) => {
        if (!cancelled) setStats(res.data);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load fleet statistics.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { stats, isLoading, error };
}
