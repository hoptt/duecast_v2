"use client";

import type { Location } from "@/lib/types";
import { MapPin } from "lucide-react";

interface LocationHeaderProps {
  location: Location;
  observedAt?: number;
  timezoneOffset?: number;
  onLocationClick?: () => void;
}

/** 관측 시각을 2시간 슬롯으로 내림하여 "18시 기준" 형태로 반환 */
function formatObservedSlot(dt: number, tzOffset: number): string {
  const localMs = (dt + tzOffset) * 1000;
  const h = new Date(localMs).getUTCHours();
  const slot = Math.floor(h / 2) * 2;
  return `${slot}시 기준`;
}

/**
 * LocationHeader — 클라이언트 컴포넌트
 * 위치명(좌측) + 관측 데이터 시간대(우측) 헤더.
 */
export default function LocationHeader({ location, observedAt, timezoneOffset, onLocationClick }: LocationHeaderProps) {
  const slotLabel =
    observedAt != null && timezoneOffset != null
      ? formatObservedSlot(observedAt, timezoneOffset)
      : null;

  return (
    <header
      aria-label="위치 및 데이터 기준 시각"
      className="flex items-center justify-between px-4 pb-2"
      style={{ paddingTop: "1rem" }}
    >
      {/* 위치명 */}
      <button
        onClick={onLocationClick}
        aria-label="위치 변경"
        className="flex items-center gap-1.5 cursor-pointer"
        style={{ background: "transparent", border: "none", padding: 0 }}
      >
        <MapPin size={14} className="opacity-60" aria-hidden="true" />
        <span className="text-sm font-semibold text-[var(--color-text-main)] tracking-wide">
          {location.name}
        </span>
      </button>

      {/* 관측 데이터 시간대 */}
      {slotLabel && (
        <time
          aria-label={`관측 데이터 ${slotLabel}`}
          className="text-xs text-[var(--color-text-sub)] tabular-nums"
        >
          {slotLabel}
        </time>
      )}
    </header>
  );
}
