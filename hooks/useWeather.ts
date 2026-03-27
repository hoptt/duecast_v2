"use client";

import { useQuery } from "@tanstack/react-query";
import type { WeatherResponse, Coordinates } from "@/lib/types";
import { fetchWeather } from "@/lib/api";

interface UseWeatherReturn {
  data: WeatherResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useWeather(
  coords: Coordinates | null,
  cityId: string,
  refreshInterval?: number // 분 단위
): UseWeatherReturn {
  const { data, isLoading, error, refetch } = useQuery<WeatherResponse, Error>({
    queryKey: ["weather", coords?.lat, coords?.lon],
    queryFn: ({ signal }) => fetchWeather(coords!.lat, coords!.lon, signal),
    enabled: !!coords,
    placeholderData: (previousData) => previousData,
    refetchInterval: refreshInterval ? refreshInterval * 60 * 1000 : false,
  });

  return {
    data: data ?? null,
    loading: isLoading && !data,
    error: error?.message ?? null,
    refetch: () => { refetch(); },
  };
}
