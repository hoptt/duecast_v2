"use client";

import { useState } from "react";
import type { LocationSearchResult } from "@/lib/types";
import { MOCK_CITIES } from "@/lib/mock-cities";
import { searchLocations } from "@/lib/location-search";
import { WeatherIcon, CloudSun } from "@/lib/weather-icons";
import { MapPin, Search, X, LocateFixed, Star } from "lucide-react";
import LeafletMap from "@/components/LeafletMap";
import { useAppStore } from "@/lib/store";

export default function LocationTab() {
  const selectedCityId = useAppStore((s) => s.selectedCityId);
  const isMapSelection = useAppStore((s) => s.isMapSelection);
  const selectCity = useAppStore((s) => s.selectCity);
  const selectDistrict = useAppStore((s) => s.selectDistrict);
  const defaultLocation = useAppStore((s) => s.settings.defaultLocation);
  const selectMapLocation = useAppStore((s) => s.selectMapLocation);
  const setActiveTab = useAppStore((s) => s.setActiveTab);

  const [query, setQuery] = useState("");

  const trimmedQuery = query.trim();
  const isSearching = trimmedQuery.length > 0;

  const CITY_ORDER = ["seoul", "incheon", "daegu", "busan", "gangneung", "jeju"];

  // 저장된 위치 필터 (근접 위치 기준 순서 정렬)
  const filteredCities = (isSearching
    ? MOCK_CITIES.filter((c) => c.name.includes(trimmedQuery))
    : MOCK_CITIES
  ).slice().sort((a, b) => CITY_ORDER.indexOf(a.id) - CITY_ORDER.indexOf(b.id));

  // 상세 지역 검색 결과 (검색 중일 때만)
  const districtResults = isSearching ? searchLocations(trimmedQuery) : [];

  const hasAnything = filteredCities.length > 0 || districtResults.length > 0;

  return (
    <div className="flex flex-col flex-1 px-4" style={{ paddingBottom: "calc(5rem + env(safe-area-inset-bottom, 0px))" }}>
      {/* 헤더 */}
      <header className="pt-4 pb-4">
        <h1 className="text-sm font-semibold text-[var(--color-text-main)] tracking-wide flex items-center gap-1.5">
          <MapPin size={14} className="opacity-70" aria-hidden="true" />
          위치 관리
        </h1>
      </header>

      {/* 검색바 */}
      <div className="neu-pressed rounded-[var(--radius-card-sm)] px-4 h-12 mb-3 flex items-center gap-2">
        <Search size={16} className="text-[var(--color-text-muted)] shrink-0" aria-hidden="true" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="도시, 구, 동 검색 (예: 종로 1가)"
          className={[
            "flex-1 bg-transparent outline-none focus:outline-none ring-0 focus:ring-0 border-none focus:border-none",
            "text-sm text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)]",
          ].join(" ")}
        />
        {isSearching && (
          <button
            onClick={() => setQuery("")}
            aria-label="검색어 지우기"
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors
                       flex items-center justify-center size-6 -mr-1 shrink-0"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* GPS 버튼 (비활성) */}
      <div
        className="neu-raised px-4 py-3 mb-5 opacity-50 cursor-not-allowed"
        aria-disabled="true"
      >
        <div className="flex items-center gap-2">
          <LocateFixed size={16} className="text-[var(--color-text-muted)] shrink-0" aria-hidden="true" />
          <div className="flex flex-col">
            <span className="text-sm text-[var(--color-text-main)]">현재 위치 사용</span>
            <span className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
              GPS 미구현 — Sprint 3에서 구현 예정
            </span>
          </div>
        </div>
      </div>

      {/* 기본 위치 카드 */}
      {defaultLocation && (() => {
        const city = MOCK_CITIES.find((c) => c.id === defaultLocation.cityId);
        return (
          <div className="mb-5">
            <p className="text-xs font-semibold tracking-[0.08em] uppercase text-[var(--color-text-sub)] mb-3">
              기본 위치
            </p>
            <div
              className="neu-pressed rounded-[var(--radius-card-sm)] px-4 py-3 flex items-center gap-3 w-full text-left"
            >
              <Star
                size={14}
                className="text-[var(--color-primary)] shrink-0"
                fill="currentColor"
                aria-hidden="true"
              />
              <div className="flex flex-col flex-1">
                <span className="text-sm font-semibold text-[var(--color-text-main)]">
                  {defaultLocation.name}
                </span>
                {city && (
                  <span className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    {city.weather.current.weather.description}
                  </span>
                )}
              </div>
              {city && (
                <span
                  className="text-lg text-[var(--color-text-main)] mb-auto"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
                >
                  {city.weather.current.temp}°
                </span>
              )}
            </div>
          </div>
        );
      })()}

      {/* 저장된 위치 섹션 */}
      {filteredCities.length > 0 && (
        <>
          <p className="text-xs font-semibold tracking-[0.08em] uppercase text-[var(--color-text-sub)] mb-3">
            주요 도시
          </p>
          <div className="grid grid-cols-2 gap-2 mb-5">
            {filteredCities.map((city) => {
              const isSelected = city.id === selectedCityId && !isMapSelection;
              const { current } = city.weather;

              return (
                <button
                  key={city.id}
                  onClick={() => selectCity(city.id)}
                  aria-label={`${city.name} 선택`}
                  className={[
                    "p-4 text-left w-full rounded-[var(--radius-card)] cursor-pointer",
                    "transition-all duration-150",
                    isSelected
                      ? "neu-pressed"
                      : "neu-raised hover:opacity-95",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="flex flex-col">
                        <span className="relative">
                          {isSelected && (
                            <span className="absolute -bottom-[-1px] left-0 w-full h-0.5 bg-[var(--color-primary)] rounded-full" />
                          )}
                          <span className={["text-sm font-semibold leading-tight", isSelected ? "text-[var(--color-primary)]" : "text-[var(--color-text-main)]"].join(" ")}>
                            {city.name}
                          </span>
                        </span>
                        <span className="text-xs text-[var(--color-text-muted)] mt-0.5">
                          {current.weather.description}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span
                        className="text-lg text-[var(--color-text-main)]"
                        style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
                      >
                        {current.temp}°
                      </span>
                      <span aria-hidden="true">
                        <WeatherIcon condition={current.weather.main} size={18} />
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* 지도 탐색 */}
      {!isSearching && <LeafletMap />}

      {/* 상세 지역 검색 결과 섹션 */}
      {isSearching && districtResults.length > 0 && (
        <>
          <p className="text-xs font-semibold tracking-[0.08em] uppercase text-[var(--color-text-sub)] mb-3">
            상세 지역
          </p>
          <div className="flex flex-col gap-1">
            {districtResults.map((result: LocationSearchResult) => {
              const parentCity = MOCK_CITIES.find((c) => c.id === result.parentCity);
              const weatherCondition = parentCity?.weather.current.weather.main;
              const temp = parentCity?.weather.current.temp;
              const typeLabel = result.type === "neighborhood" ? "동" : "구";

              return (
                <button
                  key={result.id}
                  onClick={() => selectDistrict(result)}
                  className={[
                    "px-4 py-3 rounded-xl text-left w-full",
                    "bg-[var(--overlay-cell)] hover:bg-[var(--overlay-hover)] transition-colors duration-150",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between">
                    {/* 왼쪽: 타입 태그 + 이름 + 전체명 */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-[var(--overlay-badge)] text-[var(--color-text-sub)] font-medium">
                        {typeLabel}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-sm text-[var(--color-text-main)]">
                          {result.name}
                        </span>
                        <span className="text-xs text-[var(--color-text-muted)] mt-0.5">
                          {result.fullName}
                        </span>
                      </div>
                    </div>

                    {/* 오른쪽: 부모 도시 온도 + 아이콘 */}
                    {parentCity && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className="text-base text-[var(--color-text-main)]"
                          style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
                        >
                          {temp}°
                        </span>
                        <span aria-hidden="true">
                          {weatherCondition
                            ? <WeatherIcon condition={weatherCondition} size={16} />
                            : <CloudSun size={16} className="text-amber-300" />
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* 검색 결과 없음 */}
      {isSearching && !hasAnything && (
        <p className="text-sm text-[var(--color-text-muted)] text-center py-8">
          &ldquo;{trimmedQuery}&rdquo;에 대한 검색 결과가 없어요.
        </p>
      )}

      {/* 검색 안 할 때 저장 도시가 없으면 (이론상 없지만 방어 코드) */}
      {!isSearching && filteredCities.length === 0 && (
        <p className="text-sm text-[var(--color-text-muted)] text-center py-8">
          저장된 위치가 없어요.
        </p>
      )}
    </div>
  );
}
