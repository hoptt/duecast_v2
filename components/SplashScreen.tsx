"use client";

import { useEffect, useRef, useState } from "react";
import { CloudSun } from "@/lib/weather-icons";

const MIN_DISPLAY_MS = 1200;

interface SplashScreenProps {
  isReady: boolean;
  onFinish: () => void;
}

export default function SplashScreen({ isReady, onFinish }: SplashScreenProps) {
  const [fadingOut, setFadingOut] = useState(false);
  const minTimerDoneRef = useRef(false);
  const isReadyRef = useRef(isReady);
  isReadyRef.current = isReady;

  useEffect(() => {
    const timer = setTimeout(() => {
      minTimerDoneRef.current = true;
      if (isReadyRef.current) triggerFadeOut();
    }, MIN_DISPLAY_MS);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isReady && minTimerDoneRef.current) {
      triggerFadeOut();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  function triggerFadeOut() {
    setFadingOut(true);
    setTimeout(onFinish, 300);
  }

  return (
    <div
      className={`fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 flex flex-col items-center justify-center gap-5 ${fadingOut ? "animate-splash-out" : ""}`}
      style={{ background: "var(--color-surface)" }}
    >
      {/* 아이콘 */}
      <div className="animate-fade-up animation-delay-100">
        <CloudSun
          size={56}
          className="text-[var(--color-primary)] animate-float"
          aria-hidden="true"
        />
      </div>

      {/* 앱 이름 */}
      <div className="flex flex-col items-center gap-1 animate-fade-up animation-delay-200">
        <span
          className="text-2xl text-[var(--color-text-main)] tracking-tight"
          style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
        >
          듀캐스트
        </span>
        <span className="text-xs text-[var(--color-text-muted)] tracking-widest uppercase">
          Weather at a glance
        </span>
      </div>

      {/* 로딩 인디케이터 */}
      <div className="flex items-center gap-1.5 animate-fade-up animation-delay-400">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="block w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] opacity-40 animate-pulse"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
