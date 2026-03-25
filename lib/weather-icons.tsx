/**
 * weather-icons.tsx — 공통 아이콘 모듈
 * 이모지 대신 lucide-react SVG 아이콘을 제공.
 * 날씨 상태 아이콘, 행동 가이드 아이콘, 스탯 아이콘 통합.
 */

import {
  Sun,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  Snowflake,
  CloudFog,
  Wind,
  Thermometer,
  CloudSun,
  ShieldCheck,
  Layers,
  Shirt,
  Umbrella,
  UmbrellaOff,
  Smile,
  Meh,
  Frown,
  Ban,
} from "lucide-react";
import type { LucideProps } from "lucide-react";
import type { GuideIconKey } from "./types";

// ── 날씨 상태 아이콘 매핑 ────────────────────────────────────────────

type IconDef = {
  Icon: React.ComponentType<LucideProps>;
  className: string;
};

const WEATHER_ICON_MAP: Record<string, IconDef> = {
  Clear:        { Icon: Sun,            className: "text-amber-400"  },
  Clouds:       { Icon: Cloud,          className: "text-slate-400"  },
  Rain:         { Icon: CloudRain,      className: "text-blue-400"   },
  Drizzle:      { Icon: CloudDrizzle,   className: "text-blue-300"   },
  Thunderstorm: { Icon: CloudLightning, className: "text-violet-400" },
  Snow:         { Icon: Snowflake,      className: "text-sky-200"    },
  Mist:         { Icon: CloudFog,       className: "text-slate-300"  },
  Fog:          { Icon: CloudFog,       className: "text-slate-300"  },
  Haze:         { Icon: CloudFog,       className: "text-slate-300"  },
  Dust:         { Icon: Wind,           className: "text-amber-600"  },
  Sand:         { Icon: Wind,           className: "text-amber-600"  },
};

// ── 날씨 글로우 색상 매핑 ────────────────────────────────────────────
// 각 날씨 조건에 대응하는 라디얼 글로우의 핵심 색상 (RGBA)

const WEATHER_GLOW_MAP: Record<string, string> = {
  Clear:        "rgba(251, 191,  36, 0.45)",  // amber-400
  Clouds:       "rgba(148, 163, 184, 0.30)",  // slate-400
  Rain:         "rgba( 96, 165, 250, 0.40)",  // blue-400
  Drizzle:      "rgba(147, 197, 253, 0.35)",  // blue-300
  Thunderstorm: "rgba(167, 139, 250, 0.50)",  // violet-400 — 더 강하게
  Snow:         "rgba(186, 230, 253, 0.40)",  // sky-200
  Mist:         "rgba(203, 213, 225, 0.25)",  // slate-300 — 은은하게
  Fog:          "rgba(203, 213, 225, 0.25)",
  Haze:         "rgba(203, 213, 225, 0.25)",
  Dust:         "rgba(217, 119,   6, 0.38)",  // amber-600
  Sand:         "rgba(217, 119,   6, 0.38)",
};

// ── WeatherIcon 컴포넌트 ────────────────────────────────────────────

interface WeatherIconProps {
  condition: string;
  size?: number;
  className?: string;
  /** 아이콘 뒤에 날씨 색상 글로우 효과 표시 */
  glow?: boolean;
}

export function WeatherIcon({ condition, size = 24, className = "", glow = false }: WeatherIconProps) {
  const mapping = WEATHER_ICON_MAP[condition] ?? { Icon: Thermometer, className: "text-red-400" };
  const { Icon, className: colorClass } = mapping;

  if (!glow) {
    return <Icon size={size} className={`${colorClass} ${className}`.trim()} />;
  }

  // 글로우 크기 & 블러: 아이콘 크기에 비례
  const glowColor    = WEATHER_GLOW_MAP[condition] ?? "rgba(255,255,255,0.20)";
  const glowDiameter = Math.round(size * 1.3);
  const blurRadius   = Math.round(size * 0.14);

  return (
    <span
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* 라디얼 글로우 레이어 */}
      <span
        aria-hidden="true"
        style={{
          position:     "absolute",
          width:        glowDiameter,
          height:       glowDiameter,
          top:          "50%",
          left:         "50%",
          transform:    "translate(-50%, -50%)",
          borderRadius: "50%",
          background:   `radial-gradient(circle, ${glowColor} 0%, transparent 68%)`,
          filter:       `blur(${blurRadius}px)`,
          pointerEvents: "none",
        }}
      />
      {/* 아이콘 (z-index로 글로우 위에) */}
      <Icon
        size={size}
        className={`${colorClass} ${className} relative`.trim()}
        style={{ zIndex: 1 }}
      />
    </span>
  );
}

// ── 행동 가이드 아이콘 매핑 ──────────────────────────────────────────

export const GUIDE_ICON_MAP: Record<GuideIconKey, IconDef> = {
  "clothing-heavy":    { Icon: ShieldCheck, className: "text-blue-400"    },
  "clothing-medium":   { Icon: Layers,      className: "text-blue-300"    },
  "clothing-light":    { Icon: Shirt,       className: "text-emerald-400" },
  "clothing-minimal":  { Icon: Sun,         className: "text-orange-400"  },
  "umbrella-required": { Icon: Umbrella,    className: "text-blue-500"    },
  "umbrella-optional": { Icon: UmbrellaOff, className: "text-blue-300"    },
  "umbrella-none":     { Icon: Sun,         className: "text-amber-400"   },
  "air-good":          { Icon: Smile,       className: "text-emerald-400" },
  "air-normal":        { Icon: Meh,         className: "text-amber-400"   },
  "air-bad":           { Icon: Frown,       className: "text-orange-400"  },
  "air-critical":      { Icon: Ban,         className: "text-red-500"     },
};

// ── CloudSun re-export (폴백용) ──────────────────────────────────────

export { CloudSun };
