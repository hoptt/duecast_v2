import { Smartphone } from "lucide-react";

/**
 * DesktopSidebarDownload — 데스크탑 우측 앱 다운로드 패널
 * 웹 브라우저 1280px 이상에서만 표시 (CSS로 제어)
 */
export default function DesktopSidebarDownload() {
  return (
    <div
      className="neu-raised-lg flex flex-col gap-4 p-5"
      style={{ borderRadius: "var(--radius-card)", width: 200 }}
    >
      {/* 헤딩 */}
      <div className="flex items-center gap-2">
        <Smartphone size={14} style={{ color: "var(--color-primary)" }} strokeWidth={1.8} />
        <h2
          className="text-sm font-semibold"
          style={{ color: "var(--color-text-main)" }}
        >
          앱으로 설치하기
        </h2>
      </div>

      {/* QR 코드 영역 */}
      <div
        className="neu-pressed flex flex-col items-center justify-center gap-1.5 py-4"
        style={{ borderRadius: "var(--radius-card-sm)" }}
      >
        <div
          className="w-20 h-20"
          style={{
            background: "var(--color-text-main)",
            borderRadius: 4,
            opacity: 0.08,
          }}
          aria-label="QR 코드 (준비 중)"
        />
      </div>

      {/* 스토어 버튼 */}
      <div className="flex flex-col gap-1.5">
        <button
          className="neu-button w-full h-8 flex items-center justify-center gap-1.5 text-xs font-medium"
          style={{
            borderRadius: "var(--radius-card-sm)",
            color: "var(--color-text-main)",
          }}
          disabled
          aria-label="App Store 출시 예정"
        >
          <span aria-hidden="true">🍎</span> App Store
        </button>
        <button
          className="neu-button w-full h-8 flex items-center justify-center gap-1.5 text-xs font-medium"
          style={{
            borderRadius: "var(--radius-card-sm)",
            color: "var(--color-text-main)",
          }}
          disabled
          aria-label="Google Play 출시 예정"
        >
          <span aria-hidden="true">▶</span> Google Play
        </button>
        <p className="text-center text-[10px]" style={{ color: "var(--color-text-muted)" }}>
          출시 예정
        </p>
      </div>
    </div>
  );
}
