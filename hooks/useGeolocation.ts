"use client";

import { useState, useEffect } from "react";
import type { Coordinates } from "@/lib/types";
import { isFlutterWebView, requestNativeGPS } from "@/lib/bridge";

const SEOUL_FALLBACK: Coordinates = { lat: 37.5665, lon: 126.9780 };

// 모듈 레벨 캐시 - 컴포넌트 언마운트/재마운트 간 유지
let cachedCoords: Coordinates | null = null;

interface UseGeolocationReturn {
  coords: Coordinates | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation(): UseGeolocationReturn {
  const [coords, setCoords] = useState<Coordinates | null>(cachedCoords);
  const [loading, setLoading] = useState(cachedCoords === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedCoords !== null) return;

    // Flutter WebView 환경: 네이티브 GPS 브릿지 사용
    if (isFlutterWebView()) {
      requestNativeGPS()
        .then((coords) => {
          cachedCoords = coords;
          setCoords(coords);
          setLoading(false);
        })
        .catch(() => {
          // 권한 거부 등 — 서울 폴백
          cachedCoords = SEOUL_FALLBACK;
          setCoords(SEOUL_FALLBACK);
          setError("위치 권한이 거부되어 서울로 표시됩니다.");
          setLoading(false);
        });
      return;
    }

    // 브라우저 환경: 기존 Web Geolocation API 사용
    if (!navigator.geolocation) {
      cachedCoords = SEOUL_FALLBACK;
      setCoords(SEOUL_FALLBACK);
      setError("이 브라우저에서 위치 서비스를 사용할 수 없어 서울로 표시됩니다.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCoords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        cachedCoords = newCoords;
        setCoords(newCoords);
        setLoading(false);
      },
      (err) => {
        // 권한 거부(1) 또는 위치 획득 실패(2, 3) → 서울 폴백
        const message =
          err.code === 1
            ? "위치 권한이 거부되어 서울로 표시됩니다."
            : "위치를 가져올 수 없어 서울로 표시됩니다.";
        cachedCoords = SEOUL_FALLBACK;
        setCoords(SEOUL_FALLBACK);
        setError(message);
        setLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 300_000, // 5분간 캐시
      }
    );
  }, []); // 마운트 시 1회만 실행

  return { coords, loading, error };
}
