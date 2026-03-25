import type { HourlyForecast } from "@/lib/types";

export type TagVariant = "good" | "neutral" | "bad";
export interface Tag { label: string; variant: TagVariant }

export function computeScore(item: HourlyForecast, pm25: number): number {
  const hour = new Date(item.dt * 1000).getHours();

  const tempDiff = Math.abs(item.temp - 18);
  const tempScore = Math.max(1, 5 - tempDiff * 0.18);
  const rainScore = 5 * (1 - item.pop / 100);
  const skyScore =
    item.weather.main === "Clear" ? 5 :
    item.weather.main === "Clouds" ? 3.5 :
    item.weather.main === "Drizzle" ? 2.5 :
    item.weather.main === "Rain" ? 1.5 :
    item.weather.main === "Thunderstorm" ? 1 :
    item.weather.main === "Snow" ? 2 : 3;
  const timeScore =
    hour >= 8 && hour < 18 ? 5 :
    hour >= 6 && hour < 20 ? 4 : 3;
  const airScore = Math.max(1, 5 - pm25 / 15);

  const score = tempScore * 0.25 + rainScore * 0.25 + skyScore * 0.2 + timeScore * 0.15 + airScore * 0.15;
  return Math.round(score * 10) / 10;
}

export function buildTags(item: HourlyForecast, score: number, pm25: number): Tag[] {
  const tags: Tag[] = [];
  const hour = new Date(item.dt * 1000).getHours();

  if (score >= 4)      tags.push({ label: "좋아요", variant: "good" });
  else if (score >= 3) tags.push({ label: "보통",   variant: "neutral" });
  else                 tags.push({ label: "나쁨",   variant: "bad" });

  if (item.weather.main === "Clear")                                         tags.push({ label: "맑음", variant: "good" });
  else if (item.weather.main === "Clouds")                                   tags.push({ label: "구름", variant: "neutral" });
  else if (item.weather.main === "Rain" || item.weather.main === "Drizzle")  tags.push({ label: "비",   variant: "bad" });
  else if (item.weather.main === "Snow")                                     tags.push({ label: "눈",   variant: "neutral" });
  else if (item.weather.main === "Thunderstorm")                             tags.push({ label: "천둥", variant: "bad" });

  if (item.temp <= 0)       tags.push({ label: "영하",      variant: "bad" });
  else if (item.temp < 8)   tags.push({ label: "매우 추움", variant: "bad" });
  else if (item.temp < 13)  tags.push({ label: "추움",      variant: "neutral" });
  else if (item.temp > 33)  tags.push({ label: "매우 더움", variant: "bad" });
  else if (item.temp > 28)  tags.push({ label: "더움",      variant: "neutral" });

  if (hour < 5 || hour >= 21) tags.push({ label: "야간", variant: "neutral" });

  if (pm25 < 15)      tags.push({ label: "공기 좋음", variant: "good" });
  else if (pm25 < 35) tags.push({ label: "공기 보통", variant: "neutral" });
  else                tags.push({ label: "공기 나쁨", variant: "bad" });

  return tags;
}

export function fmtLabel(dt: number): string {
  const d = new Date(dt * 1000);
  const mo  = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh  = String(d.getHours()).padStart(2, "0");
  return `${mo}/${day} ${hh}:00`;
}

