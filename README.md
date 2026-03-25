# DueCast - 듀캐스트

> **Weather at a glance** — 접속 즉시 행동 가이드를 제공하는 한 눈 날씨 서비스

단순한 날씨 정보 표시를 넘어, **지금 바로 무엇을 해야 하는지**를 알려주는 날씨 앱입니다. 옷차림, 우산 필요 여부, 미세먼지 대응 등을 자연어 메시지로 즉시 안내합니다.

---

## 주요 기능

- **행동 가이드** — 기온·강수확률·대기질 기반의 옷차림/우산/미세먼지 가이드 카드
- **Atmospheric Window** — 날씨 상태에 따라 실시간으로 변하는 배경 그라데이션
- **6시간 예보 타임라인** — 드래그 스크롤 + 시간별 상세 바텀시트
- **일출/일몰 다이어그램** — SVG 반원형 시각화 + 낮 길이 표시
- **종합 날씨 평점** — 온도·습도·공기질·강수 4항목 5점 만점 스코어카드
- **야외활동 추천 타이밍** — 시간대별 점수 기반 TOP 3 추천
- **지도 기반 위치 탐색** — Leaflet 지도 + OpenStreetMap Nominatim 역지오코딩
- **다크/라이트 테마** — 시스템 설정 연동 + 수동 전환

---

## 기술 스택

| 분류       | 기술                                                 |
| ---------- | ---------------------------------------------------- |
| 프레임워크 | Next.js 16 (canary) + React 19                       |
| 언어       | TypeScript 5                                         |
| 스타일링   | TailwindCSS v4 (CSS-first, 설정 파일 불필요)         |
| 상태관리   | Zustand 5 (persist 미들웨어로 설정값 영속화)         |
| 지도       | Leaflet 1.9 + OpenStreetMap Nominatim                |
| 아이콘     | Lucide React                                         |
| 디자인     | 뉴모피즘(Neumorphism) 디자인 시스템                  |
| 외부 API   | OpenWeatherMap API (날씨 데이터, Sprint 3 연동 예정) |

---

## 프로젝트 구조

```
duecast_v2/
├── app/
│   ├── layout.tsx        # 루트 레이아웃 (로컬 폰트, 테마 FOUC 방지)
│   ├── page.tsx          # 메인 SPA (탭 네비게이션)
│   └── globals.css       # 디자인 시스템 (뉴모피즘, 날씨 배경, 애니메이션)
├── components/           # UI 컴포넌트
│   ├── SplashScreen.tsx
│   ├── WeatherMain.tsx
│   ├── ActionGuide.tsx
│   ├── HourlyTimeline.tsx
│   ├── SunriseSunsetCard.tsx
│   ├── WeatherScoreCard.tsx
│   ├── OutdoorTimingCard.tsx
│   ├── LocationTab.tsx
│   ├── LeafletMap.tsx
│   └── SettingsTab.tsx
├── lib/
│   ├── store.ts          # Zustand 스토어
│   ├── types.ts          # TypeScript 타입 정의
│   ├── weather-guide.ts  # 행동 가이드 로직
│   ├── outdoor-score.ts  # 야외활동 점수 계산
│   ├── geocoding.ts      # Nominatim 역지오코딩
│   ├── mock-cities.ts    # 임시 Mock 날씨 데이터 (6개 도시)
│   └── settings.ts       # 기본 설정값
└── hooks/
    └── useCurrentTime.ts # 현재 시각 훅 (1분 갱신)
```

---

## 개발 현황

- **Sprint 1** ✅ — 프로젝트 셋업, 디자인 시스템 구축
- **Sprint 2** ✅ — Mock 데이터 기반 전체 UI 구현
- **Sprint 3** (예정) — GPS 위치 연동 + OpenWeatherMap 실시간 API 연동
