"use client";

import { useQuery } from "@tanstack/react-query";
import type { CityWeatherPreview } from "@/lib/types";
import { CITIES } from "@/lib/cities";
import { fetchCityWeathers } from "@/lib/api";

interface UseCityWeathersReturn {
  data: Map<string, CityWeatherPreview>;
  loading: boolean;
}

const CITIES_PARAM = JSON.stringify(
  CITIES.map(({ id, coords }) => ({
    id,
    lat: coords.lat,
    lon: coords.lon,
  }))
);

/** 위치 탭 도시 카드용 — CITIES 6개의 실시간 날씨 프리뷰 */
export function useCityWeathers(): UseCityWeathersReturn {
  const { data, isLoading } = useQuery<Map<string, CityWeatherPreview>>({
    queryKey: ["cityWeathers"],
    queryFn: async ({ signal }) => {
      const previews = await fetchCityWeathers(CITIES_PARAM, signal);
      const map = new Map<string, CityWeatherPreview>();
      for (const p of previews) {
        map.set(p.cityId, p);
      }
      return map;
    },
  });

  return {
    data: data ?? new Map(),
    loading: isLoading,
  };
}
