# src/pages/admin — 다음 단계에서 구현 예정

관리자 페이지(`/admin`)를 둘 자리입니다.

계획:
- Google 로그인 후, `VITE_ADMIN_EMAIL` 과 같은 계정만 접근 가능
- 논문·프로젝트·소식·프로필을 추가/수정/삭제하는 화면
- 실제 쓰기 권한은 화면이 아니라 **Firestore 보안 규칙**으로 막습니다 (화면 숨김만으로는 안전하지 않음)
- PDF·이미지 업로드 기능은 만들지 않습니다 (Cloud Storage는 Blaze 요금제 필요).
  파일은 GitHub 저장소의 `public/` 폴더에 넣고, 관리자 화면에는 경로(`/papers/파일명.pdf`)만 입력합니다.
