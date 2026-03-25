import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

/**
 * 로컬 폰트 — public/assets/fonts/g_*.ttf
 * Light(300) · Medium(500) · Bold(700) 3종 로드
 * next/font/local 이 최적화(서브셋, preload, no FOUT) 처리
 */
const gFont = localFont({
  src: [
    { path: "../public/assets/fonts/g_Light.ttf",  weight: "300", style: "normal" },
    { path: "../public/assets/fonts/g_Medium.ttf", weight: "500", style: "normal" },
    { path: "../public/assets/fonts/g_Bold.ttf",   weight: "700", style: "normal" },
  ],
  variable: "--font-g",
  display: "swap",
  fallback: ["Apple SD Gothic Neo", "Malgun Gothic", "맑은 고딕", "sans-serif"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "듀캐스트",
  description: "접속 즉시 행동 가이드를 제공하는 한 눈 날씨 서비스",
  keywords: ["날씨", "옷차림", "우산", "미세먼지", "행동가이드"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef6fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1628" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${gFont.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* 테마 FOUC 방지: 첫 페인트 전에 localStorage에서 테마를 읽어 data-theme 설정 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var r=localStorage.getItem('duecast-settings');if(r){var p=JSON.parse(r);var m=p&&p.state&&p.state.settings&&p.state.settings.themeMode;if(m==='dark'||m==='light')document.documentElement.setAttribute('data-theme',m);}}catch(e){}}())`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
