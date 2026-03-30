"use client";

import type { TabId } from "@/lib/types";
import { currentWeatherToPop } from "@/lib/seasonal-score";
import { Home as HomeIcon, Calendar, MapPin, Settings } from "lucide-react";
import SplashScreen from "@/components/SplashScreen";
import LocationHeader from "@/components/LocationHeader";
import WeatherMain from "@/components/WeatherMain";
import ActionGuide from "@/components/ActionGuide";
import HourlyTimeline from "@/components/HourlyTimeline";
import SunriseSunsetCard from "@/components/SunriseSunsetCard";
import WeatherScoreCard from "@/components/WeatherScoreCard";
import OutdoorTimingCard from "@/components/OutdoorTimingCard";
import LocationTab from "@/components/LocationTab";
import SettingsTab from "@/components/SettingsTab";
import { useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { tabSlideVariants, reducedMotionVariants, initialLoadVariants, GPU_STYLE, getSlideDirection } from "@/lib/motion";
import { useAppStore, useSelectedCoords, useSelectedCityId } from "@/lib/store";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useWeather } from "@/hooks/useWeather";
import { useCityWeathers } from "@/hooks/useCityWeathers";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ErrorState from "@/components/ErrorState";

type NavTab = { id: TabId; label: string; icon: React.ReactNode; disabled: boolean };

const NAV_TABS: NavTab[] = [
  { id: "today",    label: "오늘", icon: <HomeIcon size={20} />, disabled: false },
  { id: "weekly",   label: "주간", icon: <Calendar size={20} />, disabled: true  },
  { id: "location", label: "위치", icon: <MapPin size={20} />,   disabled: false },
  { id: "settings", label: "설정", icon: <Settings size={20} />, disabled: false },
];

const WEATHER_BG: Record<string, string> = {
  Clear:        "weather-bg-clear",
  Clouds:       "weather-bg-clouds",
  Rain:         "weather-bg-rain",
  Drizzle:      "weather-bg-rain",
  Thunderstorm: "weather-bg-thunder",
  Snow:         "weather-bg-snow",
  Mist:         "weather-bg-mist",
  Fog:          "weather-bg-mist",
  Haze:         "weather-bg-mist",
  Dust:         "weather-bg-mist",
  Sand:         "weather-bg-mist",
};

/** grain overlay SVG data URI */
const GRAIN_BG =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")";

export default function Home() {
  const activeTab = useAppStore((s) => s.activeTab);
  const previousTab = useAppStore((s) => s.previousTab);
  const setActiveTab = useAppStore((s) => s.setActiveTab);
  const shouldReduceMotion = useReducedMotion();
  const direction = getSlideDirection(previousTab, activeTab);
  const isInitialLoad = previousTab === activeTab;
  const slideVariants = shouldReduceMotion
    ? reducedMotionVariants
    : isInitialLoad
      ? initialLoadVariants
      : tabSlideVariants;
  const isHydrated = useAppStore((s) => s.isHydrated);
  const refreshInterval = useAppStore((s) => s.settings.refreshInterval);
  const locationOverride = useAppStore((s) => s.locationOverride);
  const [splashDone, setSplashDone] = useState(false);

  // 위치: 스토어 선택 좌표 우선, 없으면 브라우저 Geolocation
  const storeCoords = useSelectedCoords();
  const cityId = useSelectedCityId();
  const { coords: geoCoords } = useGeolocation();
  const coords = storeCoords ?? geoCoords;

  // 스플래시 중 도시 날씨 캐시 워밍
  useCityWeathers();

  // 날씨 데이터 (API)
  const { data: weatherData, loading: weatherLoading, error: weatherError, refetch } =
    useWeather(coords, cityId, refreshInterval);

  // 표시 위치명: locationOverride → API location → 기본값
  const displayLocation = locationOverride
    ? { name: locationOverride.name, country: "KR" }
    : weatherData?.location ?? { name: "서울특별시", country: "KR" };

  const bgClass = WEATHER_BG[weatherData?.current.weather.main ?? ""] ?? "weather-bg-clear";
  const bgRef = useRef(bgClass);
  if (weatherData) bgRef.current = bgClass;
  const safeBgClass = bgRef.current;

  return (
    <div className={`weather-bg ${safeBgClass} min-h-dvh relative w-full max-w-[480px] mx-auto`} data-weather={(weatherData?.current.weather.main ?? "clear").toLowerCase()}>

      {/* 대기 grain 오버레이 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: GRAIN_BG,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
          opacity: 0.15,
        }}
      />

      <main
        className={[
          "relative z-10 flex flex-col flex-1",
          "w-full",
          "h-dvh overflow-hidden",
        ].join(" ")}
      >
        {/* 스플래시 화면 */}
        {!splashDone && (
          <SplashScreen
            isReady={isHydrated}
            onFinish={() => setSplashDone(true)}
          />
        )}

        {/* 탭 컨텐츠 — 스플래시 종료 후 렌더 */}
        {splashDone && (
          <AnimatePresence mode="wait" custom={direction}>
            {/* 오늘 탭 */}
            {activeTab === "today" && (
              <motion.div
                key="today"
                custom={direction}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={GPU_STYLE}
                className="flex flex-col h-dvh overflow-y-auto"
              >
                {/* 로딩 중 (데이터 없음) */}
                {weatherLoading && !weatherData && <LoadingSkeleton />}

                {/* 에러 (데이터 없음) */}
                {weatherError && !weatherData && (
                  <ErrorState message={weatherError} onRetry={refetch} />
                )}

                {/* 날씨 데이터 표시 */}
                {weatherData && (
                  <div className="flex flex-col flex-1" style={{ paddingBottom: "calc(5.5rem + env(safe-area-inset-bottom, 0px))" }}>
                    <div className="flex flex-col flex-1 gap-3">
                      <LocationHeader
                        location={displayLocation}
                        observedAt={weatherData.current.observedAt}
                        timezoneOffset={weatherData.current.timezoneOffset}
                        onLocationClick={() => setActiveTab("location")}
                      />
                      <WeatherMain weather={weatherData.current} />
                      <ActionGuide guide={weatherData.guide} />
                      <div className="grid grid-cols-2 gap-3 px-4">
                        <SunriseSunsetCard sun={weatherData.sun} />
                        <WeatherScoreCard
                          temp={weatherData.current.temp}
                          feelsLike={weatherData.current.feelsLike}
                          humidity={weatherData.current.humidity}
                          pm25={weatherData.airPollution.pm25}
                          pm10={weatherData.airPollution.pm10}
                          maxPop={currentWeatherToPop(weatherData.current.weather.main)}
                          weatherDescription={weatherData.current.weather.description}
                        />
                      </div>
                      <HourlyTimeline forecast={weatherData.forecast} />
                      <div className="px-4">
                        <OutdoorTimingCard
                          forecast={weatherData.forecast}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* 위치 탭 */}
            {activeTab === "location" && (
              <motion.div
                key="location"
                custom={direction}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={GPU_STYLE}
                className="flex flex-col h-dvh overflow-y-auto"
              >
                <LocationTab />
              </motion.div>
            )}

            {/* 설정 탭 */}
            {activeTab === "settings" && (
              <motion.div
                key="settings"
                custom={direction}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={GPU_STYLE}
                className="flex flex-col h-dvh overflow-y-auto"
              >
                <SettingsTab />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* 하단 탭 바 — 스플래시 종료 후 노출 */}
        {splashDone && <nav
          aria-label="하단 탭 내비게이션"
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 safe-bottom bg-[var(--neu-bg)] rounded-t-xl rounded-b-none"
        >
          <div className="flex items-center justify-around h-18 px-4">
            {NAV_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { if (!tab.disabled) setActiveTab(tab.id); }}
                disabled={tab.disabled}
                aria-label={tab.label}
                aria-current={activeTab === tab.id ? "page" : undefined}
                className={[
                  "flex flex-col items-center justify-center gap-0.5 w-14 h-14 rounded-2xl focus-visible:outline-none",
                  "transition-[color,box-shadow,background] duration-150",
                  "disabled:opacity-40 disabled:cursor-not-allowed",
                  activeTab === tab.id ? "neu-pressed" : "neu-button",
                ].join(" ")}
                style={{
                  color: activeTab === tab.id
                    ? "var(--color-primary)"
                    : "var(--nav-tab-inactive)",
                  appearance: "none",
                  WebkitAppearance: "none",
                  outline: "none",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                <span className="leading-none">{tab.icon}</span>
                <span className="text-[10px] font-medium leading-none tracking-wide">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </nav>}
      </main>
    </div>
  );
}
