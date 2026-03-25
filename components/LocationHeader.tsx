"use client";

import { useCurrentTime } from "@/hooks/useCurrentTime";
import type { Location } from "@/lib/types";
import { MapPin } from "lucide-react";

interface LocationHeaderProps {
  location: Location;
  onLocationClick?: () => void;
}

/**
 * LocationHeader — 클라이언트 컴포넌트
 * 위치명(좌측) + 현재 시각(우측) 헤더.
 * useCurrentTime 훅으로 1분마다 시각 갱신.
 */
export default function LocationHeader({ location, onLocationClick }: LocationHeaderProps) {
  const { timeString } = useCurrentTime();

  return (
    <header
      aria-label="위치 및 현재 시각"
      className="flex items-center justify-between px-5 pb-2"
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

      {/* 현재 시각 */}
      <time
        aria-label={`현재 시각 ${timeString}`}
        className="text-xs text-[var(--color-text-sub)] tabular-nums"
      >
        {timeString}
      </time>
    </header>
  );
}
