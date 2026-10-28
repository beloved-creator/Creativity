# src/lib — 다음 단계에서 구현 예정

이 폴더에는 외부 서비스 연결 코드를 둡니다.

다음 단계에서 만들 파일:
- `firebase.ts` — Firebase 앱 초기화 (`.env.local` 의 `VITE_FIREBASE_*` 값 사용), Firestore·Auth 인스턴스 내보내기
- `auth.ts` — Google 로그인/로그아웃, 관리자(`VITE_ADMIN_EMAIL`) 여부 확인

주의: Spark(무료) 요금제에서 쓸 수 있는 Firestore와 Authentication만 사용합니다.
Cloud Storage, Cloud Functions 등 Blaze 전용 기능은 쓰지 않습니다.
