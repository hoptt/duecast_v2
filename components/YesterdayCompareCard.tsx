// 어제 대비 기온 비교 카드 — 서버 컴포넌트

import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

interface YesterdayCompareCardProps {
  currentTemp: number;
  yesterdayTemp: number;
}

export default function YesterdayCompareCard({
  currentTemp,
  yesterdayTemp,
}: YesterdayCompareCardProps) {
  const diff = currentTemp - yesterdayTemp;
  const absDiff = Math.abs(diff);

  const sign = diff > 0 ? "+" : diff < 0 ? "-" : "";
  const ArrowIcon = diff > 0 ? TrendingUp : diff < 0 ? TrendingDown : ArrowRight;

  const diffColor =
    diff > 0
      ? "text-rose-400"
      : diff < 0
      ? "text-sky-400"
      : "text-white/50";

  const descText =
    diff === 0
      ? "어제와 같은 기온이에요."
      : `어제보다 ${absDiff}° ${diff > 0 ? "높아요" : "낮아요"}`;

  return (
    <section
      aria-label="어제 대비 기온 비교"
      className="neu-raised p-5"
    >
      <h2 className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[var(--color-text-muted)] mb-3">
        어제 대비
      </h2>

      {/* 차이값 강조 */}
      <div className={`flex items-baseline gap-1 mb-1 ${diffColor}`}>
        <span
          className="text-4xl font-bold leading-none"
          style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
        >
          {sign}{absDiff}°
        </span>
        <ArrowIcon size={22} className="font-semibold" aria-hidden="true" />
      </div>

      {/* 설명 문장 */}
      <p className="text-sm text-[var(--color-text-sub)] mb-3 leading-snug">
        {descText}
      </p>

      {/* 어제 기온 참고값 */}
      <p className="text-[10px] text-[var(--color-text-muted)]">
        어제 기온 {yesterdayTemp}°C
      </p>
    </section>
  );
}
