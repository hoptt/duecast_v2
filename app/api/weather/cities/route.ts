import type { NextRequest } from "next/server";
import type { CityWeatherPreview, WeatherCondition } from "@/lib/types";
import type { OWMCurrentResponse } from "@/lib/owm-types";
import { getWeatherDescriptionKr } from "@/lib/weather-description";

interface CityCoord {
  id: string;
  lat: number;
  lon: number;
}

const KNOWN_CONDITIONS = new Set<WeatherCondition>([
  "Clear", "Clouds", "Rain", "Drizzle", "Thunderstorm",
  "Snow", "Mist", "Fog", "Haze", "Dust", "Sand",
]);

function toWeatherCondition(main: string): WeatherCondition {
  if (KNOWN_CONDITIONS.has(main as WeatherCondition)) return main as WeatherCondition;
  if (main === "Smoke" || main === "Ash") return "Mist";
  if (main === "Squall" || main === "Tornado") return "Thunderstorm";
  return "Clouds";
}

async function fetchCityWeather(
  city: CityCoord,
  apiKey: string
): Promise<CityWeatherPreview> {
  const params = new URLSearchParams({
    lat: String(city.lat),
    lon: String(city.lon),
    units: "metric",
    lang: "kr",
    appid: apiKey,
  });

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?${params}`,
    { next: { revalidate: 600 } }
  );

  if (!res.ok) {
    throw new Error(`OWM error for city ${city.id}: ${res.status}`);
  }

  const raw: OWMCurrentResponse = await res.json();

  return {
    cityId: city.id,
    temp: Math.round(raw.main.temp),
    description: getWeatherDescriptionKr(raw.weather[0]?.id ?? 800, raw.weather[0]?.description ?? ""),
    condition: toWeatherCondition(raw.weather[0]?.main ?? "Clouds"),
  };
}

export async function GET(request: NextRequest): Promise<Response> {
  // 쿼리 파라미터: cities=[{"id":"seoul","lat":37.56,"lon":126.97},...]
  const citiesParam = request.nextUrl.searchParams.get("cities");

  if (!citiesParam) {
    return Response.json(
      { error: "INVALID_PARAMS", message: "cities 파라미터가 필요합니다." },
      { status: 400 }
    );
  }

  let cities: CityCoord[];
  try {
    cities = JSON.parse(citiesParam) as CityCoord[];
    if (!Array.isArray(cities) || cities.length === 0) throw new Error("empty");
  } catch {
    return Response.json(
      { error: "INVALID_PARAMS", message: "cities 파라미터 형식이 올바르지 않습니다." },
      { status: 400 }
    );
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey || apiKey === "your_api_key_here") {
    return Response.json(
      { error: "CONFIG_ERROR", message: "OpenWeather API 키가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  // 모든 도시 병렬 호출 — 개별 실패는 null로 처리
  const results = await Promise.allSettled(
    cities.map((city) => fetchCityWeather(city, apiKey))
  );

  const previews: CityWeatherPreview[] = results
    .filter((r): r is PromiseFulfilledResult<CityWeatherPreview> => r.status === "fulfilled")
    .map((r) => r.value);

  return Response.json(previews, {
    headers: {
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
    },
  });
}
