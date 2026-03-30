// 온도·습도·공기·강수 라벨명 및 색상(variant) 중앙 선언
// 3개 사용처(HourlyDetailSheet, WeatherScoreCard, OutdoorTimingCard)가 모두 여기서 import

import type { Season, HumDirection } from "@/lib/seasonal-score";

export type TagVariant = "good" | "neutral" | "bad";
export interface Tag { label: string; variant: TagVariant }

// ── 온도 ─────────────────────────────────────────────────────────────────────

const SEASON_TEMP_LABELS: Record<Season, [string, string, string]> = {
  spring: ["쾌적", "선선", "쌀쌀"],
  summer: ["시원", "더움", "폭염"],
  autumn: ["쾌적", "선선", "쌀쌀"],
  winter: ["포근", "쌀쌀", "꽁꽁"],
};

export function tempTag(tempScore: number, season: Season): Tag {
  const [good, neutral, bad] = SEASON_TEMP_LABELS[season];
  if (tempScore >= 4) return { label: good,    variant: "good" };
  if (tempScore >= 3) return { label: neutral, variant: "neutral" };
  return                     { label: bad,     variant: "bad" };
}

// ── 습도 ─────────────────────────────────────────────────────────────────────

export function humTag(humScore: number, humDirection: HumDirection, season: Season): Tag {
  if (humScore >= 4) return { label: season === "summer" ? "산뜻" : "뽀송", variant: "good" };
  if (humScore >= 3) return { label: humDirection === "humid" ? "습함" : "건조", variant: "neutral" };
  const label = humDirection === "humid"
    ? (season === "summer" ? "끈적" : "눅눅")
    : (season === "winter" ? "바싹" : "까칠");
  return { label, variant: "bad" };
}

// ── 공기 ─────────────────────────────────────────────────────────────────────
// prefix=true: "공기 좋음" (태그 단독 표시용), false: "좋음" (라벨 행이 별도 있을 때)

export function airTag(airScore: number, prefix = false): Tag {
  const p = prefix ? "공기 " : "";
  if (airScore >= 4) return { label: `${p}좋음`, variant: "good" };
  if (airScore >= 3) return { label: `${p}보통`, variant: "neutral" };
  return                    { label: `${p}나쁨`, variant: "bad" };
}

// ── 강수 ─────────────────────────────────────────────────────────────────────
// 강수 상태(Rain/Drizzle/Snow/Thunderstorm) → bad 고정
// 비강수 상태(Clear/Clouds/Mist 등)         → good 고정

const PRECIP_MAINS = new Set(["Rain", "Drizzle", "Snow", "Thunderstorm"]);

export function rainTag(weatherMain: string, description: string): Tag {
  if (PRECIP_MAINS.has(weatherMain)) return { label: description, variant: "bad" };
  return                                    { label: description, variant: "good" };
}
