import type { AirPollution, DustLevel } from "@/lib/types";

const LEVEL_BAR_COLOR: Record<DustLevel, string> = {
  "좋음":     "bg-emerald-400/70",
  "보통":     "bg-yellow-400/70",
  "나쁨":     "bg-orange-400/70",
  "매우 나쁨": "bg-red-500/70",
};

const LEVEL_TEXT_COLOR: Record<DustLevel, string> = {
  "좋음":     "text-emerald-300",
  "보통":     "text-yellow-300",
  "나쁨":     "text-orange-300",
  "매우 나쁨": "text-red-400",
};

interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
  colorClass: string;
}

function ProgressBar({ label, value, max, colorClass }: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center text-xs text-[var(--color-text-sub)]">
        <span>{label}</span>
        <span className="tabular-nums font-medium">{value} μg/m³</span>
      </div>
      <div className="h-3 rounded-full neu-pressed overflow-hidden" role="presentation">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${pct}%` }}
          role="meter"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}

interface AirQualityCardProps {
  air: AirPollution;
  dustLevel: DustLevel;
}

/**
 * AirQualityCard — 서버 컴포넌트
 * PM2.5 / PM10 진행 바 + 등급 뱃지. 데스크탑 우측 패널 하단 배치.
 */
export default function AirQualityCard({ air, dustLevel }: AirQualityCardProps) {
  const barColor = LEVEL_BAR_COLOR[dustLevel];

  return (
    <section
      aria-label="대기질"
      className="neu-raised p-5"
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[var(--color-text-muted)]">
          대기질
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[var(--color-text-muted)]">AQI {air.aqi}</span>
          <span className={`text-sm font-bold ${LEVEL_TEXT_COLOR[dustLevel]}`}>
            {dustLevel}
          </span>
        </div>
      </div>

      {/* 진행 바 */}
      <div className="flex flex-col gap-3">
        <ProgressBar
          label="PM2.5 (초미세먼지)"
          value={air.pm25}
          max={75}
          colorClass={barColor}
        />
        <ProgressBar
          label="PM10 (미세먼지)"
          value={air.pm10}
          max={150}
          colorClass={barColor}
        />
      </div>

      <p className="text-[10px] text-[var(--color-text-muted)] mt-4 tracking-wide">
        한국 환경부 기준
      </p>
    </section>
  );
}
