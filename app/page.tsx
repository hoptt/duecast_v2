"use client";

import type { TabId } from "@/lib/types";
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
import { useState } from "react";
import { useAppStore, useWeatherData, useDisplayLocation } from "@/lib/store";

type NavTab = { id: TabId; label: string; icon: React.ReactNode; disabled: boolean };

const NAV_TABS: NavTab[] = [
  { id: "today",    label: "오늘", icon: <HomeIcon size={20} />, disabled: false },
  { id: "weekly",   label: "주간", icon: <Calendar size={20} />, disabled: true  },
  { id: "location", label: "위치", icon: <MapPin size={20} />,   disabled: false },
  { id: "settings", label: "설정", icon: <Settings size={20} />, disabled: false },
];

// Sprint 3: useGeolocation + useWeather 훅으로 교체 예정

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
  const setActiveTab = useAppStore((s) => s.setActiveTab);
  const isHydrated = useAppStore((s) => s.isHydrated);
  const [splashDone, setSplashDone] = useState(false);
  const weatherData = useWeatherData();
  const displayLocation = useDisplayLocation();

  const bgClass = WEATHER_BG[weatherData.current.weather.main] ?? "weather-bg-clear";

  return (
    <div className={`weather-bg ${bgClass} min-h-dvh relative w-full max-w-[480px] mx-auto`} data-weather={weatherData.current.weather.main.toLowerCase()}>

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
          "min-h-dvh",
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
          <>
            {/* 오늘 탭 */}
            {activeTab === "today" && (
              <div className="flex flex-col flex-1" style={{ paddingBottom: "calc(5rem + env(safe-area-inset-bottom, 0px))" }}>
                <div className="flex flex-col flex-1 gap-3">
                  <LocationHeader location={displayLocation} onLocationClick={() => setActiveTab("location")} />
                  <WeatherMain weather={weatherData.current} />
                  <ActionGuide guide={weatherData.guide} />
                  <HourlyTimeline forecast={weatherData.forecast} pm25={weatherData.airPollution.pm25} />
                  <div className="grid grid-cols-2 gap-3 px-4">
                    <SunriseSunsetCard sun={weatherData.sun} />
                    <WeatherScoreCard
                      temp={weatherData.current.temp}
                      humidity={weatherData.current.humidity}
                      pm25={weatherData.airPollution.pm25}
                      maxPop={Math.max(...weatherData.forecast.slice(0, 8).map((f) => f.pop))}
                    />
                  </div>
                  <div className="px-4">
                    <OutdoorTimingCard
                      forecast={weatherData.forecast}
                      pm25={weatherData.airPollution.pm25}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 위치 탭 */}
            {activeTab === "location" && <LocationTab />}

            {/* 설정 탭 */}
            {activeTab === "settings" && <SettingsTab />}
          </>
        )}

        {/* 하단 탭 바 — 스플래시 종료 후 노출 */}
        {splashDone && <nav
          aria-label="하단 탭 내비게이션"
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 safe-bottom neu-raised rounded-none rounded-t-[var(--radius-card)]"
        >
          <div className="flex items-center justify-around h-14">
            {NAV_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { if (!tab.disabled) setActiveTab(tab.id); }}
                disabled={tab.disabled}
                aria-label={tab.label}
                aria-current={activeTab === tab.id ? "page" : undefined}
                className={[
                  "flex flex-col items-center justify-center gap-0.5 flex-1 h-full min-h-11 min-w-11 rounded-xl focus-visible:outline-none",
                  "transition-[color,box-shadow,background] duration-150",
                  "disabled:opacity-40 disabled:cursor-not-allowed",
                  activeTab === tab.id ? "neu-pressed" : "",
                ].join(" ")}
                style={{
                  color: activeTab === tab.id
                    ? "var(--color-primary)"
                    : "var(--nav-tab-inactive)",
                  appearance: "none",
                  WebkitAppearance: "none",
                  outline: "none",
                  WebkitTapHighlightColor: "transparent",
                  border: "1px solid transparent",
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
