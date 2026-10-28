/// <reference types="vite/client" />

/** .env.local / Netlify 환경 변수 (이름은 .env.example 참고) */
interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY?: string
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string
  readonly VITE_FIREBASE_PROJECT_ID?: string
  readonly VITE_FIREBASE_APP_ID?: string
  readonly VITE_ADMIN_EMAIL?: string
  /** 개발용: 'true' 이면 로컬 Firebase 에뮬레이터에 연결 */
  readonly VITE_USE_FIREBASE_EMULATOR?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
