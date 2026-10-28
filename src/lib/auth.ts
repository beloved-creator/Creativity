/**
 * Google 로그인 — 관리자 페이지에서만 사용합니다.
 * 관리자 여부는 화면 표시용일 뿐이고, 실제 쓰기 권한은 Firestore 보안 규칙(firestore.rules)이 막습니다.
 */
import {
  connectAuthEmulator,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type Auth,
  type User,
} from 'firebase/auth'
import { getFirebaseApp, useEmulator } from './firebase'

let auth: Auth | undefined

function getAuthInstance(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp())
    if (useEmulator) connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
  }
  return auth
}

export const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL ?? '').trim().toLowerCase()

export function isAdmin(user: User | null): boolean {
  return Boolean(user?.email && user.emailVerified && adminEmail && user.email.toLowerCase() === adminEmail)
}

export async function signInWithGoogle(): Promise<void> {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })
  await signInWithPopup(getAuthInstance(), provider)
}

export function signOutUser(): Promise<void> {
  return signOut(getAuthInstance())
}

/** 로그인 상태가 바뀔 때마다 callback 호출. 반환값을 호출하면 구독 해제 */
export function watchAuth(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(getAuthInstance(), callback)
}

export type { User }
