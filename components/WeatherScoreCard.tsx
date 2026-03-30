// 현재 날씨 별점 카드 — 서버 컴포넌트
// 온도·습도·공기질·강수 4개 항목 점수로 종합 별점 산출

import { Star, Thermometer, Droplets, Leaf, CloudRain } from "lucide-react";
import { calculateSeasonalWeatherScore } from "@/lib/seasonal-score";
import { tempTag, humTag, airTag, rainTag, type Tag } from "@/lib/metric-tags";

interface WeatherScoreCardProps {
  temp: number;
  feelsLike: number;
  humidity: number;
  pm25: number;
  pm10: number;
  maxPop: number;
  weatherMain: string;
  weatherDescription: string;
}

// ── 별 표시 ────────────────────────────────────────────────
function Stars({ score }: { score: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${score}점 만점 5점`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.min(1, Math.max(0, score - (i - 1)));
        const cls =
          fill >= 0.75
            ? "text-amber-400"
            : fill >= 0.25
            ? "text-amber-400/50"
            : "text-[var(--star-empty)]";
        return (
          <Star key={i} size={12} fill="currentColor" className={cls} aria-hidden="true" />
        );
      })}
    </div>
  );
}

// ── 점수 기반 텍스트 코멘트 (5단계) ─────────────────────────
function getComment(overall: number): string {
  if (overall >= 4.5) return "지금 밖에 나가기 딱 좋아요!";
  if (overall >= 3.5) return "외출하기 괜찮은 날씨예요.";
  if (overall >= 2.5) return "나쁘지 않지만, 준비물을 챙기세요.";
  if (overall >= 1.5) return "외출 시 주의가 필요해요.";
  return "실내에 머무르는 게 좋겠어요.";
}

// ── 항목 등급 태그 ─────────────────────────────────────────

function MetricTag({ icon, label, tag }: { icon: React.ReactNode; label: string; tag: Tag }) {
  const color =
    tag.variant === "good"    ? "text-[var(--metric-good)]" :
    tag.variant === "neutral" ? "text-[var(--metric-mid)]"  :
                                "text-[var(--metric-bad)]";
  return (
    <span className="flex items-center gap-1">
      <span aria-hidden="true">{icon}</span>
      <span className="text-[var(--color-text-sub)]">{label}</span>
      <span className={`font-semibold ${color}`}>{tag.label}</span>
    </span>
  );
}

// ── 메인 카드 ──────────────────────────────────────────────
export default function WeatherScoreCard({
  temp,
  feelsLike,
  humidity,
  pm25,
  pm10,
  maxPop,
  weatherMain,
  weatherDescription,
}: WeatherScoreCardProps) {
  const month = new Date().getMonth() + 1;
  const { tempScore, humScore, humDirection, airScore, overall, season } =
    calculateSeasonalWeatherScore({ temp, feelsLike, humidity, pm25, pm10, maxPop, month, weatherMain });

  return (
    <section
      aria-label="현재 날씨 평점"
      className="neu-raised p-2 h-full flex flex-col"
    >
      <h2 className="text-xs font-semibold tracking-[0.08em] uppercase text-[var(--color-text-sub)] mb-1 ml-1">
        현재 날씨 평점
      </h2>

      <div className="neu-pressed rounded-xl p-4 flex-1">
      {/* 종합 점수 + 별 */}
      <div className="flex items-start gap-2 mb-3">
        <span
          className="text-3xl leading-none text-[var(--color-text-main)]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "-0.02em" }}
        >
          {overall}
        </span>
        <div className="flex flex-col gap-0.5 pb-0.5">
          <Stars score={overall} />
          <span className="text-[11px] text-[var(--color-text-muted)] tracking-wider">
            / 5.0 점
          </span>
        </div>
      </div>

      {/* 텍스트 코멘트 */}
      <p className="text-sm text-[var(--color-text-sub)] mb-4 leading-snug break-keep">
        {getComment(overall)}
      </p>

      {/* 항목 태그 */}
      <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs">
        <MetricTag icon={<Thermometer size={12} className="text-red-400" />} label="온도" tag={tempTag(tempScore, season)} />
        <MetricTag icon={<Droplets size={12} className="text-blue-400" />}   label="습도" tag={humTag(humScore, humDirection, season)} />
        <MetricTag icon={<Leaf size={12} className="text-emerald-400" />}    label="공기" tag={airTag(airScore)} />
        <MetricTag icon={<CloudRain size={12} className="text-blue-400" />}  label="강수" tag={rainTag(weatherMain, weatherDescription)} />
      </div>
      </div>
    </section>
  );
}
