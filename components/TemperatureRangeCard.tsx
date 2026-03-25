import type { DailyTemperature } from "@/lib/types";

interface TemperatureRangeCardProps {
  dailyTemp: DailyTemperature;
  currentTemp: number;
}

/**
 * TemperatureRangeCard — 서버 컴포넌트
 * 최저~최고 기온 범위를 수평 그라데이션 바로 표시.
 * 현재 기온 위치를 마커로 표시.
 */
export default function TemperatureRangeCard({ dailyTemp, currentTemp }: TemperatureRangeCardProps) {
  const { low, high } = dailyTemp;
  const range = high - low || 1;
  const markerPct = Math.max(0, Math.min(100, ((currentTemp - low) / range) * 100));

  return (
    <section
      aria-label="기온 범위"
      className="neu-raised p-5"
    >
      <h2 className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[var(--color-text-muted)] mb-4">
        오늘 기온 범위
      </h2>

      {/* 최저/최고 양쪽 값 */}
      <div className="flex items-end justify-between mb-3">
        <span
          aria-label={`최저 기온 ${low}도`}
          className="text-2xl text-[var(--color-text-sub)]"
          style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
        >
          {low}°
        </span>
        <span className="text-[10px] text-[var(--color-text-muted)] pb-1">
          현재 {currentTemp}°
        </span>
        <span
          aria-label={`최고 기온 ${high}도`}
          className="text-2xl text-[var(--color-text-main)]"
          style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
        >
          {high}°
        </span>
      </div>

      {/* 그라데이션 바 + 현재 기온 마커 */}
      <div className="relative h-2 rounded-full overflow-visible">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "linear-gradient(to right, rgba(147,197,253,0.6), rgba(251,191,36,0.7), rgba(251,113,94,0.8))",
          }}
        />
        {/* 현재 기온 마커 */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[var(--neu-bg)] neu-flat"
          style={{ left: `calc(${markerPct}% - 6px)` }}
        />
      </div>
    </section>
  );
}
