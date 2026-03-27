// 계절별 날씨 평점 산출 — /weather-scoring 스킬 기반
// 같은 수치라도 계절에 따라 다른 점수를 부여 (예: 겨울 0°C vs 여름 0°C)

export type Season = "spring" | "summer" | "autumn" | "winter";
export type HumDirection = "dry" | "humid" | "ideal";

export interface SeasonalScoreInput {
  temp: number;      // 현재 기온 (°C)
  feelsLike: number; // 체감 온도 (°C)
  humidity: number;  // 습도 (%)
  pm25: number;      // PM2.5 (μg/m³)
  pm10: number;      // PM10 (μg/m³)
  maxPop: number;    // 최대 강수 확률 (0-100)
  month: number;     // 현재 월 (1-12)
}

export interface WeatherScoreResult {
  tempScore: number;
  humScore: number;
  humDirection: HumDirection;
  airScore: number;
  rainScore: number;
  overall: number;
  season: Season;
}

// ── 계절 판단 ──────────────────────────────────────────────
export function getSeason(month: number): Season {
  if (month >= 3 && month <= 5)  return "spring";
  if (month >= 6 && month <= 8)  return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

// ── 온도 점수 ──────────────────────────────────────────────
// 계절별 쾌적 구간(plateau) 내에서 5.0, 벗어나면 비대칭 감점
// 여름·겨울은 체감 온도(feelsLike) 사용
const TEMP_CONFIG: Record<Season, {
  idealLow: number;
  idealHigh: number;
  penaltyBelow: number;
  penaltyAbove: number;
  useFeelsLike: boolean;
}> = {
  spring: { idealLow: 15, idealHigh: 19, penaltyBelow: 0.40, penaltyAbove: 0.35, useFeelsLike: false },
  summer: { idealLow: 23, idealHigh: 27, penaltyBelow: 0.50, penaltyAbove: 0.45, useFeelsLike: true  },
  autumn: { idealLow: 15, idealHigh: 20, penaltyBelow: 0.40, penaltyAbove: 0.35, useFeelsLike: false },
  winter: { idealLow: -1, idealHigh:  4, penaltyBelow: 0.30, penaltyAbove: 0.35, useFeelsLike: true  },
};

export function calcTempScore(temp: number, feelsLike: number, season: Season): number {
  const cfg = TEMP_CONFIG[season];
  const t = cfg.useFeelsLike ? feelsLike : temp;
  if (t < cfg.idealLow)  return +Math.max(0, 5.0 - (cfg.idealLow  - t) * cfg.penaltyBelow).toFixed(1);
  if (t > cfg.idealHigh) return +Math.max(0, 5.0 - (t - cfg.idealHigh) * cfg.penaltyAbove).toFixed(1);
  return 5.0;
}

// ── 습도 점수 ──────────────────────────────────────────────
// 계절별 적정 구간, 10% 단위 감점
// 여름: 높은 습도에 관대(장마 기대), 겨울: 높은 습도에 엄격(눅눅한 겨울)
const HUM_CONFIG: Record<Season, {
  idealLow: number;
  idealHigh: number;
  penaltyPer10Below: number;
  penaltyPer10Above: number;
}> = {
  spring: { idealLow: 43, idealHigh: 58, penaltyPer10Below: 1.0, penaltyPer10Above: 1.2 },
  summer: { idealLow: 48, idealHigh: 63, penaltyPer10Below: 1.1, penaltyPer10Above: 0.8 },
  autumn: { idealLow: 38, idealHigh: 53, penaltyPer10Below: 1.0, penaltyPer10Above: 1.2 },
  winter: { idealLow: 33, idealHigh: 48, penaltyPer10Below: 0.7, penaltyPer10Above: 1.3 },
};

export function calcHumScore(humidity: number, season: Season): { score: number; direction: HumDirection } {
  const cfg = HUM_CONFIG[season];
  if (humidity < cfg.idealLow)
    return {
      score: +Math.max(0, 5.0 - ((cfg.idealLow - humidity) / 10) * cfg.penaltyPer10Below).toFixed(1),
      direction: "dry",
    };
  if (humidity > cfg.idealHigh)
    return {
      score: +Math.max(0, 5.0 - ((humidity - cfg.idealHigh) / 10) * cfg.penaltyPer10Above).toFixed(1),
      direction: "humid",
    };
  return { score: 5.0, direction: "ideal" };
}

// ── 공기질 점수 ────────────────────────────────────────────
// PM2.5 구간별 점수 + PM10 황사 보정 (계절 독립적)
export function calcAirScore(pm25: number, pm10: number): number {
  let score: number;
  if (pm25 <= 12)      score = 5.0;
  else if (pm25 <= 35) score = 5.0 - (pm25 - 12)  * 0.065;   // 5.0 → 3.5
  else if (pm25 <= 75) score = 3.5 - (pm25 - 35)  * 0.0625;  // 3.5 → 1.0
  else                 score = Math.max(0, 1.0 - (pm25 - 75) * 0.02);

  // PM10 황사 보정 (봄철 황사 자동 반영)
  if (pm10 > 150)      score -= 1.5;
  else if (pm10 > 80)  score -= 0.8;

  return +Math.max(0, score).toFixed(1);
}

// ── 강수 점수 ──────────────────────────────────────────────
// freePop 이하는 감점 없음, 초과분에만 감점. 여름 장마에 관대.
const RAIN_CONFIG: Record<Season, { freePop: number; penaltyPer10: number }> = {
  spring: { freePop:  5, penaltyPer10: 0.60 },
  summer: { freePop: 15, penaltyPer10: 0.45 },
  autumn: { freePop:  5, penaltyPer10: 0.60 },
  winter: { freePop: 10, penaltyPer10: 0.50 },
};

export function calcRainScore(maxPop: number, season: Season): number {
  const cfg = RAIN_CONFIG[season];
  const effectivePop = Math.max(0, maxPop - cfg.freePop);
  return +Math.max(0, 5.0 - (effectivePop / 10) * cfg.penaltyPer10).toFixed(1);
}

// ── 종합 점수 ──────────────────────────────────────────────
// 온도 35% + 공기 25% + 강수 25% + 습도 15%
function calcOverall(tempScore: number, humScore: number, airScore: number, rainScore: number): number {
  return +(tempScore * 0.35 + humScore * 0.15 + airScore * 0.25 + rainScore * 0.25).toFixed(1);
}

// ── 메인 함수 ──────────────────────────────────────────────
export function calculateSeasonalWeatherScore(input: SeasonalScoreInput): WeatherScoreResult {
  const { temp, feelsLike, humidity, pm25, pm10, maxPop, month } = input;
  const season = getSeason(month);

  const tempScore = calcTempScore(temp, feelsLike, season);
  const { score: humScore, direction: humDirection } = calcHumScore(humidity, season);
  const airScore  = calcAirScore(pm25, pm10);
  const rainScore = calcRainScore(maxPop, season);
  const overall   = calcOverall(tempScore, humScore, airScore, rainScore);

  return { tempScore, humScore, humDirection, airScore, rainScore, overall, season };
}
