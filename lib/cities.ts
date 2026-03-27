import type { Coordinates } from "./types";

export interface CityData {
  id: string;
  name: string;
  address: string;
  coords: Coordinates;
}

export const CITIES: CityData[] = [
  { id: "seoul",     name: "서울특별시", address: "서울특별시 중구 세종대로 110",         coords: { lat: 37.5665, lon: 126.978  } },
  { id: "busan",     name: "부산광역시", address: "부산광역시 연제구 중앙대로 1001",       coords: { lat: 35.1796, lon: 129.0756 } },
  { id: "jeju",      name: "제주시",     address: "제주특별자치도 제주시 광양9길 10",      coords: { lat: 33.4996, lon: 126.5312 } },
  { id: "incheon",   name: "인천광역시", address: "인천광역시 남동구 정각로 29",           coords: { lat: 37.4563, lon: 126.7052 } },
  { id: "daegu",     name: "대구광역시", address: "대구광역시 중구 공평로 88",             coords: { lat: 35.8714, lon: 128.6014 } },
  { id: "gangneung", name: "강릉시",     address: "강원특별자치도 강릉시 강릉대로 33",     coords: { lat: 37.7519, lon: 128.876  } },
];

export const DEFAULT_CITY_ID = "seoul";
