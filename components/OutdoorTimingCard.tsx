"use client";

import { useState, useRef } from "react";
import type { HourlyForecast } from "@/lib/types";
import { computeScore, buildTags, buildHeroTags, fmtLabel, type Tag, type TagVariant, type ScoreDetail } from "@/lib/outdoor-score";
import { Star, ChevronUp, ChevronDown } from "lucide-react";

// ── 점수 상위 N개 추출 ─────────────────────────────────────────────────────
function getTopSlots(
  forecast: HourlyForecast[],
  pm25: number,
  pm10: number,
  count = 3
): Array<{ item: HourlyForecast; detail: ScoreDetail }> {
  return forecast
    .map((item) => ({ item, detail: computeScore(item, pm25, pm10) }))
    .sort((a, b) => b.detail.overall - a.detail.overall)
    .slice(0, count)
    .sort((a, b) => a.item.dt - b.item.dt);
}

// ── 별 컴포넌트 ────────────────────────────────────────────────────────────
function Stars({ score }: { score: number }) {
  return (
    <div className="flex gap-px" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.min(1, Math.max(0, score - (i - 1)));
        return (
          <Star
            key={i}
            size={12}
            fill="currentColor"
            className={[
              "leading-none",
              fill >= 0.75 ? "text-amber-400" :
              fill >= 0.25 ? "text-amber-400/40" :
              "text-[var(--star-empty)]",
            ].join(" ")}
          />
        );
      })}
    </div>
  );
}

// ── 태그 칩 ────────────────────────────────────────────────────────────────
const TAG_STYLES: Record<TagVariant, string> = {
  good:    "bg-emerald-500/15 text-[var(--tag-good)]",
  neutral: "bg-[var(--overlay-hover)] text-[var(--color-text-sub)]",
  bad:     "bg-orange-500/15 text-[var(--tag-bad)]",
};

function TagChip({ label, variant }: Tag) {
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${TAG_STYLES[variant]}`}>
      {label}
    </span>
  );
}

// ── 메인 컴포넌트 ──────────────────────────────────────────────────────────
interface OutdoorTimingCardProps {
  forecast: HourlyForecast[];
  pm25: number;
  pm10: number;
}

export default function OutdoorTimingCard({ forecast, pm25, pm10 }: OutdoorTimingCardProps) {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const topSlots = getTopSlots(forecast, pm25, pm10, 3);
  const topDts = new Set(topSlots.map((s) => s.item.dt));

  return (
    <section
      aria-label="야외활동 추천 타이밍"
      className="neu-raised p-2"
    >
      {/* 헤더 */}
      <div className="mb-1 ml-1 flex items-center justify-between gap-2">
        <h2 className="text-xs font-semibold tracking-[0.08em] uppercase text-[var(--color-text-sub)] shrink-0">
          야외활동 추천 타이밍
        </h2>
        <p className="text-[11px] text-[var(--color-text-muted)] text-right leading-tight mr-1">
          온도·습도·공기·강수 계절별 지표
        </p>
      </div>

      {/* 추천 시간대 Hero */}
      <div className="neu-pressed flex flex-col rounded-xl mb-3">
        {topSlots.map(({ item, detail }, idx) => {
          const topTags = buildHeroTags(item, detail);
          const accentColor = detail.overall >= 4 ? "bg-emerald-500" : "bg-amber-400";

          return (
            <div
              key={item.dt}
              className={[
                "flex items-center gap-3 px-3 py-2",
                idx < topSlots.length - 1 ? "border-b border-[var(--overlay-border-subtle)]" : "",
              ].join(" ")}
            >
              <div className={`w-[3px] h-10 rounded-full shrink-0 ${accentColor}`} />
              <span className="text-xs font-medium tabular-nums text-[var(--color-text-main)] w-[84px] shrink-0">
                {fmtLabel(item.dt)}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <Stars score={detail.overall} />
                <span className="text-[11px] text-[var(--color-text-muted)] tabular-nums">
                  ({detail.overall})
                </span>
              </div>
              <div className="flex flex-wrap gap-1 justify-end flex-1 min-w-0">
                {topTags.map((tag, i) => (
                  <TagChip key={i} {...tag} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 토글 버튼 */}
      <button
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="neu-pill w-full text-[11px] text-[var(--color-text-muted)] hover:text-[var(--color-text-sub)]
                   transition-colors min-h-8 px-4 flex items-center justify-center gap-1"
      >
        {expanded
          ? <><span>접기</span><ChevronUp size={12} className="inline" /></>
          : <><span>전체 보기</span><ChevronDown size={12} className="inline" /></>
        }
      </button>

      {/* 아코디언 전체 리스트 */}
      <div
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{ maxHeight: expanded ? `${contentRef.current?.scrollHeight ?? 9999}px` : "0px" }}
      >
        <div ref={contentRef} className="flex flex-col mt-2">
          {forecast.map((item, idx) => {
            const detail = computeScore(item, pm25, pm10);
            const tags   = buildTags(item, detail);
            const isTop  = topDts.has(item.dt);

            return (
              <div
                key={item.dt}
                className={[
                  "flex items-center gap-2 py-2 px-2 rounded-md",
                  isTop ? "bg-[var(--overlay-accent)]" : "",
                  idx < forecast.length - 1 ? "border-b border-[var(--overlay-border-subtle)]" : "",
                ].join(" ")}
              >
                <span className="text-xs font-medium tabular-nums text-[var(--color-text-main)] w-[84px] shrink-0">
                  {fmtLabel(item.dt)}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <Stars score={detail.overall} />
                  <span className="text-[11px] text-[var(--color-text-muted)] tabular-nums">
                    ({detail.overall})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 justify-end flex-1 min-w-0">
                  {tags.map((tag, i) => (
                    <TagChip key={i} {...tag} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
