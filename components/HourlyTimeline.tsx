"use client";

import { useState, useRef } from "react";
import type { HourlyForecast } from "@/lib/types";
import { WeatherIcon } from "@/lib/weather-icons";
import HourlyDetailSheet from "@/components/HourlyDetailSheet";

interface HourlyTimelineProps {
  forecast: HourlyForecast[];
  className?: string;
}

/**
 * HourlyTimeline — 클라이언트 컴포넌트
 * 6개 시간별 슬롯을 균등 배치로 표시. 슬롯 클릭 시 바텀시트 열림.
 */
export default function HourlyTimeline({ forecast, className = "mx-4" }: HourlyTimelineProps) {
  const [selectedSlot, setSelectedSlot] = useState<HourlyForecast | null>(null);
  const slots = forecast;

  const scrollRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ isDragging: false, startX: 0, scrollLeft: 0, moved: false });

  function onMouseDown(e: React.MouseEvent) {
    const el = scrollRef.current;
    if (!el) return;
    dragState.current = { isDragging: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft, moved: false };
    el.style.cursor = "grabbing";
  }

  function onMouseMove(e: React.MouseEvent) {
    const d = dragState.current;
    if (!d.isDragging) return;
    const el = scrollRef.current;
    if (!el) return;
    const dx = e.pageX - el.offsetLeft - d.startX;
    if (Math.abs(dx) > 3) d.moved = true;
    el.scrollLeft = d.scrollLeft - dx;
  }

  function onMouseUp() {
    const el = scrollRef.current;
    if (el) el.style.cursor = "";
    dragState.current.isDragging = false;
  }

  return (
    <>
      <section
        aria-label="시간별 날씨"
        className={`neu-raised ${className} p-2`}
      >
        <h2 className="text-xs font-semibold tracking-[0.08em] uppercase text-[var(--color-text-sub)] mb-1 ml-1">
          시간별 예보
        </h2>

        <div
          ref={scrollRef}
          className="neu-pressed rounded-xl p-3 overflow-x-auto select-none"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
        <div role="list" className="flex items-end gap-2" style={{ minWidth: "max-content" }}>
          {slots.map((slot) => (
            <button
              key={slot.dt}
              role="listitem"
              aria-label={`${slot.time} ${slot.weather.description} ${slot.temp}도, 자세히 보기`}
              onClick={() => { if (!dragState.current.moved) setSelectedSlot(slot); }}
              className={[
                selectedSlot?.dt === slot.dt ? "neu-pressed" : "neu-button",
                "flex flex-col items-center gap-1.5 py-1.5 px-1 rounded-xl",
                "transition-all duration-150 cursor-pointer",
              ].join(" ")}
              style={{ minWidth: "57px", flex:1 }}
            >
              <span className="text-[11px] text-[var(--color-text-sub)] tabular-nums">
                {slot.time}
              </span>
              <span className="leading-none" aria-hidden="true">
                <WeatherIcon condition={slot.weather.main} size={24} />
              </span>
              <span className="text-xs font-medium text-[var(--color-text-main)] tabular-nums">
                {slot.temp}°
              </span>
            </button>
          ))}
        </div>
        </div>
      </section>

      <HourlyDetailSheet
        slot={selectedSlot}
        onClose={() => setSelectedSlot(null)}
      />
    </>
  );
}
