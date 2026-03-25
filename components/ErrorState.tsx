"use client";

import { Cloud } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

/**
 * ErrorState — 클라이언트 컴포넌트
 * "Clear Sky Apology" 컨셉 — 구름이 잠깐 지나가는 감성.
 * 겁주지 않는 부드러운 한국어 에러 메시지, float 구름, 감성적 재시도 버튼.
 */
export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="weather-bg weather-bg-clear min-h-dvh flex flex-col items-center justify-center px-6">

      {/* 중앙 에러 카드 */}
      <div className="neu-raised-lg w-full max-w-sm p-8 flex flex-col items-center text-center">

        {/* 부유하는 구름 아이콘 */}
        <div className="mb-6 animate-float" aria-hidden="true">
          <Cloud size={64} className="text-slate-400" />
        </div>

        {/* 에러 메시지 */}
        <p className="text-[var(--color-text-main)] text-lg font-medium leading-relaxed mb-2">
          {message}
        </p>

        {/* 보조 안내 문구 */}
        <p className="text-[var(--color-text-sub)] text-sm leading-relaxed mb-6">
          잠시 후 다시 시도하거나,{" "}
          <br className="hidden sm:block" />
          네트워크 상태를 확인해 주세요.
        </p>

        {/* 재시도 버튼 — onRetry 있을 때만 */}
        {onRetry && (
          <button
            onClick={onRetry}
            className={[
              "w-full py-3.5 px-6 rounded-[var(--radius-pill)]",
              "bg-[var(--color-primary)] text-white",
              "text-sm font-semibold tracking-wide",
              "transition-all duration-200",
              "hover:opacity-90 hover:scale-[1.02]",
              "active:scale-[0.98]",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2",
            ].join(" ")}
          >
            다시 시도
          </button>
        )}

        {/* 서비스명 워터마크 */}
        <p className="text-[var(--color-text-muted)] text-xs mt-6 tracking-widest uppercase">
          듀캐스트
        </p>

      </div>

      {/* 하단 장식 — 미묘한 파동 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none bg-gradient-to-t from-[var(--overlay-hover)] to-transparent"
        aria-hidden="true"
      />

    </div>
  );
}
