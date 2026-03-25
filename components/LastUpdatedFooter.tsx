"use client";

import { useCurrentTime } from "@/hooks/useCurrentTime";

interface LastUpdatedFooterProps {
  lastUpdated: number; // Unix timestamp
}

/**
 * LastUpdatedFooter — 클라이언트 컴포넌트
 * "마지막 업데이트: HH:MM (N분 전)" 표시.
 * useCurrentTime 훅으로 "N분 전" 실시간 계산.
 */
export default function LastUpdatedFooter({ lastUpdated }: LastUpdatedFooterProps) {
  const { hour, minute } = useCurrentTime();

  const updatedDate = new Date(lastUpdated * 1000);
  const updatedHour = updatedDate.getHours();
  const updatedMin = updatedDate.getMinutes();
  const updatedStr = `${String(updatedHour).padStart(2, "0")}:${String(updatedMin).padStart(2, "0")}`;

  const nowTotalMin = hour * 60 + minute;
  const updatedTotalMin = updatedHour * 60 + updatedMin;
  const diffMin = Math.max(0, nowTotalMin - updatedTotalMin);

  return (
    <p suppressHydrationWarning className="text-xs text-[var(--color-text-muted)] text-right px-1">
      마지막 업데이트: {updatedStr} ({diffMin}분 전)
    </p>
  );
}
