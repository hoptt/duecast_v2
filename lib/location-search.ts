import { DISTRICTS } from "./districts";
import type { LocationSearchResult } from "./types";

/**
 * 구/동 단위 상세 지역 검색
 * 미래 API 교체 시 이 함수의 시그니처만 유지하면 됨
 */
export function searchLocations(query: string): LocationSearchResult[] {
  const q = query.trim();
  if (!q) return [];
  return DISTRICTS.filter(
    (d) => d.name.includes(q) || d.fullName.includes(q)
  );
}
