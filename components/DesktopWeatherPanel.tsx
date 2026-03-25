"use client";

import WeatherStatCards from "@/components/WeatherStatCards";
import type { CurrentWeather, AirPollution, Location, DailyTemperature, SunInfo } from "@/lib/types";
import { WeatherIcon } from "@/lib/weather-icons";
import { MapPin, ArrowUp, ArrowDown } from "lucide-react";

interface DesktopWeatherPanelProps {
  weather: CurrentWeather;
  air: AirPollution;
  location: Location;
  dailyTemp: DailyTemperature;
  sun: SunInfo;
}

/**
 * DesktopWeatherPanel — 클라이언트 컴포넌트
 * 데스크탑 좌측 패널. 위치+최고최저(상단) / 아이콘+초대형 기온+설명(중앙) / 스탯 카드(하단).
 * Atmospheric Window: 배경 그라데이션 위에 직접 렌더. 기온은 clamp(80px, 10vw, 140px).
 */
export default function DesktopWeatherPanel({
  weather,
  air: _air,
  location,
  dailyTemp,
  sun,
}: DesktopWeatherPanelProps) {
  return (
    <div className="flex flex-col justify-between h-full p-8 gap-6">

      {/* ── 상단: 위치명 + 최고/최저 기온 ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="opacity-50 text-[var(--color-text-main)]" aria-hidden="true" />
          <span className="text-base font-semibold text-[var(--color-text-main)] tracking-wide">
            {location.name}
          </span>
        </div>
        <span className="text-sm text-[var(--color-text-sub)] tabular-nums flex items-center gap-0.5">
          <ArrowUp size={12} aria-hidden="true" />{dailyTemp.high}°
          <ArrowDown size={12} className="ml-1" aria-hidden="true" />{dailyTemp.low}°
        </span>
      </div>

      {/* ── 중앙: 날씨 아이콘 + 초대형 기온 + 날씨 설명 ── */}
      <div className="flex flex-col gap-3 flex-1 justify-center">

        {/* 날씨 아이콘 — animate-float 부유 효과 */}
        <div
          role="img"
          aria-label={`날씨: ${weather.weather.description}`}
          className="leading-none select-none animate-float"
        >
          <WeatherIcon condition={weather.weather.main} size={80} glow />
        </div>

        {/* 초대형 기온 — DM Serif Display italic, clamp 반응형 */}
        <div
          aria-label={`현재 기온 ${weather.temp}도`}
          className="leading-none tabular-nums text-[var(--color-text-main)]"
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(80px, 10vw, 140px)",
            letterSpacing: "-0.04em",
          }}
        >
          {weather.temp}°
        </div>

        {/* 날씨 설명 + 체감온도/습도 서브텍스트 */}
        <div className="flex flex-col gap-1 mt-1">
          <span className="text-lg text-[var(--color-text-sub)] font-light">
            {weather.weather.description}
          </span>
          <span className="text-sm text-[var(--color-text-muted)]">
            체감 {weather.feelsLike}° &middot; 습도 {weather.humidity}%
          </span>
        </div>
      </div>

      {/* ── 하단: 날씨 스탯 카드 2×2 ── */}
      <WeatherStatCards weather={weather} sun={sun} />

    </div>
  );
}
