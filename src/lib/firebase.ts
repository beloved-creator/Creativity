/**
 * Firebase 초기화 — Firestore Lite(데이터, 실시간 기능 없는 가벼운 버전)와 Authentication(Google 로그인)만 사용합니다.
 * Spark(무료) 요금제 제약상 Cloud Storage, Cloud Functions, Analytics 등은 쓰지 않습니다.
 *
 * 설정값은 환경 변수에서 읽습니다.
 *  - 내 컴퓨터: 프로젝트 폴더의 .env.local
 *  - Netlify: Site configuration → Environment variables
 * 설정이 비어 있으면 isFirebaseConfigured 가 false 가 되고,
 * 사이트는 src/data/ 의 내용을 대신 보여줍니다.
 */
import { initializeApp, type FirebaseApp } from 'firebase/app'
import { connectFirestoreEmulator, initializeFirestore, type Firestore } from 'firebase/firestore/lite'

const env = import.meta.env

export const isFirebaseConfigured = Boolean(env.VITE_FIREBASE_API_KEY && env.VITE_FIREBASE_PROJECT_ID)

/**
 * 설정값이 이상하면 이유를 돌려줍니다 (정상이면 빈 문자열).
 * 예: 화면에 가려진 값(AIza••••)을 그대로 복사해 넣은 경우
 */
export function getFirebaseConfigProblem(): string {
  const key = env.VITE_FIREBASE_API_KEY ?? ''
  if (key && !/^[A-Za-z0-9_-]{30,}$/.test(key)) {
    return 'Netlify 환경 변수 VITE_FIREBASE_API_KEY 값이 올바르지 않습니다. 가려진 값(•••)이 아닌 전체 키(AIza로 시작하는 39글자)를 다시 넣고 재배포해 주세요.'
  }
  return ''
}

/** 개발용 로컬 에뮬레이터 사용 여부 */
export const useEmulator = env.VITE_USE_FIREBASE_EMULATOR === 'true'

let app: FirebaseApp | undefined
let db: Firestore | undefined

export function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured) throw new Error('Firebase 설정(환경 변수)이 없습니다.')
  app ??= initializeApp({
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  })
  return app
}

export function getDb(): Firestore {
  if (!db) {
    // ignoreUndefinedProperties: 비어 있는 선택 항목(undefined)은 저장하지 않고 건너뜀
    db = initializeFirestore(getFirebaseApp(), { ignoreUndefinedProperties: true })
    if (useEmulator) connectFirestoreEmulator(db, '127.0.0.1', 8080)
  }
  return db
}
