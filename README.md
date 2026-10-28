# 교수 연구 웹사이트

심리학과 교수의 연구 업적·프로젝트를 소개하는 웹사이트입니다.
(Vite + React + TypeScript + Tailwind CSS, Netlify 배포)

> 지금 들어 있는 이름·논문·소식은 모두 **샘플**입니다. 아래 방법으로 본인 내용으로 바꿔 주세요.

---

## 1. 내 콘텐츠 수정하는 법

모든 내용은 `src/data/` 폴더의 파일 4개에 있습니다. 파일마다 맨 위에 한국어 설명이 있습니다.

| 바꾸고 싶은 것 | 열 파일 |
|---|---|
| 이름, 직위, 소개, 연구 키워드, 이메일, 연구실 위치, 면담 안내, 사진 | `src/data/profile.ts` |
| 논문, 저서·챕터, 학술대회 발표, 연구비 | `src/data/publications.ts` |
| 연구 프로젝트 | `src/data/projects.ts` |
| 최근 소식 | `src/data/news.ts` |
| 브라우저 탭에 보이는 사이트 이름 | `src/siteConfig.ts` 와 `index.html` |

**수정 요령**
- 따옴표 `'...'` 안의 글자만 바꾸세요. 따옴표·쉼표·중괄호 `{ }`는 지우지 마세요.
- 새 논문은 기존 항목 `{ ... },` 하나를 통째로 복사해서 붙여 넣고 내용을 바꾸는 것이 가장 안전합니다.
- 각 항목의 `id`는 다른 항목과 겹치지 않게 지어 주세요 (예: `'kim-2026-emotion'`).
- 내 이름을 굵게 표시하려면 `profile.ts`의 `authorNames`에 논문 저자 표기와 **똑같이** 적어야 합니다 (예: `'Kim, S.'`, `'김서연'`).
- 홈 화면 "대표 논문"에 보이게 하려면 해당 논문에 `featured: true`를 넣으세요 (3편 권장).
- 오픈 사이언스 배지: `preregistered: true`, `openData: true`, `openMaterials: true`.
- 저장 후 미리보기(3번)에서 오류가 없는지 확인하세요. 오류가 나면 대부분 쉼표나 따옴표가 빠진 경우입니다.

**사진 넣기**: 사진 파일(예: `profile.jpg`)을 `public/images/`에 넣고, `profile.ts`에서 `photoUrl: '/images/profile.jpg'`로 바꿉니다.

## 2. PDF 추가하는 법

1. PDF 파일을 `public/papers/` 폴더에 넣습니다. 파일 이름은 **영문·숫자·하이픈**만 쓰세요 (예: `kim-2026-emotion.pdf`).
2. `src/data/publications.ts`의 해당 논문에 다음 한 줄을 추가합니다.
   ```ts
   pdfUrl: '/papers/kim-2026-emotion.pdf',
   ```
3. 출판사 저작권 정책상 공개 가능한 버전(예: 저자 원고)인지 확인하세요.
4. 예시 파일 `public/papers/sample-paper.pdf`는 지워도 됩니다. (지우면 샘플 논문의 `pdfUrl` 줄도 지우세요.)

## 3. 내 컴퓨터에서 미리보기

처음 한 번만 준비합니다.
1. [Node.js](https://nodejs.org/) **LTS 버전(24)** 을 설치합니다.
2. 터미널(맥: "터미널", 윈도우: "PowerShell")을 열고 이 프로젝트 폴더로 이동합니다.
3. 필요한 패키지를 설치합니다.
   ```bash
   npm install
   ```

미리보기를 실행합니다.
```bash
npm run dev
```
터미널에 나오는 주소(보통 `http://localhost:5173`)를 브라우저에서 엽니다. 파일을 저장하면 화면이 자동으로 바뀝니다. 끝낼 때는 터미널에서 `Ctrl + C`를 누릅니다.

배포 전에 오류가 없는지 확인하려면:
```bash
npm run build
```
```bash
npm run lint
```

## 4. GitHub 저장소 만들고 올리기 (push)

1. [github.com](https://github.com)에 로그인 → 오른쪽 위 **+** → **New repository**.
2. Repository name을 정하고(예: `research-website`) **Public** 또는 **Private** 선택.
   README·.gitignore 추가 옵션은 **체크하지 않습니다** (이미 있음). **Create repository** 클릭.
3. 다음 화면에 보이는 저장소 주소(`https://github.com/내아이디/research-website.git`)를 복사합니다.
4. 터미널에서 프로젝트 폴더로 이동한 뒤 아래 명령을 차례로 실행합니다. (주소는 본인 것으로)
   ```bash
   git remote add origin https://github.com/내아이디/research-website.git
   ```
   ```bash
   git branch -M main
   ```
   ```bash
   git push -u origin main
   ```
5. 로그인 창이 뜨면 GitHub 계정으로 로그인합니다.

**이후 수정할 때마다** (내용 수정 → 저장 → 아래 3줄):
```bash
git add .
```
```bash
git commit -m "논문 추가"
```
```bash
git push
```
Netlify를 연결해 두었다면 push 후 1~2분 뒤 사이트에 자동 반영됩니다.

## 5. Netlify로 배포하기

1. [netlify.com](https://www.netlify.com)에서 **GitHub 계정으로 가입/로그인**합니다.
2. **Add new project**(또는 Add new site) → **Import an existing project** → **GitHub** 선택.
3. GitHub 권한 허용 후, 4번에서 만든 저장소를 선택합니다.
4. 빌드 설정은 `netlify.toml` 파일에서 자동으로 읽어옵니다. 다음과 같이 보이면 그대로 둡니다.
   - Build command: `npm run build`
   - Publish directory: `dist`
5. **Deploy** 클릭 → 1~2분 뒤 `https://임의이름.netlify.app` 주소가 생깁니다.
6. 주소 바꾸기: 프로젝트 설정의 **Change project name**(또는 Change site name)에서 원하는 이름으로 변경할 수 있습니다.
   (개인 도메인은 **Domain management**에서 연결)

---

## 폴더 구조 (참고)

```
public/papers/      PDF 파일
public/images/      사진
src/data/           ★ 내 콘텐츠 (여기만 고치면 됩니다)
src/pages/          페이지 화면
src/components/     공통 화면 조각
src/services/       데이터를 가져오는 함수 (다음 단계에서 Firebase로 교체)
src/types/          데이터 형식 정의
src/utils/          APA 서식 등 도구 함수
src/lib/            (다음 단계) Firebase 연결
src/pages/admin/    (다음 단계) 관리자 페이지
```
