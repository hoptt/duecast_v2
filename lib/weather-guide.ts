import type {
  CurrentWeather,
  AirPollution,
  HourlyForecast,
  ActionGuide,
  GuideItem,
  DustGuideItem,
  DustLevel,
} from "./types";

function getClothingGuide(temp: number): GuideItem {
  if (temp <= 5)  return { icon: "clothing-heavy",   message: "따뜻하게 두꺼운 외투를 챙겨주세요." };
  if (temp <= 11) return { icon: "clothing-heavy",   message: "코트나 자켓이 필요한 날씨예요." };
  if (temp <= 16) return { icon: "clothing-medium",  message: "가벼운 겉옷 하나면 충분해요." };
  if (temp <= 22) return { icon: "clothing-light",   message: "긴팔이면 딱 좋은 날씨예요." };
  if (temp <= 27) return { icon: "clothing-light",   message: "반팔 입기 좋은 날이에요." };
  return           { icon: "clothing-minimal", message: "무더운 날이에요. 시원하게 입으세요." };
}

function getUmbrellaGuide(forecasts: HourlyForecast[], now: Date): GuideItem {
  const nowMs = now.getTime();

  // 오늘 자정 타임스탬프
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);
  const todayEndMs = todayEnd.getTime();

  // 오늘 남은 시간대 필터
  let remaining = forecasts.filter(
    (f) => f.dt * 1000 >= nowMs && f.dt * 1000 <= todayEndMs
  );

  // 오늘 남은 데이터 없으면 (자정 직전 등) 앞 6개 사용
  if (remaining.length === 0) {
    remaining = forecasts.slice(0, 6);
  }

  const maxPop = remaining.length > 0
    ? Math.max(...remaining.map((f) => f.pop))
    : 0;

  if (maxPop >= 60) return { icon: "umbrella-required", message: "우산을 꼭 챙겨주세요." };
  if (maxPop >= 30) return { icon: "umbrella-optional", message: "우산을 챙기시면 안심이에요." };
  return { icon: "umbrella-none", message: "우산은 필요 없어요." };
}

const DUST_ORDER: DustLevel[] = ["좋음", "보통", "나쁨", "매우 나쁨"];

function classifyPm25(pm25: number): DustLevel {
  if (pm25 <= 15) return "좋음";
  if (pm25 <= 35) return "보통";
  if (pm25 <= 75) return "나쁨";
  return "매우 나쁨";
}

function classifyPm10(pm10: number): DustLevel {
  if (pm10 <= 30)  return "좋음";
  if (pm10 <= 80)  return "보통";
  if (pm10 <= 150) return "나쁨";
  return "매우 나쁨";
}

function getDustGuide(air: AirPollution): DustGuideItem {
  const pm25Level = classifyPm25(air.pm25);
  const pm10Level = classifyPm10(air.pm10);
  // 더 나쁜 등급 채택
  const level =
    DUST_ORDER.indexOf(pm25Level) >= DUST_ORDER.indexOf(pm10Level)
      ? pm25Level
      : pm10Level;

  switch (level) {
    case "좋음":
      return { icon: "air-good",     message: "공기가 깨끗해요. 마음껏 활동하세요.", level };
    case "보통":
      return { icon: "air-normal",   message: "미세먼지 보통이에요. 마스크는 선택.", level };
    case "나쁨":
      return { icon: "air-bad",      message: "미세먼지가 나빠요. 마스크를 챙기세요.", level };
    case "매우 나쁨":
      return { icon: "air-critical", message: "미세먼지가 매우 나빠요. 외출을 자제해주세요.", level };
  }
}

export function getActionGuide(
  weather: CurrentWeather,
  air: AirPollution,
  forecasts: HourlyForecast[],
  now: Date
): ActionGuide {
  return {
    clothing: getClothingGuide(weather.temp),
    umbrella: getUmbrellaGuide(forecasts, now),
    dust: getDustGuide(air),
  };
}
