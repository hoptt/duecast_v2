"use client";

import { type KeyboardEvent } from "react";
import type { UserSettings, ThemeMode, RefreshInterval } from "@/lib/types";
import { Settings, ChevronRight } from "lucide-react";
import { useAppStore } from "@/lib/store";

// ── Toggle ─────────────────────────────────────────────────────────

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel: string;
}

function Toggle({ checked, onChange, ariaLabel }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className="relative w-[52px] h-7 rounded-full neu-pressed focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] shrink-0"
    >
      {/* 활성 트랙 틴트 */}
      <span
        className="absolute inset-0 rounded-full transition-opacity duration-300"
        style={{
          background: "var(--color-primary)",
          opacity: checked ? 0.22 : 0,
        }}
      />
      {/* 썸 */}
      <span
        className="absolute top-[3px] left-[3px] size-[22px] rounded-full neu-raised transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        style={{
          transform: checked ? "translateX(24px)" : "translateX(0px)",
          background: checked ? "var(--color-primary-soft)" : undefined,
        }}
      />
    </button>
  );
}

// ── SegmentedControl ───────────────────────────────────────────────

interface SegmentOption<T> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string | number> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}

function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  ariaLabel,
}: SegmentedControlProps<T>) {
  const activeIndex = options.findIndex((o) => o.value === value);
  const count = options.length;

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      onChange(options[(activeIndex + 1) % count].value);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      onChange(options[(activeIndex - 1 + count) % count].value);
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className="relative flex rounded-xl p-1 neu-pressed"
    >
      {/* 슬라이딩 배경 */}
      <span
        aria-hidden="true"
        className="absolute top-1 bottom-1 rounded-lg neu-flat pointer-events-none transition-transform duration-300 ease-[cubic-bezier(0.34,1.2,0.64,1)]"
        style={{
          width: `calc((100% - 8px) / ${count})`,
          left: "4px",
          transform: `translateX(calc(${activeIndex} * 100%))`,
        }}
      />
      {options.map((option, i) => (
        <button
          key={String(option.value)}
          role="radio"
          aria-checked={i === activeIndex}
          tabIndex={i === activeIndex ? 0 : -1}
          onClick={() => onChange(option.value)}
          className={[
            "relative z-10 px-3 py-2.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors duration-200",
            "focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-primary)]",
            `flex-1 text-center`,
            i === activeIndex
              ? "text-[var(--color-primary)]"
              : "text-[var(--color-text-muted)] hover:text-[var(--color-text-sub)]",
          ].join(" ")}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

// ── SectionCard ────────────────────────────────────────────────────

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
}

function SectionCard({ title, children }: SectionCardProps) {
  return (
    <div
      className="neu-raised p-4 mb-3"
    >
      <p className="text-xs font-semibold tracking-[0.08em] uppercase text-[var(--color-text-sub)] mb-3">
        {title}
      </p>
      {children}
    </div>
  );
}

// ── SettingsRow ────────────────────────────────────────────────────

interface SettingsRowProps {
  label: string;
  description?: string;
  isLast?: boolean;
  children: React.ReactNode;
}

function SettingsRow({ label, description, isLast = false, children }: SettingsRowProps) {
  return (
    <div
      className={[
        "flex items-center justify-between py-2.5 gap-3",
        !isLast ? "border-b border-[var(--color-divider)]" : "",
      ].join(" ")}
    >
      <div className="flex flex-col min-w-0">
        <span className="text-sm" style={{ color: "var(--color-text-main)" }}>
          {label}
        </span>
        {description && (
          <span className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
            {description}
          </span>
        )}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

// ── InfoRow ────────────────────────────────────────────────────────

interface InfoRowProps {
  label: string;
  value?: string;
  href?: string;
  isLast?: boolean;
}

function InfoRow({ label, value, href, isLast = false }: InfoRowProps) {
  const inner = (
    <div
      className={[
        "flex items-center justify-between py-2.5",
        !isLast ? "border-b border-[var(--color-divider)]" : "",
      ].join(" ")}
    >
      <span className="text-sm" style={{ color: "var(--color-text-main)" }}>
        {label}
      </span>
      <div className="flex items-center gap-1">
        {value && (
          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            {value}
          </span>
        )}
        {href && (
          <ChevronRight size={14} style={{ color: "var(--color-text-muted)" }} />
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:opacity-70 transition-opacity"
      >
        {inner}
      </a>
    );
  }
  return inner;
}

// ── SettingsTab (메인) ─────────────────────────────────────────────

const THEME_OPTIONS: SegmentOption<ThemeMode>[] = [
  { value: "light", label: "라이트" },
  { value: "dark",  label: "다크" },
];

const REFRESH_OPTIONS: SegmentOption<RefreshInterval>[] = [
  { value: 10, label: "10분" },
  { value: 30, label: "30분" },
  { value: 60, label: "1시간" },
];

export default function SettingsTab() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);

  function update<K extends keyof UserSettings>(key: K, value: UserSettings[K]) {
    updateSettings({ ...settings, [key]: value });
  }

  return (
    <div className="flex flex-col flex-1 px-4" style={{ paddingBottom: "calc(5rem + env(safe-area-inset-bottom, 0px))" }}>
      {/* 헤더 */}
      <header className="pt-4 pb-4">
        <h1 className="text-sm font-semibold text-[var(--color-text-main)] tracking-wide flex items-center gap-1.5">
          <Settings size={14} className="opacity-70" aria-hidden="true" />
          설정
        </h1>
      </header>

      {/* 섹션 1: 외관 */}
      <SectionCard title="외관">
        <SettingsRow label="테마 모드" isLast>
          <SegmentedControl
            options={THEME_OPTIONS}
            value={settings.themeMode}
            onChange={(v) => update("themeMode", v)}
            ariaLabel="테마 모드 선택"
          />
        </SettingsRow>
      </SectionCard>

      {/* 섹션 2: 데이터 */}
      <SectionCard title="데이터">
        <SettingsRow label="새로고침 간격" description="날씨 데이터 갱신 주기">
          <SegmentedControl
            options={REFRESH_OPTIONS}
            value={settings.refreshInterval}
            onChange={(v) => update("refreshInterval", v)}
            ariaLabel="새로고침 간격 선택"
          />
        </SettingsRow>
        <SettingsRow label="데이터 소스" isLast>
          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            OpenWeatherMap
          </span>
        </SettingsRow>
      </SectionCard>

      {/* 섹션 3: 앱 정보 */}
      <SectionCard title="앱 정보">
        <InfoRow label="버전" value="0.1.0" />
        <InfoRow label="데이터 제공" value="OpenWeatherMap API" />
        <InfoRow
          label="개인정보 처리방침"
          href="https://openweathermap.org/privacy-policy"
        />
        <InfoRow
          label="피드백 보내기"
          href="mailto:feedback@duecast.app"
          isLast
        />
      </SectionCard>
    </div>
  );
}
