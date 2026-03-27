// OpenWeatherMap API 원시 응답 타입 (내부 전용)
// 클라이언트에 노출되지 않는 서버사이드 타입 정의

/** GET /data/2.5/weather */
export interface OWMCurrentResponse {
  coord: { lon: number; lat: number };
  weather: Array<{
    id: number;
    main: string;        // "Clear", "Clouds", "Rain" 등
    description: string; // lang=kr 시 한국어
    icon: string;        // "01d", "10n" 등
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility?: number;   // 미터 단위, 최대 10000
  wind: {
    speed: number;       // metric: m/s
    deg: number;
    gust?: number;
  };
  clouds: { all: number };
  rain?: { '1h': number };
  snow?: { '1h': number };
  dt: number;            // Unix timestamp (UTC)
  sys: {
    country: string;     // 예: "KR"
    sunrise: number;     // Unix timestamp
    sunset: number;      // Unix timestamp
  };
  timezone: number;      // UTC 오프셋 (초)
  id: number;
  name: string;          // 도시명
  cod: number;
}

/** GET /data/2.5/forecast (5일 / 3시간 간격) */
export interface OWMForecastResponse {
  cod: string;
  cnt: number;
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;   // 내부 파라미터
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: { all: number };
    wind: { speed: number; deg: number; gust: number };
    visibility: number;
    pop: number;         // 강수 확률 0.0~1.0
    rain?: { '3h': number };
    snow?: { '3h': number };
    sys: { pod: 'd' | 'n' };
    dt_txt: string;      // "2024-01-15 12:00:00"
  }>;
  city: {
    id: number;
    name: string;
    coord: { lat: number; lon: number };
    country: string;
    population: number;
    timezone: number;    // UTC 오프셋 (초)
    sunrise: number;
    sunset: number;
  };
}

/** GET /data/2.5/air_pollution */
export interface OWMAirPollutionResponse {
  coord: { lon: number; lat: number };
  list: Array<{
    dt: number;
    main: {
      aqi: 1 | 2 | 3 | 4 | 5; // 1:좋음 2:보통 3:나쁨 4:매우나쁨 5:위험
    };
    components: {
      co: number;    // μg/m³
      no: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number; // PM2.5 → AirPollution.pm25
      pm10: number;
      nh3: number;
    };
  }>;
}
