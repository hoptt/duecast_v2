import { CloudSun, Shirt, Clock, TreePine } from "lucide-react";

const FEATURES = [
  { icon: CloudSun,  label: "실시간 날씨 & 체감온도" },
  { icon: Shirt,     label: "옷차림 · 우산 행동 가이드" },
  { icon: Clock,     label: "시간별 예보 타임라인" },
  { icon: TreePine,  label: "외출 최적 시간 추천" },
] as const;

/**
 * DesktopSidebarIntro — 데스크탑 좌측 앱 소개 패널
 * 웹 브라우저 1280px 이상에서만 표시 (CSS로 제어)
 */
export default function DesktopSidebarIntro() {
  return (
    <div
      className="neu-raised-lg flex flex-col gap-4 p-5"
      style={{ borderRadius: "var(--radius-card)", width: 200 }}
    >
      {/* 로고 + 앱명 */}
      <div className="flex items-center gap-2.5">
        <div
          className="neu-circle w-9 h-9 flex items-center justify-center text-base select-none shrink-0"
          aria-hidden="true"
        >
          🌤
        </div>
        <div>
          <h2
            className="text-sm font-semibold leading-tight"
            style={{ color: "var(--color-text-main)", fontFamily: "var(--font-display)" }}
          >
            듀캐스트
          </h2>
          <p
            className="text-[10px] leading-snug"
            style={{ color: "var(--color-text-muted)" }}
          >
            한 눈 날씨 서비스
          </p>
        </div>
      </div>

      {/* 구분선 */}
      <div style={{ height: 1, background: "var(--color-divider)" }} />

      {/* 주요 기능 리스트 */}
      <ul className="flex flex-col gap-2" role="list">
        {FEATURES.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2">
            <span
              className="neu-flat w-6 h-6 flex items-center justify-center shrink-0"
              style={{ borderRadius: "var(--radius-icon)" }}
            >
              <Icon size={12} style={{ color: "var(--color-primary)" }} strokeWidth={1.8} />
            </span>
            <span className="text-xs" style={{ color: "var(--color-text-sub)" }}>
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
