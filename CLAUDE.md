# CLAUDE.md — 프로젝트 규칙

심리학과 교수 개인 연구 웹사이트. 사용자는 코딩 비전문가이므로 설명·주석은 한국어로, 사용자가 직접 고칠 데이터 파일 위주로 친절하게 쓴다. 작업 전 짧은 한국어 계획을 보여주고, 터미널 명령 실행 시 무엇을 하는지 한 줄 설명한다.

## 기술 스택
- Vite 8 + React 19 + TypeScript (`tsc -b` 로 타입 검사)
- Tailwind CSS v4 (`@tailwindcss/vite`, 토큰은 `src/index.css` 의 `@theme`: `brand-*` 남색, `accent-*` 보라 계열)
- 디자인 톤: 화려한 남색→보라 그라데이션. 공용 유틸 `bg-hero`(그라데이션 배경), `text-gradient`, `bg-dots`, 애니메이션 `animate-fade-up`·`animate-float` (`prefers-reduced-motion` 시 꺼짐). 흰 글자는 `bg-hero` 위에만 사용해 명암비 유지
- React Router v8 (`react-router` 패키지, `BrowserRouter` + `Routes`)
- Lint: oxlint (`npm run lint`, 설정 `.oxlintrc.json`) — 경고 0개 유지
- Node 24 LTS (`.nvmrc`, `netlify.toml`), npm
- Firebase JS SDK: `firebase/firestore/lite` (실시간 기능 없는 경량판 — onSnapshot 불필요), `firebase/auth` (Google 로그인, 관리자 페이지에서만 lazy 로드)
- 폰트: Pretendard (jsDelivr CDN, `index.html`)
- 배포: GitHub → Netlify 자동 배포 (`netlify.toml`, SPA 리다이렉트 `/* → /index.html 200`)

## 폴더 구조
```
src/types/        타입 정의. 모든 엔티티에 문자열 id (Firestore 문서 ID 예정)
src/data/         초기 데이터·백업 (profile, publications, projects, news, posts — Firestore 가져오기 원본, Firebase 미설정 시 사용)
src/services/     dataService.ts — 유일한 데이터 접근 계층 (읽기 + 관리자 쓰기)
src/hooks/        useAsyncData(로딩/오류/재시도), usePageMeta(title/description)
src/components/   공통 UI (Layout, Header, AsyncBoundary, PublicationItem 등)
src/pages/        라우트 페이지 (Home, Publications, Projects, Board(/board), Post(/board/:postId), Contact, NotFound)
src/pages/admin/  관리자 페이지 /admin (AdminPage, CollectionEditor, EntityForm, fields.ts 폼 정의)
src/utils/        apa.ts(APA 7 서식), clipboard.ts, format.ts(라벨·날짜·탭 구성)
src/lib/          firebase.ts(초기화·isFirebaseConfigured), auth.ts(Google 로그인·isAdmin)
src/siteConfig.ts 사이트 이름·기본 description (정적 설정)
public/papers/    PDF (/papers/파일명.pdf), public/images/ 사진
firestore.rules   보안 규칙 (콘솔에 붙여 넣음. 관리자 이메일 자리는 'admin@example.com' 플레이스홀더)
```

## 핵심 규칙
- **화면(pages/components)은 `src/data/` 나 Firestore를 직접 다루지 않는다. 반드시 `src/services/dataService.ts` 의 함수만 사용한다.** 읽기: `getProfile`, `getPublications`, `getFeaturedPublications`, `getProjects`, `getNews`, `getPosts`, `getPost`. 쓰기(관리자): `saveProfile`, `savePublication`/`deletePublication`, `saveProject`/`deleteProject`, `saveNews`/`deleteNews`, `savePost`/`deletePost`, `importLocalData`.
- dataService 함수의 이름·시그니처(`Promise<T>`)는 유지한다.
- Firestore 구조: `profile/main` 문서 1개, `publications`·`projects`·`news`·`posts` 컬렉션. 문서 ID = 엔티티 `id` (문서 본문에는 id 저장 안 함). 빈 선택 항목은 `ignoreUndefinedProperties` 로 저장 생략.
- 환경 변수가 없으면(`isUsingFirestore === false`) `src/data` 로 동작하고 쓰기 함수는 오류를 던진다.
- 쓰기 후에는 해당 캐시 키를 비운다 (`cache.delete`).
- dataService 는 결과를 메모리 캐시(`cached()`)한다 — 페이지 이동 시 반복 조회 금지. 컬렉션은 통째로 1회 읽고 클라이언트에서 필터/정렬한다.
- 데이터 로딩은 `useAsyncData(loader)` + `<AsyncBoundary>` 로 로딩/오류/재시도 UI를 처리한다. loader 는 모듈 최상위에 정의(렌더마다 새 함수 금지 — 무한 조회 방지).
- APA 서식은 `src/utils/apa.ts` 의 `formatApa()` 만 사용 (segment 배열 → 화면/복사 텍스트/HTML). 저자 표기는 데이터에 APA 형식 그대로 저장, 본인 이름 굵게는 `profile.authorNames` 로 매칭. 한글 저자 목록은 `&` 없이 쉼표 나열.
- 연구 업적 페이지 필터 상태(tab, q, year)는 URL 쿼리에 저장.
- 접근성: 시맨틱 태그, alt/aria-label, 키보드 조작(탭 ←/→), focus-visible, 충분한 명암비. `lang="ko"`. 페이지마다 `usePageMeta`.
- 게시판(`/board`)은 **관리자만 쓰는 공지 게시판**이다 (사용자 결정). 방문자 글쓰기·댓글은 만들지 않는다.
- 범위 밖 기능(문의 폼, 방문자 통계, 댓글 등)은 만들지 않는다.
- 새 컬렉션을 추가하면 `firestore.rules` 에도 match 블록을 추가하고, 사용자에게 콘솔에서 규칙을 다시 게시하라고 안내한다.
- 완료 전 `npm run build` 와 `npm run lint` 통과 확인.

## Firebase Spark(무료) 요금제 제약 — 항상 지킬 것
- 사용 가능: Cloud Firestore, Firebase Authentication(Google 로그인)
- 사용 금지: Cloud Storage(Blaze 필요), Cloud Functions, Firebase Extensions 등 Blaze 전용 기능
- 파일(PDF, 이미지)은 GitHub 저장소 `public/` 에서 관리. 관리자 화면은 경로 문자열만 저장.
- Firestore 무료 한도: 하루 읽기 5만 / 쓰기 2만 / 저장 1GiB → 캐시 유지, 실시간 리스너(onSnapshot) 남용 금지, 컬렉션은 방문당 1회 조회.
- 환경 변수는 `.env.local` (gitignore됨), 이름은 `.env.example` 참고. Netlify에는 Environment variables 로 등록.

## 테스트 (에뮬레이터)
- 실제 DB를 건드리지 않으려면 Firebase 에뮬레이터를 사용 (Java 필요, firebase-tools 는 프로젝트 의존성에 넣지 않음 — `npx firebase-tools` 또는 임시 폴더 설치).
- `firebase emulators:start --project demo-test --only firestore,auth` (규칙 사본의 관리자 이메일을 테스트 이메일로 바꿔서) 후,
  `VITE_USE_FIREBASE_EMULATOR=true VITE_FIREBASE_PROJECT_ID=demo-test VITE_FIREBASE_API_KEY=fake VITE_ADMIN_EMAIL=<테스트 이메일> npx vite` 로 실행.

## 완료된 단계
1. ✅ Firebase 초기화 (`src/lib/firebase.ts`, Analytics·Storage 미사용)
2. ✅ dataService → Firestore Lite 조회, 화면 코드 변경 없음, `importLocalData()` 1회성 가져오기
3. ✅ Google 로그인 (`src/lib/auth.ts`, signInWithPopup)
4. ✅ `/admin` 관리자 페이지 (VITE_ADMIN_EMAIL + email_verified 계정만 편집 화면, CRUD, 저장 후 캐시 무효화)
5. ✅ `firestore.rules` — 5개 컬렉션 공개 읽기, 관리자만 쓰기, 그 외 전부 거부 (에뮬레이터로 14개 경우 검증)
6. ✅ 공지 게시판 `/board` (posts 컬렉션, 관리자 탭 "게시판")

## 사용자가 콘솔에서 할 일 (코드 밖)
- 규칙 게시(이메일 교체), Netlify 환경 변수 5개 등록 후 재배포, 승인된 도메인에 Netlify 도메인, /admin 에서 "데이터 가져오기" 1회.

## 앞으로 고려할 것
- PDF·사진 업로드는 Storage(Blaze) 없이 GitHub `public/` 에 올리고 경로만 저장하는 방식 유지.
- 읽기 횟수가 늘면 sessionStorage 캐시 등으로 방문당 조회를 더 줄일 수 있음.
