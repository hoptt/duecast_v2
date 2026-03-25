// 생활지수 카드 — 서버 컴포넌트
// 빨래·세차·운동 3종 지수를 원형 진행률 링으로 시각화

import { Waves, Car, Activity } from "lucide-react";

interface LifestyleIndexCardProps {
  temp: number;
  humidity: number;
  maxPop: number;
  pm25: number;
}

// ── 지수 계산 ───────────────────────────────────────────
function calcLaundry(temp: number, humidity: number, maxPop: number): number {
  const score =
    (100 - humidity) * 0.5 +
    Math.min(temp / 30, 1) * 100 * 0.3 +
    (100 - maxPop) * 0.2;
  return Math.round(Math.max(0, Math.min(100, score)));
}

function calcCarWash(maxPop: number, pm25: number): number {
  const score =
    (100 - maxPop) * 0.65 +
    (1 - Math.min(pm25 / 75, 1)) * 100 * 0.35;
  return Math.round(Math.max(0, Math.min(100, score)));
}

function calcExercise(temp: number, humidity: number, pm25: number): number {
  const tempScore = Math.max(0, 1 - Math.abs(temp - 20) / 25) * 100;
  const score =
    tempScore * 0.4 +
    (1 - Math.min(pm25 / 75, 1)) * 100 * 0.4 +
    (100 - humidity) * 0.2;
  return Math.round(Math.max(0, Math.min(100, score)));
}

// ── 등급 & 색상 ─────────────────────────────────────────
function getGrade(score: number): { label: string; gradeVar: string; strokeColor: string } {
  if (score >= 70) return {
    label: "좋음",
    gradeVar: "var(--grade-good)",
    strokeColor: "var(--grade-good)",
  };
  if (score >= 40) return {
    label: "보통",
    gradeVar: "var(--grade-mid)",
    strokeColor: "var(--grade-mid)",
  };
  return {
    label: "나쁨",
    gradeVar: "var(--grade-bad)",
    strokeColor: "var(--grade-bad)",
  };
}

// ── 원형 링 컴포넌트 ─────────────────────────────────────
const RING_R = 28;
const CIRCUMFERENCE = 2 * Math.PI * RING_R;

interface RingProps {
  score: number;
  icon: React.ReactNode;
  indexName: string;
}

function IndexRing({ score, icon, indexName }: RingProps) {
  const { label, gradeVar, strokeColor } = getGrade(score);
  const dashOffset = CIRCUMFERENCE * (1 - score / 100);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* 링 SVG */}
      <div className="relative w-[70px] h-[70px]">
        <svg
          viewBox="0 0 70 70"
          className="w-full h-full -rotate-90"
          aria-hidden="true"
        >
          {/* 배경 링 */}
          <circle
            cx="35"
            cy="35"
            r={RING_R}
            fill="none"
            style={{ stroke: "var(--ring-track)" }}
            strokeWidth="5"
          />
          {/* 진행 링 */}
          <circle
            cx="35"
            cy="35"
            r={RING_R}
            fill="none"
            stroke={strokeColor}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            strokeDashoffset={dashOffset}
          />
        </svg>

        {/* 중앙 아이콘 */}
        <div className="absolute inset-0 flex items-center justify-center" role="img" aria-label={indexName}>
          {icon}
        </div>
      </div>

      {/* 지수명 + 점수 + 등급 */}
      <div className="text-center">
        <p className="text-[10px] text-[var(--color-text-muted)] tracking-wider">{indexName}</p>
        <p
          className="text-xl font-bold tabular-nums leading-tight"
          style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
        >
          {score}
        </p>
        <p className="text-[11px] font-semibold" style={{ color: gradeVar }}>{label}</p>
      </div>
    </div>
  );
}

// ── 메인 카드 ────────────────────────────────────────────
export default function LifestyleIndexCard({
  temp,
  humidity,
  maxPop,
  pm25,
}: LifestyleIndexCardProps) {
  const laundry  = calcLaundry(temp, humidity, maxPop);
  const carWash  = calcCarWash(maxPop, pm25);
  const exercise = calcExercise(temp, humidity, pm25);

  return (
    <section
      aria-label="생활지수"
      className="neu-raised p-5"
    >
      <h2 className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[var(--color-text-muted)] mb-5">
        생활지수
      </h2>

      <div className="grid grid-cols-3 gap-2">
        <IndexRing score={laundry}  icon={<Waves size={24} className="text-blue-300" />}    indexName="빨래" />
        <IndexRing score={carWash}  icon={<Car size={24} className="text-slate-300" />}     indexName="세차" />
        <IndexRing score={exercise} icon={<Activity size={24} className="text-emerald-400" />} indexName="운동" />
      </div>
    </section>
  );
}
