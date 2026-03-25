// 체감 쾌적도 카드 — 서버 컴포넌트
// 불쾌지수(THI) 반원 SVG 게이지 + 등급 표시

interface ComfortIndexCardProps {
  temp: number;
  humidity: number;
}

const THI_MIN = 40;
const THI_MAX = 90;

function calcTHI(temp: number, humidity: number): number {
  const thi =
    (9 / 5) * temp -
    0.55 * (1 - humidity / 100) * ((9 / 5) * temp - 26) +
    32;
  return Math.round(thi * 10) / 10;
}

function getGrade(thi: number): { label: string; textColor: string } {
  if (thi < 55) return { label: "매우 쾌적", textColor: "text-blue-300" };
  if (thi < 60) return { label: "쾌적",     textColor: "text-emerald-300" };
  if (thi < 68) return { label: "보통",     textColor: "text-yellow-300" };
  if (thi < 75) return { label: "불쾌",     textColor: "text-orange-300" };
  return             { label: "매우 불쾌", textColor: "text-red-400" };
}

export default function ComfortIndexCard({ temp, humidity }: ComfortIndexCardProps) {
  const thi = calcTHI(temp, humidity);
  const { label, textColor } = getGrade(thi);

  const progress = Math.max(0, Math.min(1, (thi - THI_MIN) / (THI_MAX - THI_MIN)));

  // 반원 geometry — viewBox 200×92 (하단 빈공간 트리밍)
  const cx = 100, cy = 82, r = 68;
  const arcStartX = cx - r;
  const arcEndX   = cx + r;
  const arcY      = cy;

  // 마커 위치 (angle: π=왼쪽, 0=오른쪽)
  const angle   = Math.PI * (1 - progress);
  const markerX = cx + r * Math.cos(angle);
  const markerY = cy - r * Math.sin(angle);

  // 진행된 호 경로
  const progressAngle = progress * Math.PI;
  const largeArcFlag  = progressAngle > Math.PI / 2 ? 1 : 0;
  const progressPath  =
    progress > 0
      ? `M ${arcStartX},${arcY} A ${r},${r} 0 ${largeArcFlag},1 ${markerX.toFixed(2)},${markerY.toFixed(2)}`
      : "";

  return (
    <section
      aria-label="체감 쾌적도"
      className="neu-raised p-5"
    >
      <h2 className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[var(--color-text-muted)] mb-3">
        체감 쾌적도
      </h2>

      {/* SVG 최대 너비 제한 — w-full 단독 사용 시 컬럼 너비만큼 확장되어 레이아웃 파괴 */}
      <div className="max-w-[190px] mx-auto">
        <svg viewBox="0 0 200 92" className="w-full" aria-hidden="true">
          <defs>
            <linearGradient id="thiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="rgba(96,165,250,0.95)" />
              <stop offset="28%"  stopColor="rgba(52,211,153,0.95)" />
              <stop offset="56%"  stopColor="rgba(251,191,36,0.95)" />
              <stop offset="78%"  stopColor="rgba(251,146,60,0.95)" />
              <stop offset="100%" stopColor="rgba(248,113,113,0.95)" />
            </linearGradient>
          </defs>

          {/* 배경 반원 호 */}
          <path
            d={`M ${arcStartX},${arcY} A ${r},${r} 0 1,1 ${arcEndX},${arcY}`}
            fill="none"
            stroke="var(--svg-track)"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* 전체 그라데이션 호 (저채도) */}
          <path
            d={`M ${arcStartX},${arcY} A ${r},${r} 0 1,1 ${arcEndX},${arcY}`}
            fill="none"
            stroke="url(#thiGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.25"
          />

          {/* 진행된 호 (강조) */}
          {progressPath && (
            <path
              d={progressPath}
              fill="none"
              stroke="url(#thiGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.9"
            />
          )}

          {/* 지평선 */}
          <line
            x1={arcStartX - 8} y1={arcY}
            x2={arcEndX + 8}   y2={arcY}
            stroke="var(--svg-horizon)"
            strokeWidth="1"
          />

          {/* 마커 */}
          <circle
            cx={markerX}
            cy={markerY}
            r="5"
            fill="var(--neu-bg)"
            stroke="var(--overlay-handle)"
            strokeWidth="2.5"
          />
        </svg>
      </div>

      {/* THI 수치 + 라벨 — SVG 외부 HTML로 렌더링 (CSS 변수 폰트 정상 적용) */}
      <div className="text-center -mt-1">
        <p
          className="text-3xl font-bold leading-tight"
          style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
        >
          {thi}
        </p>
        <p className="text-[9px] text-[var(--color-text-muted)] tracking-widest uppercase mt-0.5">
          불쾌지수 (THI)
        </p>
        <p className={`text-sm font-bold mt-1 ${textColor}`}>{label}</p>
      </div>
    </section>
  );
}
