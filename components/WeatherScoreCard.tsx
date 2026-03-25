// 오늘 날씨 별점 카드 — 서버 컴포넌트
// 온도·습도·공기질·강수 4개 항목 점수로 종합 별점 산출

import { Star, Thermometer, Droplets, Leaf, CloudRain } from "lucide-react";

interface WeatherScoreCardProps {
  temp: number;
  humidity: number;
  pm25: number;
  maxPop: number;
}

// ── 점수 계산 (0 ~ 5) ──────────────────────────────────────
function calcScores(temp: number, humidity: number, pm25: number, maxPop: number) {
  const tempScore  = +(5 * (1 - Math.min(Math.abs(temp - 20) / 20, 1))).toFixed(1);
  const humScore   = +(5 * (1 - Math.min(Math.abs(humidity - 50) / 50, 1))).toFixed(1);
  const airScore   = +(5 * (1 - Math.min(pm25 / 75, 1))).toFixed(1);
  const rainScore  = +(5 * (1 - maxPop / 100)).toFixed(1);
  const overall    = +((tempScore + humScore + airScore + rainScore) / 4).toFixed(1);
  return { tempScore, humScore, airScore, rainScore, overall };
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
          <Star key={i} size={14} fill="currentColor" className={cls} aria-hidden="true" />
        );
      })}
    </div>
  );
}

// ── 점수 기반 텍스트 코멘트 ─────────────────────────────────
function getComment(overall: number): string {
  if (overall >= 4.0) return "야외활동하기 딱 좋은 날이에요!";
  if (overall >= 3.0) return "대체로 괜찮은 날씨예요. 가볍게 외출해보세요.";
  if (overall >= 2.0) return "외출 시 준비물을 챙기세요.";
  return "실내활동을 추천해요.";
}

// ── 항목 등급 태그 ─────────────────────────────────────────
function gradeLabel(score: number): string {
  if (score >= 4) return "좋음";
  if (score >= 3) return "보통";
  return "나쁨";
}

function MetricTag({ icon, label, score }: { icon: React.ReactNode; label: string; score: number }) {
  const grade = gradeLabel(score);
  const color =
    score >= 4
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
  humidity,
  pm25,
  maxPop,
}: WeatherScoreCardProps) {
  const { tempScore, humScore, airScore, rainScore, overall } = calcScores(
    temp,
    humidity,
    pm25,
    maxPop
  );

  return (
    <section
      aria-label="오늘 날씨 평점"
      className="neu-raised p-2 h-full flex flex-col"
    >
      <h2 className="text-xs font-semibold tracking-[0.08em] uppercase text-[var(--color-text-sub)] mb-1 ml-1">
        오늘 날씨 평점
      </h2>

      <div className="neu-pressed rounded-xl p-4 flex-1">
      {/* 종합 점수 + 별 */}
      <div className="flex items-end gap-3 mb-3">
        <span
          className="text-4xl leading-none text-[var(--color-text-main)]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "-0.02em" }}
        >
          {overall}
        </span>
        <div className="flex flex-col gap-1 pb-0.5">
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
        <MetricTag icon={<Thermometer size={12} className="text-red-400" />}  label="온도" score={tempScore} />
        <MetricTag icon={<Droplets size={12} className="text-blue-400" />}    label="습도" score={humScore}  />
        <MetricTag icon={<Leaf size={12} className="text-emerald-400" />}     label="공기" score={airScore}  />
        <MetricTag icon={<CloudRain size={12} className="text-blue-400" />}   label="강수" score={rainScore} />
      </div>
      </div>
    </section>
  );
}
