import type { WeatherResponse, CityWeatherPreview, ApiError } from "@/lib/types";

export async function fetchWeather(
  lat: number,
  lon: number,
  signal?: AbortSignal
): Promise<WeatherResponse> {
  const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`, { signal });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as ApiError | null;
    throw new Error(
      body?.message ?? `날씨 데이터를 불러오지 못했습니다. (HTTP ${res.status})`
    );
  }
  return res.json();
}

export async function fetchCityWeathers(
  citiesParam: string,
  signal?: AbortSignal
): Promise<CityWeatherPreview[]> {
  const res = await fetch(
    `/api/weather/cities?cities=${encodeURIComponent(citiesParam)}`,
    { signal }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
