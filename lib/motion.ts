import type { Variants } from "framer-motion";
import type { TabId } from "@/lib/types";

// ── CSS 토큰 대응 이징 ──────────────────────────────────────────────────────
const EASE_STANDARD = [0.4, 0, 0.2, 1] as const;
const EASE_DECEL    = [0, 0, 0.2, 1]   as const;
const EASE_ACCEL    = [0.4, 0, 1, 1]   as const;

/** globals.css --transition-* 토큰과 1:1 대응 */
export const T = {
  fast: { duration: 0.15, ease: EASE_STANDARD },
  base: { duration: 0.25, ease: EASE_DECEL },
  exit: { duration: 0.15, ease: EASE_ACCEL },
} as const;

// ── GPU 레이어 승격 ─────────────────────────────────────────────────────────
/** WebView GPU 합성 레이어 강제 승격 — 모든 motion 래퍼에 적용 */
export const GPU_STYLE = {
  willChange: "transform, opacity",
  transform: "translateZ(0)",
} as const;

// ── 탭 방향 계산 ────────────────────────────────────────────────────────────
const TAB_INDEX: Record<TabId, number> = {
  today:    0,
  weekly:   1,
  location: 2,
  settings: 3,
};

/**
 * 이전 탭 → 현재 탭 인덱스 비교로 슬라이드 방향 반환
 * - `1`  : 오른쪽으로 이동 (새 탭이 오른쪽에서 진입)
 * - `-1` : 왼쪽으로 이동 (새 탭이 왼쪽에서 진입)
 */
export function getSlideDirection(from: TabId, to: TabId): 1 | -1 {
  return TAB_INDEX[to] >= TAB_INDEX[from] ? 1 : -1;
}

// ── 탭 전환 variants ────────────────────────────────────────────────────────
/** 방향성 슬라이드 탭 전환 (custom = direction: 1 | -1) */
export const tabSlideVariants: Variants = {
  initial: (dir: 1 | -1) => ({
    x: dir * 60,
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: T.base,
  },
  exit: (dir: 1 | -1) => ({
    x: dir * -60,
    opacity: 0,
    transition: T.exit,
  }),
};

/** 최초 진입 시 — x 이동 없이 opacity만 (중앙에서 페이드인) */
export const initialLoadVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: T.base },
  exit:    { opacity: 0, transition: T.exit },
};

/** prefers-reduced-motion 사용자용 즉시 전환 fallback */
export const reducedMotionVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.01 } },
  exit:    { opacity: 0, transition: { duration: 0.01 } },
};

// ── 스태거 진입 variants ────────────────────────────────────────────────────
/** 카드 목록 컨테이너 — 자식 순차 진입 (0.06s 간격) */
export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

/** 스태거 개별 아이템 — opacity + 12px 위로 슬라이드 */
export const staggerItemVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: T.base,
  },
};
