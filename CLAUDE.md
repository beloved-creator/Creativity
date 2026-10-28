# CLAUDE.md — 프로젝트 규칙

심리학과 교수 개인 연구 웹사이트. 사용자는 코딩 비전문가이므로 설명·주석은 한국어로, 사용자가 직접 고칠 데이터 파일 위주로 친절하게 쓴다. 작업 전 짧은 한국어 계획을 보여주고, 터미널 명령 실행 시 무엇을 하는지 한 줄 설명한다.

## 기술 스택
- Vite 8 + React 19 + TypeScript (`tsc -b` 로 타입 검사)
- Tailwind CSS v4 (`@tailwindcss/vite`, 토큰은 `src/index.css` 의 `@theme`: `brand-*` 남색 계열)
- React Router v8 (`react-router` 패키지, `BrowserRouter` + `Routes`)
- Lint: oxlint (`npm run lint`, 설정 `.oxlintrc.json`) — 경고 0개 유지
- Node 24 LTS (`.nvmrc`, `netlify.toml`), npm
- 폰트: Pretendard (jsDelivr CDN, `index.html`)
- 배포: GitHub → Netlify 자동 배포 (`netlify.toml`, SPA 리다이렉트 `/* → /index.html 200`)

## 폴더 구조
```
src/types/        타입 정의. 모든 엔티티에 문자열 id (Firestore 문서 ID 예정)
src/data/         콘텐츠 (profile, publications, projects, news) — 사용자가 직접 편집
src/services/     dataService.ts — 유일한 데이터 접근 계층
src/hooks/        useAsyncData(로딩/오류/재시도), usePageMeta(title/description)
src/components/   공통 UI (Layout, Header, AsyncBoundary, PublicationItem 등)
src/pages/        라우트 페이지 (Home, Publications, Projects, Contact, NotFound)
src/pages/admin/  (다음 단계) 관리자 페이지
src/utils/        apa.ts(APA 7 서식), clipboard.ts, format.ts(라벨·날짜·탭 구성)
src/lib/          (다음 단계) firebase.ts, auth.ts
src/siteConfig.ts 사이트 이름·기본 description (정적 설정)
public/papers/    PDF (/papers/파일명.pdf), public/images/ 사진
```

## 핵심 규칙
- **화면(pages/components)은 `src/data/` 를 직접 import 하지 않는다. 반드시 `src/services/dataService.ts` 의 비동기 함수(`getProfile`, `getPublications`, `getFeaturedPublications`, `getProjects`, `getNews`)만 사용한다.**
- dataService 함수의 이름·시그니처(`Promise<T>`)는 유지한다. Firestore 전환 시 함수 내부만 바꾼다.
- dataService 는 결과를 메모리 캐시(`cached()`)한다 — 페이지 이동 시 반복 조회 금지. 컬렉션은 통째로 1회 읽고 클라이언트에서 필터/정렬한다.
- 데이터 로딩은 `useAsyncData(loader)` + `<AsyncBoundary>` 로 로딩/오류/재시도 UI를 처리한다. loader 는 모듈 최상위에 정의(렌더마다 새 함수 금지 — 무한 조회 방지).
- APA 서식은 `src/utils/apa.ts` 의 `formatApa()` 만 사용 (segment 배열 → 화면/복사 텍스트/HTML). 저자 표기는 데이터에 APA 형식 그대로 저장, 본인 이름 굵게는 `profile.authorNames` 로 매칭. 한글 저자 목록은 `&` 없이 쉼표 나열.
- 연구 업적 페이지 필터 상태(tab, q, year)는 URL 쿼리에 저장.
- 접근성: 시맨틱 태그, alt/aria-label, 키보드 조작(탭 ←/→), focus-visible, 충분한 명암비. `lang="ko"`. 페이지마다 `usePageMeta`.
- 범위 밖 기능(문의 폼, 방문자 통계, 댓글 등)은 만들지 않는다.
- 완료 전 `npm run build` 와 `npm run lint` 통과 확인.

## Firebase Spark(무료) 요금제 제약 — 항상 지킬 것
- 사용 가능: Cloud Firestore, Firebase Authentication(Google 로그인)
- 사용 금지: Cloud Storage(Blaze 필요), Cloud Functions, Firebase Extensions 등 Blaze 전용 기능
- 파일(PDF, 이미지)은 GitHub 저장소 `public/` 에서 관리. 관리자 화면은 경로 문자열만 저장.
- Firestore 무료 한도: 하루 읽기 5만 / 쓰기 2만 / 저장 1GiB → 캐시 유지, 실시간 리스너(onSnapshot) 남용 금지, 컬렉션은 방문당 1회 조회.
- 환경 변수는 `.env.local` (gitignore됨), 이름은 `.env.example` 참고. Netlify에는 Environment variables 로 등록.

## 다음 단계 계획
1. `firebase` 패키지 설치, `src/lib/firebase.ts` 초기화 (`VITE_FIREBASE_*`).
2. `dataService.ts` 내부를 Firestore 조회로 교체 (컬렉션: `profile/main`, `publications`, `projects`, `news`). 화면 코드는 변경 없음. `src/data/*` 내용을 Firestore로 옮기는 1회성 가져오기 기능 제공.
3. Google 로그인 (`src/lib/auth.ts`).
4. `/admin` 관리자 페이지 (`src/pages/admin/`): `VITE_ADMIN_EMAIL` 계정만 접근, 논문·프로젝트·소식·프로필 CRUD. 쓰기 후 dataService 캐시 무효화.
5. Firestore 보안 규칙: 읽기는 공개, 쓰기는 `request.auth.token.email == 관리자 이메일` 이고 `email_verified == true` 일 때만 허용. 화면에서 숨기는 것만으로는 보안이 아님.
6. Firebase Console → Authentication → Settings → 승인된 도메인에 Netlify 도메인(`xxx.netlify.app`, 커스텀 도메인) 추가.
