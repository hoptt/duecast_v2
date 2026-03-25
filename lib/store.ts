import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TabId, Coordinates, LocationSearchResult, UserSettings, DefaultLocationData } from "@/lib/types";
import { DEFAULT_SETTINGS, applyTheme } from "@/lib/settings";
import { MOCK_CITIES, DEFAULT_CITY_ID } from "@/lib/mock-cities";

interface AppState {
  // ── Navigation ──
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;

  // ── Location ──
  selectedCityId: string;
  locationOverride: { name: string; coords: Coordinates } | null;
  mapActivated: boolean;
  mapClickedCoords: { lat: number; lon: number } | null;

  isMapSelection: boolean;
  mapFlyTarget: { lat: number; lon: number } | null;

  selectCity: (cityId: string) => void;
  selectDistrict: (result: LocationSearchResult) => void;
  selectMapLocation: (cityId: string, coords: { lat: number; lon: number }, name: string) => void;
  setLocationOverride: (override: { name: string; coords: Coordinates } | null) => void;
  activateMap: () => void;
  clearMapFlyTarget: () => void;

  // ── Hydration ──
  isHydrated: boolean;

  // ── Settings (persisted) ──
  settings: UserSettings;
  updateSettings: (newSettings: UserSettings) => void;
  setDefaultLocation: (data: DefaultLocationData | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Navigation
      activeTab: "today",
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Location
      selectedCityId: DEFAULT_CITY_ID,
      locationOverride: (() => {
        const city = MOCK_CITIES.find((c) => c.id === DEFAULT_CITY_ID);
        return city ? { name: city.address, coords: city.coords } : null;
      })(),
      isMapSelection: false,
      mapActivated: false,
      mapClickedCoords: null,
      mapFlyTarget: null,

      selectCity: (cityId) => {
        const city = MOCK_CITIES.find((c) => c.id === cityId);
        set({
          selectedCityId: cityId,
          locationOverride: city ? { name: city.address, coords: city.coords } : null,
          isMapSelection: false,
          mapClickedCoords: null,
          mapFlyTarget: city ? { lat: city.coords.lat, lon: city.coords.lon } : null,
        });
      },

      selectDistrict: (result) =>
        set({
          selectedCityId: result.parentCity,
          locationOverride: { name: result.fullName, coords: result.coords },
          isMapSelection: false,
          mapClickedCoords: null,
          activeTab: "today",
        }),

      selectMapLocation: (cityId, coords, name) =>
        set({
          selectedCityId: cityId,
          locationOverride: { name, coords },
          isMapSelection: true,
          mapClickedCoords: coords,
        }),

      setLocationOverride: (override) =>
        set({ locationOverride: override }),

      activateMap: () => set({ mapActivated: true }),
      clearMapFlyTarget: () => set({ mapFlyTarget: null }),

      // Hydration
      isHydrated: false,

      // Settings
      settings: DEFAULT_SETTINGS,
      updateSettings: (newSettings) => {
        applyTheme(newSettings.themeMode);
        set({ settings: newSettings });
      },
      setDefaultLocation: (data) =>
        set((state) => ({
          settings: { ...state.settings, defaultLocation: data },
        })),
    }),
    {
      name: "duecast-settings",
      partialize: (state) => ({ settings: state.settings }),
      merge: (persisted, current) => ({
        ...(current as AppState),
        settings: {
          ...(current as AppState).settings,
          ...((persisted as { settings?: Partial<UserSettings> })?.settings ?? {}),
        },
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        applyTheme(state.settings.themeMode);
        const dl = state.settings.defaultLocation;
        if (dl) {
          state.selectedCityId = dl.cityId;
          state.locationOverride = { name: dl.name, coords: dl.coords };
          state.isMapSelection = dl.isMapSelection;
          state.mapClickedCoords = dl.isMapSelection ? dl.coords : null;
        }
        state.isHydrated = true;
      },
    }
  )
);

// ── 파생 데이터 훅 ──

export function useWeatherData() {
  const selectedCityId = useAppStore((s) => s.selectedCityId);
  return (
    MOCK_CITIES.find((c) => c.id === selectedCityId)?.weather ?? MOCK_CITIES[0].weather
  );
}

export function useDisplayLocation() {
  const locationOverride = useAppStore((s) => s.locationOverride);
  const weather = useWeatherData();
  if (locationOverride) return { name: locationOverride.name, country: "KR" };
  return weather.location;
}
