import type { CurrentWeather, SunInfo } from "@/lib/types";
import { Droplets, Wind, Thermometer, Sunrise } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="neu-raised p-4 flex flex-col gap-1.5">
      <span className="leading-none" aria-hidden="true">
        {icon}
      </span>
      <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest mt-0.5">
        {label}
      </span>
      <span className="text-lg font-semibold text-[var(--color-text-main)] tabular-nums leading-tight">
        {value}
      </span>
    </div>
  );
}

function fmtTime(ts: number): string {
  const d = new Date(ts * 1000);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

interface WeatherStatCardsProps {
  weather: CurrentWeather;
  sun: SunInfo;
}

/**
 * WeatherStatCards — 서버 컴포넌트
 * 2×2 날씨 스탯 카드 그리드. 데스크탑 좌측 패널 하단 배치.
 * 습도 / 풍속 / 체감온도 / 일출·일몰
 */
export default function WeatherStatCards({ weather, sun }: WeatherStatCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3" aria-label="날씨 상세 정보">
      <StatCard icon={<Droplets size={24} className="text-blue-400" />}      label="습도"     value={`${weather.humidity}%`} />
      <StatCard icon={<Wind size={24} className="text-slate-300" />}         label="풍속"     value={`${weather.windSpeed} m/s`} />
      <StatCard icon={<Thermometer size={24} className="text-red-400" />}    label="체감온도"  value={`${weather.feelsLike}°`} />
      <StatCard icon={<Sunrise size={24} className="text-amber-400" />}      label="일출·일몰" value={`${fmtTime(sun.sunrise)} / ${fmtTime(sun.sunset)}`} />
    </div>
  );
}
