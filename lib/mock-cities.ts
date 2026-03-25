import type { WeatherResponse, WeatherCondition, Coordinates } from "./types";
import { getActionGuide } from "./weather-guide";

export interface CityWeatherData {
  id: string;
  name: string;
  address: string;
  coords: Coordinates;
  weather: WeatherResponse;
}

const _now = new Date();
_now.setMinutes(0, 0, 0); // 시각을 정각으로 truncate → SSR/클라이언트 hydration 불일치 방지

function makeForecast(
  baseTemp: number,
  weatherPattern: { main: WeatherCondition; description: string; icon: string }[],
  popPattern: number[]
) {
  return Array.from({ length: 16 }, (_, i) => {
    const dt = Math.floor(_now.getTime() / 1000) + (i + 1) * 10800;
    const hour = new Date(dt * 1000).getHours();
    const variation = Math.round(Math.sin(((hour - 4) / 24) * 2 * Math.PI) * 5);
    const temp = baseTemp + variation;
    return {
      dt,
      time: `${String(hour).padStart(2, "0")}시`,
      temp,
      pop: popPattern[i] ?? 5,
      weather: weatherPattern[i] ?? weatherPattern[0],
    };
  });
}

function clearPattern(baseHour?: number): { main: WeatherCondition; description: string; icon: string }[] {
  return Array.from({ length: 16 }, (_, i) => {
    const dt = Math.floor(_now.getTime() / 1000) + (i + 1) * 10800;
    const hour = new Date(dt * 1000).getHours();
    const isDay = hour >= 6 && hour < 20;
    return { main: "Clear", description: "맑음", icon: isDay ? "01d" : "01n" };
  });
}

function cloudsPattern(): { main: WeatherCondition; description: string; icon: string }[] {
  return Array.from({ length: 16 }, (_, i) => {
    const dt = Math.floor(_now.getTime() / 1000) + (i + 1) * 10800;
    const hour = new Date(dt * 1000).getHours();
    const isDay = hour >= 6 && hour < 20;
    return { main: "Clouds", description: "구름많음", icon: isDay ? "03d" : "03n" };
  });
}

function rainPattern(): { main: WeatherCondition; description: string; icon: string }[] {
  return Array.from({ length: 16 }, (_, i) => ({
    main: "Rain" as WeatherCondition,
    description: "비",
    icon: "10d",
  }));
}

function mistPattern(): { main: WeatherCondition; description: string; icon: string }[] {
  return Array.from({ length: 16 }, (_, i) => ({
    main: "Mist" as WeatherCondition,
    description: "안개",
    icon: "50d",
  }));
}

const _seoulForecast = makeForecast(18, clearPattern(), [5, 5, 10, 10, 20, 25, 35, 20, 10, 10, 5, 5, 5, 5, 5, 5]);
const _busanForecast = makeForecast(21, cloudsPattern(), [10, 15, 20, 25, 30, 25, 20, 15, 10, 10, 10, 10, 5, 5, 5, 5]);
const _jejuForecast  = makeForecast(17, rainPattern(), [70, 75, 80, 80, 70, 65, 60, 55, 50, 45, 40, 35, 30, 25, 20, 20]);
const _incheonForecast = makeForecast(15, mistPattern(), [20, 20, 20, 20, 20, 20, 20, 20, 15, 15, 15, 10, 10, 10, 10, 10]);
const _daeguForecast = makeForecast(23, clearPattern(), [5, 5, 5, 5, 10, 10, 10, 5, 5, 5, 5, 5, 5, 5, 5, 5]);
const _gangneungForecast = makeForecast(12, cloudsPattern(), [15, 15, 20, 25, 30, 35, 30, 25, 20, 15, 15, 10, 10, 10, 5, 5]);

export const MOCK_CITIES: CityWeatherData[] = [
  {
    id: "seoul",
    name: "서울특별시",
    address: "서울특별시 중구 세종대로 110",
    coords: { lat: 37.5665, lon: 126.978 },
    weather: {
      location: { name: "서울특별시", country: "KR" },
      current: {
        temp: 18, feelsLike: 16, humidity: 60, windSpeed: 3.2,
        weather: { main: "Clear", description: "맑음", icon: "01d" },
      },
      forecast: _seoulForecast,
      airPollution: { pm25: 12, pm10: 25, aqi: 1 },
      guide: getActionGuide(
        { temp: 18, feelsLike: 16, humidity: 60, windSpeed: 3.2, weather: { main: "Clear", description: "맑음", icon: "01d" } },
        { pm25: 12, pm10: 25, aqi: 1 },
        _seoulForecast,
        _now
      ),
      sun: {
        sunrise: Math.floor(new Date(_now.getFullYear(), _now.getMonth(), _now.getDate(), 6, 32).getTime() / 1000),
        sunset:  Math.floor(new Date(_now.getFullYear(), _now.getMonth(), _now.getDate(), 18, 45).getTime() / 1000),
      },
      dailyTemp: { high: 22, low: 11 },
      yesterdayTemp: 15,
      lastUpdated: Math.floor(_now.getTime() / 1000),
    },
  },
  {
    id: "busan",
    name: "부산광역시",
    address: "부산광역시 연제구 중앙대로 1001",
    coords: { lat: 35.1796, lon: 129.0756 },
    weather: {
      location: { name: "부산광역시", country: "KR" },
      current: {
        temp: 21, feelsLike: 20, humidity: 72, windSpeed: 4.1,
        weather: { main: "Clouds", description: "구름많음", icon: "03d" },
      },
      forecast: _busanForecast,
      airPollution: { pm25: 18, pm10: 35, aqi: 2 },
      guide: getActionGuide(
        { temp: 21, feelsLike: 20, humidity: 72, windSpeed: 4.1, weather: { main: "Clouds", description: "구름많음", icon: "03d" } },
        { pm25: 18, pm10: 35, aqi: 2 },
        _busanForecast,
        _now
      ),
      sun: {
        sunrise: Math.floor(new Date(_now.getFullYear(), _now.getMonth(), _now.getDate(), 6, 18).getTime() / 1000),
        sunset:  Math.floor(new Date(_now.getFullYear(), _now.getMonth(), _now.getDate(), 18, 55).getTime() / 1000),
      },
      dailyTemp: { high: 24, low: 16 },
      yesterdayTemp: 19,
      lastUpdated: Math.floor(_now.getTime() / 1000),
    },
  },
  {
    id: "jeju",
    name: "제주시",
    address: "제주특별자치도 제주시 광양9길 10",
    coords: { lat: 33.4996, lon: 126.5312 },
    weather: {
      location: { name: "제주시", country: "KR" },
      current: {
        temp: 17, feelsLike: 15, humidity: 85, windSpeed: 6.3,
        weather: { main: "Rain", description: "비", icon: "10d" },
      },
      forecast: _jejuForecast,
      airPollution: { pm25: 8, pm10: 15, aqi: 1 },
      guide: getActionGuide(
        { temp: 17, feelsLike: 15, humidity: 85, windSpeed: 6.3, weather: { main: "Rain", description: "비", icon: "10d" } },
        { pm25: 8, pm10: 15, aqi: 1 },
        _jejuForecast,
        _now
      ),
      sun: {
        sunrise: Math.floor(new Date(_now.getFullYear(), _now.getMonth(), _now.getDate(), 6, 48).getTime() / 1000),
        sunset:  Math.floor(new Date(_now.getFullYear(), _now.getMonth(), _now.getDate(), 19, 12).getTime() / 1000),
      },
      dailyTemp: { high: 19, low: 14 },
      yesterdayTemp: 18,
      lastUpdated: Math.floor(_now.getTime() / 1000),
    },
  },
  {
    id: "incheon",
    name: "인천광역시",
    address: "인천광역시 남동구 정각로 29",
    coords: { lat: 37.4563, lon: 126.7052 },
    weather: {
      location: { name: "인천광역시", country: "KR" },
      current: {
        temp: 15, feelsLike: 13, humidity: 78, windSpeed: 5.0,
        weather: { main: "Mist", description: "안개", icon: "50d" },
      },
      forecast: _incheonForecast,
      airPollution: { pm25: 22, pm10: 42, aqi: 2 },
      guide: getActionGuide(
        { temp: 15, feelsLike: 13, humidity: 78, windSpeed: 5.0, weather: { main: "Mist", description: "안개", icon: "50d" } },
        { pm25: 22, pm10: 42, aqi: 2 },
        _incheonForecast,
        _now
      ),
      sun: {
        sunrise: Math.floor(new Date(_now.getFullYear(), _now.getMonth(), _now.getDate(), 6, 35).getTime() / 1000),
        sunset:  Math.floor(new Date(_now.getFullYear(), _now.getMonth(), _now.getDate(), 18, 48).getTime() / 1000),
      },
      dailyTemp: { high: 18, low: 10 },
      yesterdayTemp: 13,
      lastUpdated: Math.floor(_now.getTime() / 1000),
    },
  },
  {
    id: "daegu",
    name: "대구광역시",
    address: "대구광역시 중구 공평로 88",
    coords: { lat: 35.8714, lon: 128.6014 },
    weather: {
      location: { name: "대구광역시", country: "KR" },
      current: {
        temp: 23, feelsLike: 22, humidity: 45, windSpeed: 2.1,
        weather: { main: "Clear", description: "맑음", icon: "01d" },
      },
      forecast: _daeguForecast,
      airPollution: { pm25: 15, pm10: 30, aqi: 1 },
      guide: getActionGuide(
        { temp: 23, feelsLike: 22, humidity: 45, windSpeed: 2.1, weather: { main: "Clear", description: "맑음", icon: "01d" } },
        { pm25: 15, pm10: 30, aqi: 1 },
        _daeguForecast,
        _now
      ),
      sun: {
        sunrise: Math.floor(new Date(_now.getFullYear(), _now.getMonth(), _now.getDate(), 6, 25).getTime() / 1000),
        sunset:  Math.floor(new Date(_now.getFullYear(), _now.getMonth(), _now.getDate(), 18, 52).getTime() / 1000),
      },
      dailyTemp: { high: 26, low: 14 },
      yesterdayTemp: 20,
      lastUpdated: Math.floor(_now.getTime() / 1000),
    },
  },
  {
    id: "gangneung",
    name: "강릉시",
    address: "강원특별자치도 강릉시 강릉대로 33",
    coords: { lat: 37.7519, lon: 128.876 },
    weather: {
      location: { name: "강릉시", country: "KR" },
      current: {
        temp: 12, feelsLike: 10, humidity: 68, windSpeed: 3.8,
        weather: { main: "Clouds", description: "구름많음", icon: "03d" },
      },
      forecast: _gangneungForecast,
      airPollution: { pm25: 9, pm10: 18, aqi: 1 },
      guide: getActionGuide(
        { temp: 12, feelsLike: 10, humidity: 68, windSpeed: 3.8, weather: { main: "Clouds", description: "구름많음", icon: "03d" } },
        { pm25: 9, pm10: 18, aqi: 1 },
        _gangneungForecast,
        _now
      ),
      sun: {
        sunrise: Math.floor(new Date(_now.getFullYear(), _now.getMonth(), _now.getDate(), 6, 20).getTime() / 1000),
        sunset:  Math.floor(new Date(_now.getFullYear(), _now.getMonth(), _now.getDate(), 18, 40).getTime() / 1000),
      },
      dailyTemp: { high: 15, low: 7 },
      yesterdayTemp: 10,
      lastUpdated: Math.floor(_now.getTime() / 1000),
    },
  },
];

export const DEFAULT_CITY_ID = "seoul";
