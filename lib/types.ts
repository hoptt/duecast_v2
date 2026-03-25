// ===== 날씨 상태 =====

/** OpenWeatherMap 날씨 상태 메인 코드 */
export type WeatherCondition =
  | "Clear"
  | "Clouds"
  | "Rain"
  | "Drizzle"
  | "Thunderstorm"
  | "Snow"
  | "Mist"
  | "Fog"
  | "Haze"
  | "Dust"
  | "Sand";

export interface WeatherInfo {
  main: WeatherCondition;
  description: string; // OWM의 lang=kr 한글 설명
  icon: string;        // OWM 아이콘 코드 (예: "01d", "10n")
}

// ===== 현재 날씨 =====

export interface CurrentWeather {
  temp: number;         // 현재 기온 (°C, 정수 반올림)
  feelsLike: number;    // 체감 온도 (°C, 정수 반올림)
  humidity: number;     // 습도 (%)
  windSpeed: number;    // 풍속 (m/s)
  weather: WeatherInfo;
}

// ===== 시간별 예보 =====

export interface HourlyForecast {
  dt: number;           // Unix timestamp
  time: string;         // "HH시" 형식
  temp: number;         // 기온 (°C, 정수 반올림)
  pop: number;          // 강수확률 (0-100, 퍼센트)
  weather: WeatherInfo;
}

// ===== 미세먼지 =====

export type DustLevel = "좋음" | "보통" | "나쁨" | "매우 나쁨";

export interface AirPollution {
  pm25: number;   // PM2.5 (ug/m3)
  pm10: number;   // PM10 (ug/m3)
  aqi: number;    // Air Quality Index (1-5)
}

// ===== 행동 가이드 =====

export type GuideIconKey =
  | "clothing-heavy"
  | "clothing-medium"
  | "clothing-light"
  | "clothing-minimal"
  | "umbrella-required"
  | "umbrella-optional"
  | "umbrella-none"
  | "air-good"
  | "air-normal"
  | "air-bad"
  | "air-critical";

export interface GuideItem {
  icon: GuideIconKey;  // 아이콘 키 (lucide-react 매핑용)
  message: string;     // 자연어 가이드 메시지
}

export interface DustGuideItem extends GuideItem {
  level: DustLevel;
}

export interface ActionGuide {
  clothing: GuideItem;
  umbrella: GuideItem;
  dust: DustGuideItem;
}

// ===== 위치 =====

export interface Location {
  name: string;     // 위치명 (예: "강남구")
  country: string;  // 국가 코드 (예: "KR")
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface CityOption extends Coordinates {
  name: string;
}

// ===== 일출/일몰 =====

export interface SunInfo {
  sunrise: number;  // Unix timestamp
  sunset: number;
}

// ===== 일별 기온 범위 =====

export interface DailyTemperature {
  high: number;
  low: number;
}

// ===== API 통합 응답 =====

export interface WeatherResponse {
  current: CurrentWeather;
  forecast: HourlyForecast[];
  airPollution: AirPollution;
  location: Location;
  guide: ActionGuide;
  sun: SunInfo;
  dailyTemp: DailyTemperature;
  yesterdayTemp: number;
  lastUpdated: number;
}

// ===== API 에러 =====

export interface ApiError {
  error: "INVALID_PARAMS" | "API_ERROR" | "CONFIG_ERROR" | "RATE_LIMIT";
  message: string;
}

// ===== 사용자 설정 =====

export type ThemeMode = "auto" | "light" | "dark";
export type TemperatureUnit = "celsius" | "fahrenheit";
export type WindSpeedUnit = "ms" | "kmh";
export type PrecipitationThreshold = 20 | 40 | 60;
export type RefreshInterval = 10 | 30 | 60;

export interface DefaultLocationData {
  cityId: string;
  coords: Coordinates;
  name: string;
  isMapSelection: boolean;
}

export interface UserSettings {
  themeMode: ThemeMode;
  temperatureUnit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
  showFeelsLike: boolean;
  precipitationThreshold: PrecipitationThreshold;
  refreshInterval: RefreshInterval;
  defaultLocation: DefaultLocationData | null;
}

// ===== 날씨 배경 테마 =====

export interface WeatherTheme {
  gradientFrom: string;
  gradientTo: string;
  textColor: string;       // 주요 텍스트 색상
  subTextColor: string;    // 보조 텍스트 색상
}

// ===== 탭 내비게이션 =====

export type TabId = "today" | "weekly" | "location" | "settings";

// ===== 위치 검색 결과 =====

export interface LocationSearchResult {
  id: string;
  name: string;        // 표시명 (예: "종로구", "강남역")
  fullName: string;    // 전체명 (예: "서울특별시 종로구")
  parentCity: string;  // MOCK_CITIES의 id (예: "seoul")
  coords: Coordinates;
  type: "city" | "district" | "neighborhood";
}
