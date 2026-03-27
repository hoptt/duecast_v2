import DesktopSidebarIntro from "@/components/DesktopSidebarIntro";
import DesktopSidebarDownload from "@/components/DesktopSidebarDownload";

/**
 * DesktopSidebarLayout — 앱 본문 + 우측 사이드바
 *
 * 웹 브라우저 xl(1280px) 이상: 중앙(앱 본문) | 우측(앱 소개 + 다운로드)
 * 모바일 / Flutter 앱 환경(`data-env="app"`): 중앙 단일 컬럼만 표시
 */
export default function DesktopSidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh">
      {/* 중앙 — 앱 본문 (기존 레이아웃 그대로) */}
      {children}

      {/* 우측 사이드바 — 본문 밖 absolute, 본문을 밀지 않음 */}
      <aside
        className="desktop-sidebar hidden xl:flex flex-col gap-4 fixed top-6 pt-0"
        style={{ left: "calc(50% + 240px + 12px)" }}
        aria-label="앱 소개 및 다운로드"
      >
        <DesktopSidebarIntro />
        <DesktopSidebarDownload />
      </aside>
    </div>
  );
}
