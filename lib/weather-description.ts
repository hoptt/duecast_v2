/**
 * OWM weather condition id → 대중 친화적 한국어 description 매핑.
 * id 기반으로 OWM의 lang=kr 번역 변동에 영향받지 않음.
 * https://openweathermap.org/weather-conditions
 */
const WEATHER_DESCRIPTION_KR: Record<number, string> = {
  // Thunderstorm (200-232)
  200: "가벼운 비를 동반한 천둥번개",
  201: "비를 동반한 천둥번개",
  202: "폭우를 동반한 천둥번개",
  210: "약한 천둥번개",
  211: "천둥번개",
  212: "강한 천둥번개",
  221: "천둥번개",
  230: "약한 이슬비를 동반한 천둥번개",
  231: "이슬비를 동반한 천둥번개",
  232: "강한 이슬비를 동반한 천둥번개",

  // Drizzle (300-321)
  300: "가벼운 이슬비",
  301: "이슬비",
  302: "강한 이슬비",
  310: "가벼운 가랑비",
  311: "가랑비",
  312: "강한 가랑비",
  313: "소나기성 이슬비",
  314: "강한 소나기성 이슬비",
  321: "소나기성 이슬비",

  // Rain (500-531)
  500: "약한 비",
  501: "비",
  502: "강한 비",
  503: "매우 강한 비",
  504: "폭우",
  511: "우박성 비",
  520: "약한 소나기",
  521: "소나기",
  522: "강한 소나기",
  531: "소나기",

  // Snow (600-622)
  600: "약한 눈",
  601: "눈",
  602: "강한 눈",
  611: "진눈깨비",
  612: "약한 진눈깨비",
  613: "소나기성 진눈깨비",
  615: "비와 눈",
  616: "비와 눈",
  620: "약한 소나기 눈",
  621: "소나기 눈",
  622: "강한 소나기 눈",

  // Atmosphere (701-781)
  701: "옅은 안개",   // Mist — "박무" 대체
  711: "연기",        // Smoke
  721: "실안개",      // Haze — "연무" 대체
  731: "황사",        // Dust whirls
  741: "안개",        // Fog
  751: "황사",        // Sand
  761: "먼지",        // Dust
  762: "화산재",      // Volcanic ash
  771: "돌풍",        // Squall
  781: "토네이도",    // Tornado

  // Clear (800)
  800: "맑음",

  // Clouds (801-804)
  801: "약간 구름",    // few clouds 11-25%
  802: "구름 많음",    // scattered clouds 25-50% — "튼구름" 대체
  803: "흐림",         // broken clouds 51-84% — "온흐림" 대체
  804: "매우 흐림",    // overcast clouds 85-100%
};

/**
 * OWM weather condition id를 대중 친화적 한국어 description으로 변환.
 * 매핑에 없는 id는 fallback(OWM 원본 description)을 반환.
 */
export function getWeatherDescriptionKr(
  weatherId: number,
  fallback: string = ""
): string {
  return WEATHER_DESCRIPTION_KR[weatherId] ?? fallback;
}
