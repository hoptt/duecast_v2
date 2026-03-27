// 서버 전용 — API Key를 사용하므로 클라이언트에서 import 금지
import type {
  WeatherResponse,
  WeatherCondition,
  CurrentWeather,
  HourlyForecast,
  AirPollution,
  DailyTemperature,
  Location,
  SunInfo,
} from "./types";
import type {
  OWMCurrentResponse,
  OWMForecastResponse,
  OWMAirPollutionResponse,
} from "./owm-types";
import { getActionGuide } from "./weather-guide";
import { getWeatherDescriptionKr } from "./weather-description";

const OWM_BASE = "https://api.openweathermap.org/data/2.5";

// OWM weather.main → WeatherCondition 유니온 타입 변환
// 알 수 없는 값(Smoke, Squall 등)은 "Clouds"로 폴백
const KNOWN_CONDITIONS = new Set<WeatherCondition>([
  "Clear", "Clouds", "Rain", "Drizzle", "Thunderstorm",
  "Snow", "Mist", "Fog", "Haze", "Dust", "Sand",
]);

function toWeatherCondition(main: string): WeatherCondition {
  if (KNOWN_CONDITIONS.has(main as WeatherCondition)) {
    return main as WeatherCondition;
  }
  // 근사 매핑
  if (main === "Smoke" || main === "Ash") return "Mist";
  if (main === "Squall" || main === "Tornado") return "Thunderstorm";
  return "Clouds";
}

// UTC timestamp + timezone 오프셋(초) → 현지 "HH시" 포맷
function formatLocalHour(dt: number, timezoneOffset: number): string {
  const localMs = (dt + timezoneOffset) * 1000;
  const h = new Date(localMs).getUTCHours();
  return `${h}시`;
}

function transformCurrent(raw: OWMCurrentResponse): CurrentWeather {
  return {
    temp: Math.round(raw.main.temp),
    feelsLike: Math.round(raw.main.feels_like),
    humidity: raw.main.humidity,
    windSpeed: raw.wind.speed,
    weather: {
      main: toWeatherCondition(raw.weather[0]?.main ?? "Clouds"),
      description: getWeatherDescriptionKr(raw.weather[0]?.id ?? 800, raw.weather[0]?.description ?? ""),
      icon: raw.weather[0]?.icon ?? "01d",
    },
    observedAt: raw.dt,
    timezoneOffset: raw.timezone,
  };
}

function transformForecast(raw: OWMForecastResponse): HourlyForecast[] {
  const tz = raw.city.timezone;
  return raw.list.map((item) => ({
    dt: item.dt,
    time: formatLocalHour(item.dt, tz),
    temp: Math.round(item.main.temp),
    feelsLike: Math.round(item.main.feels_like),
    humidity: item.main.humidity,
    pop: Math.round(item.pop * 100), // 0.32 → 32
    weather: {
      main: toWeatherCondition(item.weather[0]?.main ?? "Clouds"),
      description: getWeatherDescriptionKr(item.weather[0]?.id ?? 800, item.weather[0]?.description ?? ""),
      icon: item.weather[0]?.icon ?? "01d",
    },
  }));
}

function transformAirPollution(raw: OWMAirPollutionResponse): AirPollution {
  const item = raw.list[0];
  return {
    pm25: item.components.pm2_5,
    pm10: item.components.pm10,
    aqi: item.main.aqi,
  };
}

function extractSunInfo(raw: OWMCurrentResponse): SunInfo {
  return {
    sunrise: raw.sys.sunrise,
    sunset: raw.sys.sunset,
  };
}

function extractLocation(raw: OWMCurrentResponse): Location {
  return {
    name: raw.name,
    country: raw.sys.country,
  };
}

function extractDailyTemp(
  currentRaw: OWMCurrentResponse,
  forecastRaw: OWMForecastResponse
): DailyTemperature {
  const tz = forecastRaw.city.timezone;
  // 오늘 날짜 (현지 기준)
  const nowLocal = new Date((Date.now() / 1000 + tz) * 1000);
  const todayDate = nowLocal.toISOString().slice(0, 10); // "YYYY-MM-DD"

  // 오늘에 해당하는 예보 항목만 필터
  const todayItems = forecastRaw.list.filter((item) => {
    const itemLocal = new Date((item.dt + tz) * 1000);
    return itemLocal.toISOString().slice(0, 10) === todayDate;
  });

  if (todayItems.length === 0) {
    // 오늘 데이터 없으면 current의 temp_min/max 사용
    return {
      high: Math.round(currentRaw.main.temp_max),
      low: Math.round(currentRaw.main.temp_min),
    };
  }

  const high = Math.round(Math.max(...todayItems.map((i) => i.main.temp_max)));
  const low = Math.round(Math.min(...todayItems.map((i) => i.main.temp_min)));
  return { high, low };
}

/** OWM API 3개를 병렬 호출하여 WeatherResponse로 변환. 서버 전용. */
export async function fetchWeatherData(
  lat: number,
  lon: number,
  apiKey: string
): Promise<WeatherResponse> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    units: "metric",
    lang: "kr",
    appid: apiKey,
  });

  const forecastParams = new URLSearchParams(params);
  forecastParams.set("cnt", "16"); // 48시간치 (3시간 × 16 = 48h)

  const fetchOpts = { next: { revalidate: 600 } } as const;

  const [currentRes, forecastRes, airRes] = await Promise.all([
    fetch(`${OWM_BASE}/weather?${params}`, fetchOpts),
    fetch(`${OWM_BASE}/forecast?${forecastParams}`, fetchOpts),
    fetch(`${OWM_BASE}/air_pollution?${params}`, fetchOpts),
  ]);

  // 에러 체크 — 상태 코드별 분류
  for (const res of [currentRes, forecastRes, airRes]) {
    if (!res.ok) {
      const status = res.status;
      if (status === 401) throw Object.assign(new Error("API 키가 유효하지 않습니다."), { code: 401 });
      if (status === 429) throw Object.assign(new Error("API 요청 한도를 초과했습니다."), { code: 429 });
      if (status === 404) throw Object.assign(new Error("해당 위치의 날씨 데이터를 찾을 수 없습니다."), { code: 404 });
      throw Object.assign(new Error(`날씨 데이터 요청 실패 (${status})`), { code: status });
    }
  }

  const [currentRaw, forecastRaw, airRaw] = await Promise.all([
    currentRes.json() as Promise<OWMCurrentResponse>,
    forecastRes.json() as Promise<OWMForecastResponse>,
    airRes.json() as Promise<OWMAirPollutionResponse>,
  ]);

  const current = transformCurrent(currentRaw);
  const forecast = transformForecast(forecastRaw);
  const airPollution = transformAirPollution(airRaw);
  const sun = extractSunInfo(currentRaw);
  const dailyTemp = extractDailyTemp(currentRaw, forecastRaw);
  const location = extractLocation(currentRaw);

  // guide는 기존 weather-guide.ts 로직 재사용 (서버에서 계산)
  const guide = getActionGuide(current, airPollution, forecast, new Date());

  return {
    current,
    forecast,
    airPollution,
    location,
    guide,
    sun,
    dailyTemp,
    yesterdayTemp: 0, // Free 플랜: Historical API 없음
    lastUpdated: Date.now(),
  };
}
