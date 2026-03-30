import type { UserSettings, ThemeMode } from "@/lib/types";
import { notifyThemeChange } from "@/lib/bridge";

export const DEFAULT_SETTINGS: UserSettings = {
  themeMode: "dark",
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
  // Flutter WebView에 테마 변경 알림 (상태바 아이콘/배경색 동기화)
  notifyThemeChange(mode);
}
