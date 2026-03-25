"use client";

import type { TabId } from "@/lib/types";
import { useCurrentTime } from "@/hooks/useCurrentTime";

const TABS: { id: TabId; label: string; disabled: boolean }[] = [
  { id: "today",    label: "오늘",  disabled: false },
  { id: "weekly",   label: "주간",  disabled: true  },
  { id: "location", label: "위치",  disabled: false },
  { id: "settings", label: "설정",  disabled: false },
];

interface HeaderNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

/**
 * HeaderNav — 클라이언트 컴포넌트
 * 데스크탑(lg+) 전용 상단 탭 네비게이션.
 * 로고(Italic DM Serif) + 현재 시각 좌측, 탭 버튼 4개 우측.
 */
export default function HeaderNav({ activeTab, onTabChange }: HeaderNavProps) {
  const { timeString } = useCurrentTime();

  return (
    <header
      className="flex items-center justify-between px-8 h-16 shrink-0 neu-raised-lg rounded-none"
    >
      {/* 로고 + 시각 */}
      <div className="flex items-center gap-3">
        <span
          className="text-xl text-[var(--color-text-main)] tracking-tight select-none"
          style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
        >
          듀캐스트
        </span>
        <time
          aria-label={`현재 시각 ${timeString}`}
          className="text-xs text-[var(--color-text-muted)] tabular-nums"
        >
          {timeString}
        </time>
      </div>

      {/* 탭 버튼 */}
      <nav aria-label="상단 탭 내비게이션" className="flex items-center gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { if (!tab.disabled) onTabChange(tab.id); }}
            disabled={tab.disabled}
            aria-current={activeTab === tab.id ? "page" : undefined}
            className={[
              "px-5 py-3 min-h-11 rounded-full text-sm font-medium transition-all duration-150",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              activeTab === tab.id
                ? "neu-pressed rounded-full text-[var(--color-primary)]"
                : "text-[var(--color-text-sub)] hover:text-[var(--color-text-main)]",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
