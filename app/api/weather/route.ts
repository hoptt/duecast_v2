import type { NextRequest } from "next/server";
import type { ApiError } from "@/lib/types";
import { fetchWeatherData } from "@/lib/weather-service";

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = request.nextUrl;

  const latStr = searchParams.get("lat");
  const lonStr = searchParams.get("lon");
  const lat = parseFloat(latStr ?? "");
  const lon = parseFloat(lonStr ?? "");

  // 좌표 유효성 검사
  if (
    !latStr || !lonStr ||
    isNaN(lat) || isNaN(lon) ||
    lat < -90 || lat > 90 ||
    lon < -180 || lon > 180
  ) {
    return Response.json(
      { error: "INVALID_PARAMS", message: "유효한 lat, lon 파라미터가 필요합니다." } satisfies ApiError,
      { status: 400 }
    );
  }

  // API 키 확인
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey || apiKey === "your_api_key_here") {
    return Response.json(
      { error: "CONFIG_ERROR", message: "OpenWeather API 키가 설정되지 않았습니다." } satisfies ApiError,
      { status: 500 }
    );
  }

  try {
    const data = await fetchWeatherData(lat, lon, apiKey);
    return Response.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
      },
    });
  } catch (err: unknown) {
    const code = (err as { code?: number }).code;
    const message = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";

    if (code === 401) {
      return Response.json(
        { error: "CONFIG_ERROR", message } satisfies ApiError,
        { status: 500 }
      );
    }
    if (code === 429) {
      return Response.json(
        { error: "RATE_LIMIT", message } satisfies ApiError,
        { status: 429 }
      );
    }
    if (code === 404) {
      return Response.json(
        { error: "INVALID_PARAMS", message } satisfies ApiError,
        { status: 404 }
      );
    }

    return Response.json(
      { error: "API_ERROR", message } satisfies ApiError,
      { status: 502 }
    );
  }
}
