import type { CurrentWeather } from "@/lib/types";
import { WeatherIcon } from "@/lib/weather-icons";
import { Thermometer } from "lucide-react";

interface WeatherMainProps {
  weather: CurrentWeather;
}

/**
 * WeatherMain — 서버 컴포넌트
 * Atmospheric Window 컨셉 — 대형 기온 숫자 + 날씨 아이콘.
 * DM Serif Display(--font-display) 폰트로 기온 숫자 표시.
 */
export default function WeatherMain({ weather }: WeatherMainProps) {
  return (
    <div className="flex flex-col items-center w-full py-6">

      {/* 날씨 아이콘 */}
      <div
        role="img"
        aria-label={`날씨: ${weather.weather.description}`}
        className="select-none leading-none animate-float mb-4"
        style={{ minWidth: "200px", display: "flex", justifyContent: "center",          position: "relative",
          left:"8px" }}
      >
        <WeatherIcon condition={weather.weather.main} size={80} glow />
      </div>

      {/* 대형 기온 — 로컬 폰트 Bold */}
      <div
        aria-label={`현재 기온 ${weather.temp}도`}
        className="leading-none tabular-nums text-[var(--color-text-main)] text-center"
        style={{
          minWidth: "200px",
          fontFamily: "var(--font-display)",
          position: "relative",
          left:"12px",
          fontSize: "var(--text-temp-display)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
        }}
      >
        {weather.temp}°
      </div>

      {/* 체감온도 + 날씨 설명 — 인라인 */}
      <div className="flex items-center justify-center gap-2 mt-1" style={{ minWidth: "200px" }}>
        {/* 체감온도 */}
        <div className="flex items-center gap-1.5">
          <Thermometer size={14} className="text-orange-400" aria-hidden="true" />
          <span className="text-sm font-medium text-[var(--color-text-sub)] tabular-nums">
            체감 {weather.feelsLike}°
          </span>
        </div>

        {/* 구분선 */}
        <div
          aria-hidden="true"
          className="w-px h-3.5 rounded-full"
          style={{ background: "var(--overlay-border)" }}
        />

        {/* 날씨 설명 */}
        <span className="text-sm font-medium text-[var(--color-text-sub)]">
          {weather.weather.description}
        </span>
      </div>

    </div>
  );
}
