"use client";

import { useState, useCallback } from "react";
import type { LocationSearchResult } from "@/lib/types";
import { CITIES } from "@/lib/cities";
import { searchLocations } from "@/lib/location-search";
import { WeatherIcon, CloudSun } from "@/lib/weather-icons";
import { MapPin, Search, X, LocateFixed, Star } from "lucide-react";
import LeafletMap from "@/components/LeafletMap";
import { useAppStore } from "@/lib/store";
import { useCityWeathers } from "@/hooks/useCityWeathers";
import { useGeolocation } from "@/hooks/useGeolocation";
import { reverseGeocode } from "@/lib/geocoding";

export default function LocationTab() {
  const selectedCityId = useAppStore((s) => s.selectedCityId);
  const isMapSelection = useAppStore((s) => s.isMapSelection);
  const locationOverride = useAppStore((s) => s.locationOverride);
  const selectCity = useAppStore((s) => s.selectCity);
  const selectDistrict = useAppStore((s) => s.selectDistrict);
  const defaultLocation = useAppStore((s) => s.settings.defaultLocation);
  const selectMapLocation = useAppStore((s) => s.selectMapLocation);
  const setActiveTab = useAppStore((s) => s.setActiveTab);

  const [query, setQuery] = useState("");
  const [gpsLoading, setGpsLoading] = useState(false);

  // 도시 실시간 날씨 프리뷰
  const { data: cityWeathers } = useCityWeathers();

  // GPS 버튼용 geolocation (한 번만 호출하지 않고 버튼 클릭 시 요청)
  const { coords: geoCoords } = useGeolocation();

  const handleGpsClick = useCallback(async () => {
    if (!geoCoords) return;
    setGpsLoading(true);
    try {
      const name = await reverseGeocode(geoCoords.lat, geoCoords.lon) ?? "현재 위치";
      // 가장 가까운 도시 찾기 (간단히 서울 기본)
      const nearestCity = CITIES[0];
      selectMapLocation(nearestCity.id, geoCoords, name);
      setActiveTab("today");
    } finally {
      setGpsLoading(false);
    }
  }, [geoCoords, selectMapLocation, setActiveTab]);

  const trimmedQuery = query.trim();
  const isSearching = trimmedQuery.length > 0;

  const CITY_ORDER = ["seoul", "incheon", "daegu", "busan", "gangneung", "jeju"];

  // 저장된 위치 필터 (근접 위치 기준 순서 정렬)
  const filteredCities = (isSearching
    ? CITIES.filter((c) => c.name.includes(trimmedQuery))
    : CITIES
  ).slice().sort((a, b) => CITY_ORDER.indexOf(a.id) - CITY_ORDER.indexOf(b.id));

  // 상세 지역 검색 결과 (검색 중일 때만)
  const districtResults = isSearching ? searchLocations(trimmedQuery) : [];

  const hasAnything = filteredCities.length > 0 || districtResults.length > 0;

  return (
    <div className="flex flex-col flex-1 px-4" style={{ paddingBottom: "calc(5.5rem + env(safe-area-inset-bottom, 0px))" }}>
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

      {/* GPS 버튼 */}
      <button
        onClick={handleGpsClick}
        disabled={!geoCoords || gpsLoading}
        className={[
          "neu-raised px-4 py-3 mb-5 w-full text-left",
          "transition-all duration-150",
          !geoCoords || gpsLoading
            ? "opacity-50 cursor-not-allowed"
            : "hover:opacity-95 active:neu-pressed",
        ].join(" ")}
        aria-label="현재 위치로 날씨 확인"
      >
        <div className="flex items-center gap-2">
          <LocateFixed
            size={16}
            className={gpsLoading ? "text-[var(--color-primary)] animate-pulse" : "text-[var(--color-text-muted)]"}
            aria-hidden="true"
          />
          <div className="flex flex-col">
            <span className="text-sm text-[var(--color-text-main)]">현재 위치 사용</span>
            <span className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
              {gpsLoading
                ? "위치를 가져오는 중..."
                : geoCoords
                  ? "현재 위치 기반 날씨 확인"
                  : "위치 권한이 필요합니다"}
            </span>
          </div>
        </div>
      </button>

      {/* 기본 위치 카드 */}
      {defaultLocation && (() => {
        const preview = cityWeathers.get(defaultLocation.cityId);
        const isDefaultActive =
          selectedCityId === defaultLocation.cityId &&
          locationOverride?.name === defaultLocation.name;
        const handleDefaultLocationClick = () => {
          if (defaultLocation.isMapSelection) {
            selectMapLocation(defaultLocation.cityId, defaultLocation.coords, defaultLocation.name);
          } else {
            selectCity(defaultLocation.cityId);
          }
          setActiveTab("today");
        };
        return (
          <div className="mb-5">
            <p className="text-xs font-semibold tracking-[0.08em] uppercase text-[var(--color-text-sub)] mb-3">
              기본 위치
            </p>
            <button
              onClick={handleDefaultLocationClick}
              aria-label={`${defaultLocation.name} 기본 위치로 이동`}
              className={[
                "rounded-[var(--radius-card-sm)] px-4 py-3 flex items-center gap-3 w-full text-left transition-opacity duration-150 cursor-pointer",
                isDefaultActive ? "neu-pressed" : "neu-raised hover:opacity-95 active:opacity-80",
              ].join(" ")}
            >
              <Star
                size={14}
                className="text-[var(--color-primary)] shrink-0"
                fill="currentColor"
                aria-hidden="true"
              />
              <div className="flex flex-col flex-1">
                <span className="relative max-w-fit">
                  {isDefaultActive && (
                    <span className="absolute -bottom-[-1px] left-0 w-full h-0.5 bg-[var(--color-primary)] rounded-full" />
                  )}
                  <span className={["text-sm font-semibold leading-tight", isDefaultActive ? "text-[var(--color-primary)]" : "text-[var(--color-text-main)]"].join(" ")}>
                    {defaultLocation.name}
                  </span>
                </span>
                {preview && (
                  <span className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    {preview.description}
                  </span>
                )}
              </div>
              {preview && (
                <span
                  className="text-lg text-[var(--color-text-main)] mb-auto"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
                >
                  {preview.temp}°
                </span>
              )}
            </button>
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
              const preview = cityWeathers.get(city.id);

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
                          {preview?.description ?? "—"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span
                        className="text-lg text-[var(--color-text-main)]"
                        style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
                      >
                        {preview != null ? `${preview.temp}°` : "—"}
                      </span>
                      <span aria-hidden="true">
                        {preview
                          ? <WeatherIcon condition={preview.condition} size={18} />
                          : <CloudSun size={18} className="text-amber-300" />
                        }
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
              const preview = cityWeathers.get(result.parentCity);
              const weatherCondition = preview?.condition;
              const temp = preview?.temp;
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
                    {preview && (
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
