/**
 * DueCast Flutter ↔ Next.js JS 브릿지
 *
 * Flutter WebView 환경에서만 활성화되는 네이티브 기능 API.
 * 브라우저 환경에서는 각 함수가 자연스럽게 폴백 처리됨.
 *
 * 메시지 프로토콜 (JSON envelope):
 *   JS → Flutter: { type, id, payload }
 *   Flutter → JS: { type, id, payload }  (callHandler의 return value)
 */

declare global {
  interface Window {
    flutter_inappwebview?: {
      callHandler(name: string, ...args: unknown[]): Promise<unknown>;
    };
  }
}

const BRIDGE_HANDLER = "duecast_bridge";
const GPS_TIMEOUT_MS = 10_000;

// ── 환경 감지 ────────────────────────────────────────────────────────────────

/** Flutter WebView 환경 여부 확인 */
export function isFlutterWebView(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.flutter_inappwebview !== "undefined"
  );
}

// ── 메시지 전송 헬퍼 ─────────────────────────────────────────────────────────

interface BridgeMessage {
  type: string;
  id: string;
  payload?: Record<string, unknown>;
}

interface BridgeResponse {
  type: string;
  id: string;
  payload?: Record<string, unknown>;
}

/**
 * Flutter 핸들러에 메시지를 전송하고 응답을 기다림.
 * flutter_inappwebview.callHandler는 Dart 핸들러의 return value를 그대로 반환.
 */
async function sendMessage(message: BridgeMessage): Promise<BridgeResponse> {
  if (!isFlutterWebView()) {
    throw new Error("Flutter WebView 환경이 아닙니다.");
  }

  const response = await window.flutter_inappwebview!.callHandler(
    BRIDGE_HANDLER,
    JSON.stringify(message)
  );

  return response as BridgeResponse;
}

/** UUID v4 간이 생성 (crypto.randomUUID 미지원 환경 폴백 포함) */
function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ── GPS ─────────────────────────────────────────────────────────────────────

export interface NativeCoordinates {
  lat: number;
  lon: number;
}

export interface GpsError {
  code: "PERMISSION_DENIED" | "PERMISSION_DENIED_FOREVER" | "SERVICE_DISABLED" | "UNKNOWN" | "TIMEOUT";
  message: string;
}

/**
 * 네이티브 GPS 좌표 요청.
 *
 * Flutter의 geolocator 패키지를 통해 고정밀 좌표를 반환.
 * 권한 거부 또는 타임아웃 시 GpsError를 throw → 호출 측에서 서울 폴백 처리.
 */
export async function requestNativeGPS(): Promise<NativeCoordinates> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(
      () => reject({ code: "TIMEOUT", message: "GPS 요청이 시간 초과되었습니다." } as GpsError),
      GPS_TIMEOUT_MS
    )
  );

  const gpsPromise = sendMessage({
    type: "gps:request",
    id: generateId(),
  }).then((response) => {
    if (response.type === "gps:error") {
      throw response.payload as unknown as GpsError;
    }
    const { lat, lon } = response.payload as { lat: number; lon: number };
    return { lat, lon };
  });

  return Promise.race([gpsPromise, timeoutPromise]);
}

// ── 테마 변경 알림 ───────────────────────────────────────────────────────────

/**
 * 앱 테마 변경을 Flutter에 알림.
 *
 * 호출 시 Flutter의 상태바 아이콘 밝기와 배경색이 즉시 업데이트됨.
 * Flutter 환경이 아니면 no-op.
 */
export function notifyThemeChange(mode: "dark" | "light" | "auto"): void {
  if (!isFlutterWebView()) return;

  window.flutter_inappwebview!.callHandler(
    BRIDGE_HANDLER,
    JSON.stringify({
      type: "theme:changed",
      id: generateId(),
      payload: { mode },
    })
  ).catch(() => {});
}

// ── 햅틱 피드백 ──────────────────────────────────────────────────────────────

export type HapticIntensity = "light" | "medium" | "heavy";

/**
 * 네이티브 햅틱 피드백 실행.
 *
 * Flutter 환경이 아니면 no-op. 탭 전환, 버튼 클릭 등에 사용.
 */
export function triggerHaptic(intensity: HapticIntensity = "light"): void {
  if (!isFlutterWebView()) return;

  // fire-and-forget — 응답 대기 불필요
  window.flutter_inappwebview!.callHandler(
    BRIDGE_HANDLER,
    JSON.stringify({
      type: "haptic:tap",
      id: generateId(),
      payload: { intensity },
    })
  ).catch(() => {
    // 햅틱 실패는 무시
  });
}
