@AGENTS.md

# Flutter 앱 껍데기 참조

이 프로젝트(Next.js)는 Flutter WebView 내부에서 동작하는 웹 콘텐츠 영역입니다.
Flutter 앱 껍데기 프로젝트는 `O:/duecast_v2_flutter`에 위치합니다.

- **현재 프로젝트** (`O:/duecast_v2`): WebView 안에 표시되는 웹 콘텐츠 (Next.js)
- **Flutter 프로젝트** (`O:/duecast_v2_flutter`): 앱 껍데기 (WebView, 네이티브 기능)

기능 구현 시 (특히 브릿지, 네이티브 연동 등) 반드시 `O:/duecast_v2_flutter` 프로젝트를 함께 참고하여 양쪽 인터페이스가 일치하도록 작업할 것.
