// 현재 날씨 별점 카드 — 서버 컴포넌트
// 온도·습도·공기질·강수 4개 항목 점수로 종합 별점 산출

import { Star, Thermometer, Droplets, Leaf, CloudRain } from "lucide-react";
import { calculateSeasonalWeatherScore, type Season, type HumDirection } from "@/lib/seasonal-score";

interface WeatherScoreCardProps {
  temp: number;
  feelsLike: number;
  humidity: number;
  pm25: number;
  pm10: number;
  maxPop: number;
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
type MetricType = "temp" | "humidity" | "air" | "rain";

// 온도: 계절별 라벨
const SEASON_TEMP_LABELS: Record<Season, [string, string, string]> = {
  spring: ["쾌적", "선선", "쌀쌀"],
  summer: ["시원", "더움", "폭염"],
  autumn: ["쾌적", "선선", "쌀쌀"],
  winter: ["포근", "쌀쌀", "꽁꽁"],
};

// 습도: 방향(건조/습함) + 계절별 라벨
function humLabel(score: number, direction: HumDirection, season: Season): string {
  if (score >= 4) return season === "summer" ? "산뜻" : "뽀송";
  if (direction === "humid") {
    if (score >= 3) return "습함";
    return season === "summer" ? "끈적" : "눅눅";
  }
  if (score >= 3) return "건조";
  return season === "winter" ? "바싹" : "까칠";
}

// 공기: 3단계 고정 라벨
const AIR_LABELS: [string, string, string] = ["좋음", "보통", "나쁨"];

function gradeLabel(score: number, metric: MetricType, season: Season, humDirection?: HumDirection, weatherDescription?: string): string {
  if (metric === "temp") {
    const labels = SEASON_TEMP_LABELS[season];
    if (score >= 4) return labels[0];
    if (score >= 3) return labels[1];
    return labels[2];
  }
  if (metric === "rain") return weatherDescription ?? "맑음";
  if (metric === "humidity" && humDirection) return humLabel(score, humDirection, season);
  if (score >= 4) return AIR_LABELS[0];
  if (score >= 3) return AIR_LABELS[1];
  return AIR_LABELS[2];
}

function MetricTag({
  icon, label, score, metric, season, humDirection, weatherDescription,
}: {
  icon: React.ReactNode;
  label: string;
  score: number;
  metric: MetricType;
  season: Season;
  humDirection?: HumDirection;
  weatherDescription?: string;
}) {
  const grade = gradeLabel(score, metric, season, humDirection, weatherDescription);
  const color =
    metric === "rain" && score < 5
      ? "text-[var(--metric-bad)]"
      : score >= 4
      ? "text-[var(--metric-good)]"
      : score >= 3
      ? "text-[var(--metric-mid)]"
      : "text-[var(--metric-bad)]";
  return (
    <span className="flex items-center gap-1">
      <span aria-hidden="true">{icon}</span>
      <span className="text-[var(--color-text-sub)]">{label}</span>
      <span className={`font-semibold ${color}`}>{grade}</span>
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
  weatherDescription,
}: WeatherScoreCardProps) {
  const month = new Date().getMonth() + 1;
  const { tempScore, humScore, humDirection, airScore, rainScore, overall, season } =
    calculateSeasonalWeatherScore({ temp, feelsLike, humidity, pm25, pm10, maxPop, month });

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
        <MetricTag icon={<Thermometer size={12} className="text-red-400" />}  label="온도" score={tempScore} metric="temp"     season={season} />
        <MetricTag icon={<Droplets size={12} className="text-blue-400" />}    label="습도" score={humScore}  metric="humidity" season={season} humDirection={humDirection} />
        <MetricTag icon={<Leaf size={12} className="text-emerald-400" />}     label="공기" score={airScore}  metric="air"      season={season} />
        <MetricTag icon={<CloudRain size={12} className="text-blue-400" />}   label="강수" score={rainScore} metric="rain"     season={season} weatherDescription={weatherDescription} />
      </div>
      </div>
    </section>
  );
}
