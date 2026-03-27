"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, Map, Hand, Star } from "lucide-react";
import "leaflet/dist/leaflet.css";
import type { CityData } from "@/lib/cities";
import { CITIES } from "@/lib/cities";
import type { Map as LeafletMapType, Marker, LeafletMouseEvent } from "leaflet";
import { reverseGeocode } from "@/lib/geocoding";
import { useAppStore, useSelectedCoords, useSelectedCityId } from "@/lib/store";
import { useWeather } from "@/hooks/useWeather";

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function findNearestCity(
  lat: number,
  lng: number,
  cities: CityData[]
): CityData {
  return cities.reduce((nearest, city) => {
    const d = haversineDistance(lat, lng, city.coords.lat, city.coords.lon);
    const dNearest = haversineDistance(
      lat,
      lng,
      nearest.coords.lat,
      nearest.coords.lon
    );
    return d < dNearest ? city : nearest;
  });
}

export default function LeafletMap() {
  const mapActivated = useAppStore((s) => s.mapActivated);
  const activateMap = useAppStore((s) => s.activateMap);
  const setActiveTab = useAppStore((s) => s.setActiveTab);
  const selectMapLocation = useAppStore((s) => s.selectMapLocation);
  const mapClickedCoords = useAppStore((s) => s.mapClickedCoords);
  const selectedCityId = useAppStore((s) => s.selectedCityId);
  const mapFlyTarget = useAppStore((s) => s.mapFlyTarget);
  const clearMapFlyTarget = useAppStore((s) => s.clearMapFlyTarget);
  const isMapSelectionStore = useAppStore((s) => s.isMapSelection);
  const locationOverrideStore = useAppStore((s) => s.locationOverride);
  const settings = useAppStore((s) => s.settings);
  const setDefaultLocation = useAppStore((s) => s.setDefaultLocation);

  const initialCenter = mapClickedCoords
    ?? CITIES.find((c) => c.id === selectedCityId)?.coords;

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMapType | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const isMapSelectionRef = useRef(isMapSelectionStore);
  const locationOverrideRef = useRef(locationOverrideStore);
  isMapSelectionRef.current = isMapSelectionStore;
  locationOverrideRef.current = locationOverrideStore;

  const storeCoords = useSelectedCoords();
  const cityId = useSelectedCityId();
  const { data: pointWeather } = useWeather(storeCoords, cityId);

  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleMapClick = useCallback(
    (e: LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      const nearest = findNearestCity(lat, lng, CITIES);

      if (markerRef.current) {
        markerRef.current.remove();
      }

      import("leaflet").then((L) => {
        if (!mapRef.current) return;
        const marker = L.circleMarker([lat, lng], {
          radius: 8,
          fillColor: "var(--color-primary, #2e7cf6)",
          color: "#fff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9,
        }).addTo(mapRef.current);
        markerRef.current = marker as unknown as Marker;
        mapRef.current.panTo([lat, lng], { animate: true, duration: 0.5 });
      });

      setSelectedCity(nearest);
      // 즉시 도시명으로 오늘 탭 업데이트
      selectMapLocation(nearest.id, { lat, lon: lng }, nearest.name);

      // 카드 렌더 후 위치탭 최하단으로 스크롤
      setTimeout(() => {
        mapContainerRef.current?.closest("[class*='overflow-y']")
          ?.scrollTo({ top: 999999, behavior: "smooth" });
      }, 100);

      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;
      setAddress(null);
      setAddressLoading(true);
      reverseGeocode(lat, lng, controller.signal).then((result) => {
        setAddress(result);
        setAddressLoading(false);
        // 주소 확정 후 오늘 탭 이름 업데이트
        if (result) selectMapLocation(nearest.id, { lat, lon: lng }, result);
      });
    },
    [selectMapLocation]
  );

  // 주요도시 클릭 시 지도 이동 + 마커 표시
  useEffect(() => {
    if (!mapFlyTarget || !mapRef.current) return;
    const { lat, lon } = mapFlyTarget;
    mapRef.current.flyTo([lat, lon], 11, { animate: true, duration: 1.2 });
    import("leaflet").then((L) => {
      if (!mapRef.current) return;
      if (markerRef.current) markerRef.current.remove();
      const marker = L.circleMarker([lat, lon], {
        radius: 8,
        fillColor: "var(--color-primary, #2e7cf6)",
        color: "#fff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9,
      }).addTo(mapRef.current);
      markerRef.current = marker as unknown as Marker;
      const nearest = findNearestCity(lat, lon, CITIES);
      setSelectedCity(nearest);
      setAddress(nearest.address ?? null);
      setAddressLoading(false);
    });
    clearMapFlyTarget();
  }, [mapFlyTarget, clearMapFlyTarget]);

  // 지도 초기화 — 탭 후에만 실행
  useEffect(() => {
    if (!mapActivated || !mapContainerRef.current) return;

    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !mapContainerRef.current) return;

      // 기본 마커 아이콘 경로 이슈 방지
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const center: [number, number] = initialCenter
        ? [initialCenter.lat, initialCenter.lon]
        : [36.5, 127.5];
      const map = L.map(mapContainerRef.current, {
        center,
        zoom: initialCenter ? 11 : 7,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
      }).addTo(map);

      map.on("click", handleMapClick);
      mapRef.current = map;

      // 초기 위치 마커 + 날씨 팝업
      if (initialCenter) {
        const { lat, lon } = initialCenter;
        const marker = L.circleMarker([lat, lon], {
          radius: 8,
          fillColor: "var(--color-primary, #2e7cf6)",
          color: "#fff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9,
        }).addTo(map);
        markerRef.current = marker as unknown as Marker;

        const nearest = findNearestCity(lat, lon, CITIES);
        setSelectedCity(nearest);

        // 이전 탭 전환으로 리마운트된 경우 저장된 상태 복원
        if (isMapSelectionRef.current && locationOverrideRef.current?.name) {
          // 지도 직접 클릭 후 복귀 → 캐시된 Nominatim 주소 재사용
          setAddress(locationOverrideRef.current.name);
          setAddressLoading(false);
        } else if (!isMapSelectionRef.current) {
          // 주요도시 선택 후 복귀 → 내장 주소 사용 (Nominatim 불필요)
          setAddress(nearest.address ?? null);
          setAddressLoading(false);
        } else {
          const controller = new AbortController();
          abortControllerRef.current = controller;
          setAddressLoading(true);
          reverseGeocode(lat, lon, controller.signal).then((result) => {
            setAddress(result);
            setAddressLoading(false);
          });
        }
      }
    });

    return () => {
      cancelled = true;
      abortControllerRef.current?.abort();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [mapActivated, handleMapClick]); // eslint-disable-line react-hooks/exhaustive-deps


  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.08em] uppercase text-[var(--color-text-sub)] mb-3">
        지도 탐색
      </p>

      <div className="relative">
        {/* 지도 컨테이너 */}
        <div
          ref={mapContainerRef}
          className={`rounded-[var(--radius-card)] overflow-hidden h-64 w-full isolate`}
        />

        {/* tap-to-activate 오버레이 */}
        {!mapActivated && (
          <div
            className={`neu-pressed absolute inset-0 z-10 rounded-[var(--radius-card)] flex flex-col items-center justify-center gap-4`}
          >
            {/* 지도 아이콘 — 부유 애니메이션 */}
            <Map
              size={36}
              className="text-[var(--color-primary)] animate-float opacity-80"
              aria-hidden="true"
            />

            {/* CTA 버튼 */}
            <div
              className="neu-button flex items-center gap-2 px-5 py-2.5 cursor-pointer select-none"
              style={{ borderRadius: "var(--radius-pill)" }}
              onClick={activateMap}
            >
              <Hand size={14} className="text-[var(--color-primary)]" aria-hidden="true" />
              <span className="text-sm font-medium text-[var(--color-text-main)]">
                탭하여 지도 사용
              </span>
            </div>

            {/* 보조 안내 */}
            <span className="text-[11px] text-[var(--color-text-muted)] text-center px-6 leading-relaxed">
              상세 지역의 날씨 정보를 확인할 수 있어요
            </span>
          </div>
        )}
      </div>

      {/* 날씨 팝업 — 지도 하단 */}
      {selectedCity && (() => {
        const dl = settings.defaultLocation;
        const currentCoords = mapClickedCoords ?? selectedCity.coords;
        const isDefault =
          dl?.cityId === selectedCity.id &&
          dl?.coords.lat === currentCoords.lat &&
          dl?.coords.lon === currentCoords.lon;

        return (
          <div className="neu-raised rounded-[var(--radius-card-sm)] mt-2 overflow-hidden">
            {/* 날씨 정보 영역 — 클릭 이벤트 없음 */}
            <div className="px-4 py-3 flex items-center gap-3">
              <MapPin
                size={14}
                className="text-[var(--color-primary)] shrink-0"
                aria-hidden="true"
              />
              <div className="flex flex-col flex-1">
                {addressLoading && (
                  <span className="text-sm font-semibold text-[var(--color-text-muted)]">
                    주소 확인 중...
                  </span>
                )}
                {!addressLoading && address && (
                  <span className="relative max-w-fit">
                    <span className="absolute -bottom-[-1px] left-0 w-full h-0.5 bg-[var(--color-primary)] rounded-full" />
                    <span className="text-sm font-semibold leading-tight text-[var(--color-primary)]">
                      {address}
                    </span>
                  </span>
                )}
                <span className="text-xs text-[var(--color-text-muted)] mt-0.5">
                  {pointWeather?.current.weather.description ?? "날씨 확인 중..."}
                </span>
              </div>
              <span
                className="text-lg text-[var(--color-text-main)] mb-auto"
                style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
              >
                {pointWeather != null ? `${pointWeather.current.temp}°` : "--°"}
              </span>
            </div>

            {/* 구분선 */}
            <div className="mx-4 h-px bg-[var(--color-border)]" />

            {/* 하단 액션 영역 */}
            <div className="flex items-center justify-between px-1">
              {/* 기본 위치 설정 */}
              <button
                onClick={() => {
                  if (isDefault) {
                    setDefaultLocation(null);
                  } else {
                    setDefaultLocation({
                      cityId: selectedCity.id,
                      coords: currentCoords,
                      name: address ?? selectedCity.name,
                      isMapSelection: isMapSelectionStore,
                    });
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2.5 active:opacity-70 transition-opacity cursor-pointer"
                aria-label={isDefault ? "기본 위치 해제" : "기본 위치로 설정"}
              >
                <Star
                  size={13}
                  className={isDefault ? "text-[var(--color-primary)]" : "text-[var(--color-text-muted)]"}
                  fill={isDefault ? "currentColor" : "none"}
                  aria-hidden="true"
                />
                <span className={`text-xs font-medium ${isDefault ? "text-[var(--color-primary)]" : "text-[var(--color-text-muted)]"}`}>
                  {isDefault ? "기본 위치로 설정됨" : "기본 위치로 설정"}
                </span>
              </button>

              {/* 오늘 날씨 확인 */}
              <button
                onClick={() => setActiveTab("today")}
                className="flex items-center gap-1.5 px-3 py-2.5 active:opacity-70 transition-opacity cursor-pointer"
                aria-label={`${selectedCity.name} 오늘 날씨 확인`}
              >
                <span className="text-xs font-medium text-[var(--color-primary)]">
                  오늘 날씨 확인
                </span>
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
