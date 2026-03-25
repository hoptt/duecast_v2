import type { UserSettings, ThemeMode } from "@/lib/types";

export const DEFAULT_SETTINGS: UserSettings = {
  themeMode: "light",
  temperatureUnit: "celsius",
  windSpeedUnit: "ms",
  showFeelsLike: true,
  precipitationThreshold: 40,
  refreshInterval: 30,
  defaultLocation: null,
};

export function applyTheme(mode: ThemeMode): void {
  const root = document.documentElement;
  if (mode === "auto") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", mode);
  }
}
