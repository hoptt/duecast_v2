"use client";

import { useState, useEffect } from "react";
import type { SunInfo } from "@/lib/types";

function fmtTime(ts: number): string {
  const d = new Date(ts * 1000);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

interface SunriseSunsetCardProps {
  sun: SunInfo;
}

/**
 * SunriseSunsetCard — 클라이언트 컴포넌트
 * 일출/일몰 시각을 SVG 반원형 다이어그램으로 시각화.
 * dayProgress는 마운트 후 Date.now()로 계산 → hydration mismatch 방지.
 */
export default function SunriseSunsetCard({ sun }: SunriseSunsetCardProps) {
  const [dayProgress, setDayProgress] = useState(0);

  useEffect(() => {
    const nowTs = Math.floor(Date.now() / 1000);
    const { sunrise, sunset } = sun;
    setDayProgress(Math.max(0, Math.min(1, (nowTs - sunrise) / (sunset - sunrise))));
  }, [sun]);

  const clampedProgress = Math.max(0, Math.min(1, dayProgress));

  // 반원 위 태양 위치 계산 (왼쪽=일출, 오른쪽=일몰, 상단=정오)
  const angle = Math.PI * (1 - clampedProgress); // π → 0
  const cx = 100;
  const cy = 90;
  const r = 68;
  const sunX = cx + r * Math.cos(angle);
  const sunY = cy - r * Math.sin(angle);

  // 호 끝점
  const arcStartX = cx - r;
  const arcEndX = cx + r;
  const arcY = cy;

  // 진행된 호 경로 (일출 → 현재 위치)
  // sweep=1: 배경 반원과 동일한 방향 (왼쪽→위→오른쪽, 화면 기준 시계방향)
  // large-arc=0: 진행 호는 항상 0°~180° 이내이므로 항상 작은 호를 선택
  const progressPath =
    clampedProgress > 0
      ? `M ${arcStartX},${arcY} A ${r},${r} 0 0,1 ${sunX.toFixed(2)},${sunY.toFixed(2)}`
      : "";

  return (
    <section
      aria-label="일출 일몰"
      className="neu-raised p-2 h-full flex flex-col"
    >
      <h2 className="text-xs font-semibold tracking-[0.08em] uppercase text-[var(--color-text-sub)] mb-1 ml-1">
        일출 · 일몰
      </h2>

      <div className="neu-pressed rounded-xl p-4 flex-1">
      {/* SVG 최대 너비 제한 — w-full 단독 사용 시 넓은 그리드 컬럼에서 과도하게 확장됨 */}
      <div className="max-w-[280px] mx-auto">
      <svg
        viewBox="0 0 200 110"
        className="w-full"
        aria-hidden="true"
      >
        {/* 배경 반원 호 */}
        <path
          d={`M ${arcStartX},${arcY} A ${r},${r} 0 1,1 ${arcEndX},${arcY}`}
          fill="none"
          style={{ stroke: "var(--svg-track)" }}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* 진행된 호 */}
        {progressPath && (
          <path
            d={progressPath}
            fill="none"
            stroke="rgba(251,191,36,0.7)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        )}

        {/* 지평선 */}
        <line
          x1={arcStartX - 8}
          y1={arcY}
          x2={arcEndX + 8}
          y2={arcY}
          style={{ stroke: "var(--svg-horizon)" }}
          strokeWidth="1"
        />

        {/* 태양 마커 */}
        <circle
          cx={sunX}
          cy={sunY}
          r="5"
          fill="rgba(251,191,36,0.9)"
        />
      </svg>
      </div>

      {/* 일출/일몰 시각 */}
      <div className="flex justify-between mt-1">
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-[11px] text-[var(--color-text-sub)] uppercase tracking-widest">
            일출
          </span>
          <span className="text-sm font-semibold text-[var(--color-text-main)] tabular-nums">
            {fmtTime(sun.sunrise)}
          </span>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-[11px] text-[var(--color-text-sub)] uppercase tracking-widest">
            일몰
          </span>
          <span className="text-sm font-semibold text-[var(--color-text-main)] tabular-nums">
            {fmtTime(sun.sunset)}
          </span>
        </div>
      </div>

      {/* 낮 길이 — 아래 중앙 */}
      <div className="flex flex-col items-center gap-0.5 mt-2">
        <span className="text-sm font-semibold text-[var(--color-text-sub)] tabular-nums">
          {(() => {
            const secs = sun.sunset - sun.sunrise;
            const h = Math.floor(secs / 3600);
            const m = Math.floor((secs % 3600) / 60);
            return `${h}시간 ${m}분`;
          })()}
        </span>
      </div>
      </div>
    </section>
  );
}
