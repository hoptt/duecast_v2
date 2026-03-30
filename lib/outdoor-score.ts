import type { HourlyForecast } from "@/lib/types";
import {
  getSeason,
  calcTempScore,
  calcHumScore,
  calcAirScore,
  calcRainScore,
  type Season,
  type HumDirection,
} from "@/lib/seasonal-score";
import { tempTag, humTag, airTag, rainTag, type Tag } from "@/lib/metric-tags";
export type { TagVariant, Tag } from "@/lib/metric-tags";

export interface ScoreDetail {
  tempScore: number;
  humScore: number;
  humDirection: HumDirection;
  airScore: number;
  rainScore: number;
  overall: number;
  season: Season;
}

export function computeScore(item: HourlyForecast): ScoreDetail {
  const month = new Date(item.dt * 1000).getMonth() + 1;
  const season = getSeason(month);

  const tempScore = calcTempScore(item.temp, item.feelsLike, season);
  const { score: humScore, direction: humDirection } = calcHumScore(item.humidity, season);
  const airScore  = calcAirScore(item.pm25, item.pm10);
  const rainScore = calcRainScore(item.pop, season, item.weather.main);

  // 현재 날씨 평점과 동일한 가중치: 온도 35%, 공기 25%, 강수 25%, 습도 15%
  const overall = Math.round((tempScore * 0.35 + humScore * 0.15 + airScore * 0.25 + rainScore * 0.25) * 10) / 10;

  return { tempScore, humScore, humDirection, airScore, rainScore, overall, season };
}

// ── 지표별 라벨 생성 ───────────────────────────────────────────────────────
function metricTag(key: "temp" | "hum" | "air", detail: ScoreDetail): Tag {
  if (key === "temp") return tempTag(detail.tempScore, detail.season);
  if (key === "hum")  return humTag(detail.humScore, detail.humDirection, detail.season);
  return airTag(detail.airScore, true); // TagChip용: "공기 좋음/보통/나쁨"
}

// ── 날씨 상태 태그 헬퍼 ──────────────────────────────────────────────────────
function weatherTag(main: string, description: string): Tag | null {
  switch (main) {
    case "Clear":        return rainTag(main, description);
    case "Clouds":       return { label: description, variant: "neutral" };
    case "Mist":
    case "Fog":
    case "Haze":         return { label: "안개",      variant: "neutral" };
    case "Rain":
    case "Drizzle":
    case "Snow":
    case "Thunderstorm": return rainTag(main, description);
    case "Dust":
    case "Sand":         return { label: "먼지",      variant: "bad" };
    default:             return null;
  }
}

// ── 핵심 원인 태그 ─────────────────────────────────────────────────────────
// 가중치를 반영한 실제 영향력 기반 dominant 선택
type MetricKey = "temp" | "hum" | "air" | "rain";

const WEIGHTS: Record<MetricKey, number> = { temp: 0.35, hum: 0.15, air: 0.25, rain: 0.25 };

function rankedKeys(detail: ScoreDetail): MetricKey[] {
  const metrics: Array<{ key: MetricKey; impact: number }> = [
    { key: "temp", impact: Math.abs(detail.tempScore - 5) * WEIGHTS.temp },
    { key: "hum",  impact: Math.abs(detail.humScore  - 5) * WEIGHTS.hum  },
    { key: "air",  impact: Math.abs(detail.airScore  - 5) * WEIGHTS.air  },
    { key: "rain", impact: Math.abs(detail.rainScore - 5) * WEIGHTS.rain },
  ];
  // overall >= 4: impact 오름차순 (만점에 가까운 순)
  // overall < 4: impact 내림차순 (발목 잡는 순)
  return detail.overall >= 4
    ? metrics.sort((a, b) => a.impact - b.impact).map((m) => m.key)
    : metrics.sort((a, b) => b.impact - a.impact).map((m) => m.key);
}

export function dominantKey(detail: ScoreDetail): MetricKey {
  return rankedKeys(detail)[0];
}

// 더보기 리스트용: 날씨 → 온도 → 습도 → 공기 고정 순서
export function buildTags(item: HourlyForecast, detail: ScoreDetail): Tag[] {
  const tags: Tag[] = [];

  // ① 날씨 상태 태그 (강수 강도 포함, rainScore 기반 색상)
  const wTag = weatherTag(item.weather.main, item.weather.description);
  if (wTag) tags.push(wTag);

  // ② 온도
  tags.push(metricTag("temp", detail));

  // ③ 습도
  tags.push(metricTag("hum", detail));

  // ④ 공기
  tags.push(metricTag("air", detail));

  return tags;
}

// Hero용: 날씨 태그 + dominant(평점에 가장 큰 영향을 끼친 지표) 태그
export function buildHeroTags(item: HourlyForecast, detail: ScoreDetail): Tag[] {
  const heroTags: Tag[] = [];

  // ① 날씨 상태 태그 (강수 강도 포함, rainScore 기반 색상)
  const wTag = weatherTag(item.weather.main, item.weather.description);
  if (wTag) heroTags.push(wTag);

  // ② dominant 태그 — rain은 날씨 태그로 이미 표현되므로 차순위 사용
  const ranked = rankedKeys(detail);
  const heroKey = ranked[0] === "rain" ? ranked[1] : ranked[0];
  heroTags.push(metricTag(heroKey as "temp" | "hum" | "air", detail));

  return heroTags;
}

export function fmtLabel(dt: number): string {
  const d = new Date(dt * 1000);
  const mo  = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh  = String(d.getHours()).padStart(2, "0");
  return `${mo}/${day} ${hh}:00`;
}
