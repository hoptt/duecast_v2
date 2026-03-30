"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { HourlyForecast } from "@/lib/types";
import { computeScore, buildTags, fmtLabel } from "@/lib/outdoor-score";
import { humTag, airTag, rainTag } from "@/lib/metric-tags";
import { WeatherIcon } from "@/lib/weather-icons";
import { X, Droplets, CloudRain, Leaf, Star } from "lucide-react";

// ── 공유 서브컴포넌트 ──────────────────────────────────────────────────────

type TagVariant = "good" | "neutral" | "bad";
interface Tag { label: string; variant: TagVariant }

const TAG_STYLES: Record<TagVariant, string> = {
  good:    "bg-emerald-500/20 text-[var(--tag-good)] border border-emerald-500/20",
  neutral: "bg-[var(--overlay-hover)] text-[var(--color-text-sub)] border border-[var(--overlay-border-subtle)]",
  bad:     "bg-orange-500/20 text-[var(--tag-bad)] border border-orange-500/20",
};

function TagChip({ label, variant }: Tag) {
  return (
    <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${TAG_STYLES[variant]}`}>
      {label}
    </span>
  );
}

function Stars({ score, size = "md" }: { score: number; size?: "md" | "lg" }) {
  const iconSize = size === "lg" ? 18 : 13;
  return (
    <div className="flex gap-0.5" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.min(1, Math.max(0, score - (i - 1)));
        return (
          <Star
            key={i}
            size={iconSize}
            fill="currentColor"
            className={[
              "leading-none",
              fill >= 0.75 ? "text-amber-400" :
              fill >= 0.25 ? "text-amber-400/35" :
              "text-[var(--star-empty)]",
            ].join(" ")}
          />
        );
      })}
    </div>
  );
}

// ── 점수 배지 ──────────────────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number }) {
  const { ring, text, bg, label } =
    score >= 4
      ? { ring: "ring-emerald-400/50", text: "text-emerald-300", bg: "bg-emerald-500/10", label: "최적" }
      : score >= 3
      ? { ring: "ring-amber-400/50",   text: "text-amber-300",   bg: "bg-amber-500/10",  label: "보통" }
      : { ring: "ring-orange-400/50",  text: "text-orange-300",  bg: "bg-orange-500/10", label: "나쁨" };

  return (
    <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl ring-2 ${ring} ${bg}`}>
      <span className={`text-xl font-bold tabular-nums leading-none ${text}`}>{score}</span>
      <span className={`text-[10px] font-semibold mt-0.5 ${text} opacity-80`}>{label}</span>
    </div>
  );
}

// ── 스탯 셀 ───────────────────────────────────────────────────────────────

type GradeVariant = "good" | "neutral" | "bad";
const GRADE_COLOR: Record<GradeVariant, string> = {
  good:    "text-[var(--metric-good)]",
  neutral: "text-[var(--metric-mid)]",
  bad:     "text-[var(--metric-bad)]",
};

function StatCell({ icon, label, value, grade, gradeVariant }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  grade: string;
  gradeVariant: GradeVariant;
}) {
  return (
    <div className="flex flex-col items-center gap-1 py-3 flex-1 rounded-xl bg-[var(--overlay-cell)] border border-[var(--overlay-border-subtle)]">
      <span className="leading-none">{icon}</span>
      <span className="text-[15px] font-semibold text-[var(--color-text-main)] tabular-nums">{value}</span>
      <span className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-wide">{label}</span>
      <span className={`text-[11px] font-semibold ${GRADE_COLOR[gradeVariant]}`}>{grade}</span>
    </div>
  );
}


// ── 메인 바텀시트 ─────────────────────────────────────────────────────────

interface HourlyDetailSheetProps {
  slot: HourlyForecast | null;
  onClose: () => void;
}

export default function HourlyDetailSheet({ slot, onClose }: HourlyDetailSheetProps) {
  const [animState, setAnimState] = useState<"hidden" | "entering" | "open" | "exiting">("hidden");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // slot 변화 감지 → 열기
  useEffect(() => {
    if (slot) {
      setAnimState("entering");
      // rAF로 entering → open 전환 (CSS transition 발화를 위해)
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimState("open"));
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [slot]);

  function handleClose() {
    if (animState === "exiting") return;
    setAnimState("exiting");
    timerRef.current = setTimeout(() => {
      setAnimState("hidden");
      onClose();
    }, 340);
  }

  // 배경 클릭 — sheet는 stopPropagation 처리되어 있으므로
  // outer div에 도달하는 모든 클릭 = 외부 클릭
  function handleBackdropClick() {
    handleClose();
  }

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  if (animState === "hidden" || !slot) return null;

  const detail = computeScore(slot);
  const score  = detail.overall;
  const tags   = buildTags(slot, detail);
  const label = fmtLabel(slot.dt);

  const isOpen    = animState === "open";
  const isExiting = animState === "exiting";

  // 백드롭 & 시트 트랜지션
  const backdropStyle: React.CSSProperties = {
    opacity: isOpen ? 1 : 0,
    transition: isExiting
      ? "opacity 320ms cubic-bezier(0.4, 0, 1, 1)"
      : "opacity 280ms cubic-bezier(0, 0, 0.2, 1)",
  };

  const sheetStyle: React.CSSProperties = {
    transform: isOpen ? "translateY(0)" : "translateY(100%)",
    transition: isExiting
      ? "transform 340ms cubic-bezier(0.4, 0, 1, 1)"
      : "transform 380ms cubic-bezier(0.16, 1, 0.3, 1)",
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center"
      onClick={handleBackdropClick}
    >
      {/* 백드롭 */}
      <div
        className="absolute inset-0 bg-[var(--overlay-backdrop)]"
        style={backdropStyle}
        aria-hidden="true"
      />

      {/* 시트 */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${label} 날씨 상세`}
        className="relative w-full max-w-[480px] overflow-hidden safe-bottom neu-raised-lg rounded-t-[28px] rounded-b-none"
        style={sheetStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 핸들 바 */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-[3px] rounded-full bg-[var(--overlay-handle)]" />
        </div>

        {/* 닫기 버튼 */}
        <button
          onClick={handleClose}
          aria-label="닫기"
          className="absolute top-3.5 right-4 w-11 h-11 flex items-center justify-center
                     rounded-full bg-[var(--overlay-badge)] hover:bg-[var(--overlay-selected)] transition-colors
                     text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
        >
          <X size={14} />
        </button>

        <div className="px-5 pt-2 pb-6">

          {/* ── 헤더: 아이콘 + 시간 + 날씨 ── */}
          <div className="flex items-center gap-4 mb-5">
            <span
              className="leading-none animate-float select-none"
              aria-hidden="true"
            >
              <WeatherIcon condition={slot.weather.main} size={52} glow />
            </span>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-xs font-semibold tracking-[0.08em] uppercase text-[var(--color-text-sub)]">
                {label}
              </span>
              <span className="text-[32px] font-bold leading-tight text-[var(--color-text-main)] tabular-nums"
                style={{ fontFamily: "var(--font-display)" }}>
                {slot.temp}°
              </span>
              <span className="text-sm text-[var(--color-text-sub)]">
                {slot.weather.description}
              </span>
            </div>
          </div>

          {/* ── 스탯 행 ── */}
          {(() => {
            const humGrade  = humTag(detail.humScore, detail.humDirection, detail.season);
            const rainGrade = rainTag(slot.weather.main, slot.weather.description);
            const airGrade  = airTag(detail.airScore);
            return (
              <div className="flex gap-2 mb-5">
                <StatCell
                  icon={<Droplets size={18} className="text-blue-400" />}
                  label="습도"
                  value={`${slot.humidity}%`}
                  grade={humGrade.label}
                  gradeVariant={humGrade.variant}
                />
                <StatCell
                  icon={<CloudRain size={18} className="text-blue-400" />}
                  label="강수"
                  value={`${slot.pop}%`}
                  grade={rainGrade.label}
                  gradeVariant={rainGrade.variant}
                />
                <StatCell
                  icon={<Leaf size={18} className="text-emerald-400" />}
                  label="공기"
                  value={`PM2.5 ${Math.round(slot.pm25)}`}
                  grade={airGrade.label}
                  gradeVariant={airGrade.variant}
                />
              </div>
            );
          })()}

          {/* ── 구분선 ── */}
          <div className="border-t border-[var(--overlay-border)] mb-5" />

          {/* ── 야외활동 추천 섹션 ── */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <ScoreBadge score={score} />
              <div className="flex flex-col gap-1.5">
                <Stars score={score} size="lg" />
                <span className="text-xs text-[var(--color-text-sub)] tabular-nums">
                  {score} / 5.0 · 온도·습도·공기·강수 계절별 종합
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag, i) => (
                <TagChip key={i} {...tag} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
}
