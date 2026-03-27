import type { LocationSearchResult } from "./types";

/**
 * 구/동 단위 상세 지역 데이터
 * parentCity: CITIES의 id 참조
 */
export const DISTRICTS: LocationSearchResult[] = [
  // ── 서울 25개 구 ──────────────────────────────────────────────
  { id: "seoul-jongno",     name: "종로구",   fullName: "서울특별시 종로구",   parentCity: "seoul",     coords: { lat: 37.5730, lon: 126.9794 }, type: "district" },
  { id: "seoul-jung",       name: "중구",     fullName: "서울특별시 중구",     parentCity: "seoul",     coords: { lat: 37.5636, lon: 126.9976 }, type: "district" },
  { id: "seoul-yongsan",    name: "용산구",   fullName: "서울특별시 용산구",   parentCity: "seoul",     coords: { lat: 37.5384, lon: 126.9654 }, type: "district" },
  { id: "seoul-seongdong",  name: "성동구",   fullName: "서울특별시 성동구",   parentCity: "seoul",     coords: { lat: 37.5637, lon: 127.0367 }, type: "district" },
  { id: "seoul-gwangjin",   name: "광진구",   fullName: "서울특별시 광진구",   parentCity: "seoul",     coords: { lat: 37.5385, lon: 127.0823 }, type: "district" },
  { id: "seoul-dongdaemun", name: "동대문구", fullName: "서울특별시 동대문구", parentCity: "seoul",     coords: { lat: 37.5744, lon: 127.0400 }, type: "district" },
  { id: "seoul-jungnang",   name: "중랑구",   fullName: "서울특별시 중랑구",   parentCity: "seoul",     coords: { lat: 37.6063, lon: 127.0927 }, type: "district" },
  { id: "seoul-seongbuk",   name: "성북구",   fullName: "서울특별시 성북구",   parentCity: "seoul",     coords: { lat: 37.5894, lon: 127.0167 }, type: "district" },
  { id: "seoul-gangbuk",    name: "강북구",   fullName: "서울특별시 강북구",   parentCity: "seoul",     coords: { lat: 37.6397, lon: 127.0257 }, type: "district" },
  { id: "seoul-dobong",     name: "도봉구",   fullName: "서울특별시 도봉구",   parentCity: "seoul",     coords: { lat: 37.6688, lon: 127.0467 }, type: "district" },
  { id: "seoul-nowon",      name: "노원구",   fullName: "서울특별시 노원구",   parentCity: "seoul",     coords: { lat: 37.6542, lon: 127.0568 }, type: "district" },
  { id: "seoul-eunpyeong",  name: "은평구",   fullName: "서울특별시 은평구",   parentCity: "seoul",     coords: { lat: 37.6177, lon: 126.9227 }, type: "district" },
  { id: "seoul-seodaemun",  name: "서대문구", fullName: "서울특별시 서대문구", parentCity: "seoul",     coords: { lat: 37.5791, lon: 126.9368 }, type: "district" },
  { id: "seoul-mapo",       name: "마포구",   fullName: "서울특별시 마포구",   parentCity: "seoul",     coords: { lat: 37.5663, lon: 126.9018 }, type: "district" },
  { id: "seoul-yangcheon",  name: "양천구",   fullName: "서울특별시 양천구",   parentCity: "seoul",     coords: { lat: 37.5170, lon: 126.8664 }, type: "district" },
  { id: "seoul-gangseo",    name: "강서구",   fullName: "서울특별시 강서구",   parentCity: "seoul",     coords: { lat: 37.5509, lon: 126.8495 }, type: "district" },
  { id: "seoul-guro",       name: "구로구",   fullName: "서울특별시 구로구",   parentCity: "seoul",     coords: { lat: 37.4954, lon: 126.8874 }, type: "district" },
  { id: "seoul-geumcheon",  name: "금천구",   fullName: "서울특별시 금천구",   parentCity: "seoul",     coords: { lat: 37.4570, lon: 126.8956 }, type: "district" },
  { id: "seoul-yeongdeungpo", name: "영등포구", fullName: "서울특별시 영등포구", parentCity: "seoul",   coords: { lat: 37.5264, lon: 126.8964 }, type: "district" },
  { id: "seoul-dongjak",    name: "동작구",   fullName: "서울특별시 동작구",   parentCity: "seoul",     coords: { lat: 37.5124, lon: 126.9393 }, type: "district" },
  { id: "seoul-gwanak",     name: "관악구",   fullName: "서울특별시 관악구",   parentCity: "seoul",     coords: { lat: 37.4784, lon: 126.9516 }, type: "district" },
  { id: "seoul-seocho",     name: "서초구",   fullName: "서울특별시 서초구",   parentCity: "seoul",     coords: { lat: 37.4836, lon: 127.0326 }, type: "district" },
  { id: "seoul-gangnam",    name: "강남구",   fullName: "서울특별시 강남구",   parentCity: "seoul",     coords: { lat: 37.5172, lon: 127.0473 }, type: "district" },
  { id: "seoul-songpa",     name: "송파구",   fullName: "서울특별시 송파구",   parentCity: "seoul",     coords: { lat: 37.5145, lon: 127.1059 }, type: "district" },
  { id: "seoul-gangdong",   name: "강동구",   fullName: "서울특별시 강동구",   parentCity: "seoul",     coords: { lat: 37.5301, lon: 127.1238 }, type: "district" },

  // ── 서울 주요 동/랜드마크 ────────────────────────────────────
  { id: "seoul-jongno1ga",  name: "종로 1가", fullName: "서울특별시 종로구 종로 1가", parentCity: "seoul", coords: { lat: 37.5697, lon: 126.9806 }, type: "neighborhood" },
  { id: "seoul-jongno3ga",  name: "종로 3가", fullName: "서울특별시 종로구 종로 3가", parentCity: "seoul", coords: { lat: 37.5706, lon: 126.9919 }, type: "neighborhood" },
  { id: "seoul-gangnamst",  name: "강남역",   fullName: "서울특별시 강남구 강남역",   parentCity: "seoul", coords: { lat: 37.4979, lon: 127.0276 }, type: "neighborhood" },
  { id: "seoul-myeongdong", name: "명동",     fullName: "서울특별시 중구 명동",       parentCity: "seoul", coords: { lat: 37.5636, lon: 126.9855 }, type: "neighborhood" },
  { id: "seoul-hongdae",    name: "홍대",     fullName: "서울특별시 마포구 홍대",     parentCity: "seoul", coords: { lat: 37.5574, lon: 126.9243 }, type: "neighborhood" },
  { id: "seoul-sinchon",    name: "신촌",     fullName: "서울특별시 서대문구 신촌",   parentCity: "seoul", coords: { lat: 37.5551, lon: 126.9362 }, type: "neighborhood" },
  { id: "seoul-itaewon",    name: "이태원",   fullName: "서울특별시 용산구 이태원",   parentCity: "seoul", coords: { lat: 37.5344, lon: 126.9940 }, type: "neighborhood" },
  { id: "seoul-apgujeong",  name: "압구정",   fullName: "서울특별시 강남구 압구정",   parentCity: "seoul", coords: { lat: 37.5271, lon: 127.0291 }, type: "neighborhood" },
  { id: "seoul-jamsil",     name: "잠실",     fullName: "서울특별시 송파구 잠실",     parentCity: "seoul", coords: { lat: 37.5133, lon: 127.1002 }, type: "neighborhood" },
  { id: "seoul-yeouido",    name: "여의도",   fullName: "서울특별시 영등포구 여의도", parentCity: "seoul", coords: { lat: 37.5216, lon: 126.9246 }, type: "neighborhood" },

  // ── 부산 주요 구 ──────────────────────────────────────────────
  { id: "busan-haeundae",  name: "해운대구", fullName: "부산광역시 해운대구", parentCity: "busan", coords: { lat: 35.1631, lon: 129.1635 }, type: "district" },
  { id: "busan-nam",       name: "남구",     fullName: "부산광역시 남구",     parentCity: "busan", coords: { lat: 35.1364, lon: 129.0842 }, type: "district" },
  { id: "busan-busanjin",  name: "부산진구", fullName: "부산광역시 부산진구", parentCity: "busan", coords: { lat: 35.1624, lon: 129.0531 }, type: "district" },
  { id: "busan-jung",      name: "중구",     fullName: "부산광역시 중구",     parentCity: "busan", coords: { lat: 35.1036, lon: 129.0325 }, type: "district" },
  { id: "busan-suyeong",   name: "수영구",   fullName: "부산광역시 수영구",   parentCity: "busan", coords: { lat: 35.1453, lon: 129.1134 }, type: "district" },

  // ── 대구 주요 구 ──────────────────────────────────────────────
  { id: "daegu-jung",      name: "중구",   fullName: "대구광역시 중구",   parentCity: "daegu", coords: { lat: 35.8686, lon: 128.6063 }, type: "district" },
  { id: "daegu-suseong",   name: "수성구", fullName: "대구광역시 수성구", parentCity: "daegu", coords: { lat: 35.8577, lon: 128.6307 }, type: "district" },
  { id: "daegu-dalseo",    name: "달서구", fullName: "대구광역시 달서구", parentCity: "daegu", coords: { lat: 35.8296, lon: 128.5336 }, type: "district" },

  // ── 인천 주요 구 ──────────────────────────────────────────────
  { id: "incheon-yeonsu",  name: "연수구", fullName: "인천광역시 연수구", parentCity: "incheon", coords: { lat: 37.4104, lon: 126.6779 }, type: "district" },
  { id: "incheon-namdong", name: "남동구", fullName: "인천광역시 남동구", parentCity: "incheon", coords: { lat: 37.4469, lon: 126.7315 }, type: "district" },
  { id: "incheon-bupyeong", name: "부평구", fullName: "인천광역시 부평구", parentCity: "incheon", coords: { lat: 37.4878, lon: 126.7226 }, type: "district" },

  // ── 제주 주요 읍/시 ───────────────────────────────────────────
  { id: "jeju-aewol",      name: "애월읍",  fullName: "제주시 애월읍",   parentCity: "jeju", coords: { lat: 33.4631, lon: 126.3264 }, type: "district" },
  { id: "jeju-seogwipo",   name: "서귀포시", fullName: "제주 서귀포시", parentCity: "jeju", coords: { lat: 33.2541, lon: 126.5600 }, type: "district" },
  { id: "jeju-seongsan",   name: "성산읍",  fullName: "제주시 성산읍",   parentCity: "jeju", coords: { lat: 33.4439, lon: 126.9181 }, type: "district" },

  // ── 강릉 주요 읍/동 ───────────────────────────────────────────
  { id: "gangneung-jumunjin", name: "주문진읍", fullName: "강릉시 주문진읍", parentCity: "gangneung", coords: { lat: 37.8987, lon: 128.8209 }, type: "district" },
  { id: "gangneung-gyeongpo", name: "경포동",   fullName: "강릉시 경포동",   parentCity: "gangneung", coords: { lat: 37.7988, lon: 128.9019 }, type: "neighborhood" },
  { id: "gangneung-okgye",    name: "옥계면",   fullName: "강릉시 옥계면",   parentCity: "gangneung", coords: { lat: 37.6217, lon: 129.0364 }, type: "district" },
];
