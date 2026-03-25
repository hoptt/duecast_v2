/**
 * LoadingSkeleton — 서버 컴포넌트
 * 날씨 앱의 실제 레이아웃을 정확히 미러링하는 스켈레톤 UI.
 * 위→아래 stagger shimmer로 "Crystallizing" 효과.
 * 배경 없음 — page.tsx의 weather-bg 위에 올려짐.
 */
export default function LoadingSkeleton() {
  return (
    <div className="flex flex-col flex-1 w-full px-4 pt-10 pb-24 gap-5">

      {/* ── Section A: 위치 헤더 ── */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[var(--overlay-badge)] animate-pulse" />
          <div className="h-4 w-20 rounded-full animate-shimmer" />
        </div>
        <div className="h-3 w-14 rounded-full animate-shimmer animation-delay-100" />
      </div>

      {/* ── Section B: 메인 기온 영역 ── */}
      <div className="flex flex-col items-center gap-3 py-6">
        {/* 날씨 아이콘 원형 */}
        <div className="w-20 h-20 rounded-full animate-shimmer animation-delay-100" />

        {/* 기온 대형 블록 — DM Serif Display 크기 모방 (72px) */}
        <div className="h-[72px] w-36 rounded-2xl animate-shimmer animation-delay-200" />

        {/* 체감온도 + 날씨 설명 */}
        <div className="flex flex-col items-center gap-2">
          <div className="h-4 w-28 rounded-full animate-shimmer animation-delay-200" />
          <div className="h-3 w-16 rounded-full animate-shimmer animation-delay-300 opacity-70" />
        </div>
      </div>

      {/* ── Section C: 행동 가이드 카드 ── */}
      <div className="neu-raised p-4 flex flex-col gap-0">

        {/* 카드 헤더 레이블 */}
        <div className="h-3 w-20 rounded-full mb-4 animate-shimmer animation-delay-300" />

        {/* 가이드 행 1 */}
        <div>
          <div className="flex items-center gap-3 py-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--overlay-badge)] shrink-0 animate-shimmer animation-delay-300" />
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="h-3.5 w-3/4 rounded-full animate-shimmer animation-delay-300" />
              <div className="h-2.5 w-1/2 rounded-full animate-shimmer animation-delay-400 opacity-70" />
            </div>
          </div>
          <div className="h-px bg-[var(--overlay-divider)] mx-1" />
        </div>

        {/* 가이드 행 2 */}
        <div>
          <div className="flex items-center gap-3 py-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--overlay-badge)] shrink-0 animate-shimmer animation-delay-400" />
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="h-3.5 w-2/3 rounded-full animate-shimmer animation-delay-400" />
              <div className="h-2.5 w-2/5 rounded-full animate-shimmer animation-delay-400 opacity-70" />
            </div>
          </div>
          <div className="h-px bg-[var(--overlay-divider)] mx-1" />
        </div>

        {/* 가이드 행 3 */}
        <div className="flex items-center gap-3 py-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--overlay-badge)] shrink-0 animate-shimmer animation-delay-500" />
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="h-3.5 w-4/5 rounded-full animate-shimmer animation-delay-500" />
            <div className="h-2.5 w-1/3 rounded-full animate-shimmer animation-delay-500 opacity-70" />
          </div>
        </div>

      </div>

      {/* ── Section D: 시간별 타임라인 ── */}
      <div className="neu-raised p-4">

        {/* 타임라인 헤더 레이블 */}
        <div className="h-3 w-24 rounded-full mb-4 animate-shimmer animation-delay-400" />

        {/* 6개 슬롯 균등 배치 */}
        <div className="flex justify-between items-end gap-1">
          {/* 슬롯 1 */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="h-2.5 w-7 rounded-full animate-shimmer animation-delay-400" />
            <div className="w-8 h-8 rounded-full animate-shimmer animation-delay-400" />
            <div className="h-3 w-7 rounded-full animate-shimmer animation-delay-400" />
          </div>
          {/* 슬롯 2 */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="h-2.5 w-7 rounded-full animate-shimmer animation-delay-400" />
            <div className="w-8 h-8 rounded-full animate-shimmer animation-delay-500" />
            <div className="h-3 w-7 rounded-full animate-shimmer animation-delay-500" />
          </div>
          {/* 슬롯 3 */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="h-2.5 w-7 rounded-full animate-shimmer animation-delay-500" />
            <div className="w-8 h-8 rounded-full animate-shimmer animation-delay-500" />
            <div className="h-3 w-7 rounded-full animate-shimmer animation-delay-500" />
          </div>
          {/* 슬롯 4 */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="h-2.5 w-7 rounded-full animate-shimmer animation-delay-500" />
            <div className="w-8 h-8 rounded-full animate-pulse bg-[var(--overlay-badge)]" />
            <div className="h-3 w-7 rounded-full animate-pulse bg-[var(--overlay-hover)]" />
          </div>
          {/* 슬롯 5 */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="h-2.5 w-7 rounded-full animate-pulse bg-[var(--overlay-hover)]" />
            <div className="w-8 h-8 rounded-full animate-pulse bg-[var(--overlay-hover)]" />
            <div className="h-3 w-7 rounded-full animate-pulse bg-[var(--overlay-hover)]" />
          </div>
          {/* 슬롯 6 */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="h-2.5 w-7 rounded-full animate-pulse bg-[var(--overlay-cell)]" />
            <div className="w-8 h-8 rounded-full animate-pulse bg-[var(--overlay-cell)]" />
            <div className="h-3 w-7 rounded-full animate-pulse bg-[var(--overlay-cell)]" />
          </div>
        </div>

      </div>

    </div>
  );
}
