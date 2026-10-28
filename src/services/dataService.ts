/**
 * 데이터 서비스 — 화면(컴포넌트)은 반드시 이 파일의 함수로만 데이터를 읽고 씁니다.
 *
 * 데이터 출처
 *  - Firebase 설정(환경 변수)이 있으면: Cloud Firestore
 *      profile/main, publications/{id}, projects/{id}, news/{id}
 *  - 설정이 없으면: src/data/ 의 TypeScript 파일 (로컬 미리보기·백업용)
 *
 * Firestore 무료 한도(하루 읽기 5만 회)를 아끼기 위해 결과를 메모리에 캐시합니다.
 * 같은 방문 중에는 페이지를 오가도 컬렉션마다 한 번만 조회합니다.
 * (실시간 리스너 onSnapshot 은 쓰지 않습니다.)
 */
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, writeBatch } from 'firebase/firestore/lite'
import { news as localNews } from '../data/news'
import { profile as localProfile } from '../data/profile'
import { projects as localProjects } from '../data/projects'
import { publications as localPublications } from '../data/publications'
import { getDb, isFirebaseConfigured } from '../lib/firebase'
import type { NewsItem, Profile, Project, Publication } from '../types'

type CollectionName = 'publications' | 'projects' | 'news'
const PROFILE_PATH = ['profile', 'main'] as const

/** true 이면 Firestore, false 이면 src/data 를 사용 중 */
export const isUsingFirestore = isFirebaseConfigured

/** Firestore에 아직 데이터를 넣지 않았을 때 (관리자 페이지에서 "데이터 가져오기" 필요) */
export class DataNotReadyError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DataNotReadyError'
  }
}

// ───────────── 캐시 ─────────────

const cache = new Map<string, Promise<unknown>>()

/** 같은 key 로 여러 번 호출해도 실제 조회는 한 번만 일어나게 합니다. 실패하면 캐시를 비워 재시도할 수 있게 합니다. */
function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  const hit = cache.get(key) as Promise<T> | undefined
  if (hit) return hit
  const promise = load().catch((error: unknown) => {
    cache.delete(key)
    throw error
  })
  cache.set(key, promise)
  return promise
}

// ───────────── Firestore 읽기/쓰기 도우미 ─────────────

async function readCollection<T extends { id: string }>(name: CollectionName): Promise<T[]> {
  const snapshot = await getDocs(collection(getDb(), name))
  return snapshot.docs.map((d) => ({ ...d.data(), id: d.id }) as T)
}

/** id 는 문서 ID로 쓰므로 문서 내용에서는 뺍니다. */
function withoutId<T extends { id: string }>(item: T): Omit<T, 'id'> {
  const { id: _id, ...rest } = item
  return rest
}

function requireFirestore() {
  if (!isUsingFirestore) throw new Error('Firebase가 연결되어 있지 않아 저장할 수 없습니다.')
}

async function saveToCollection<T extends { id: string }>(name: CollectionName, item: T): Promise<string> {
  requireFirestore()
  const db = getDb()
  const ref = item.id ? doc(db, name, item.id) : doc(collection(db, name)) // 새 항목이면 ID 자동 생성
  await setDoc(ref, withoutId(item))
  cache.delete(name)
  return ref.id
}

async function deleteFromCollection(name: CollectionName, id: string): Promise<void> {
  requireFirestore()
  await deleteDoc(doc(getDb(), name, id))
  cache.delete(name)
}

// ───────────── 읽기 (공개 화면용) ─────────────

export function getProfile(): Promise<Profile> {
  return cached('profile', async () => {
    if (!isUsingFirestore) return localProfile
    const snapshot = await getDoc(doc(getDb(), ...PROFILE_PATH))
    if (!snapshot.exists()) {
      throw new DataNotReadyError('프로필 데이터가 아직 없습니다. 관리자 페이지에서 "기존 데이터 가져오기"를 실행해 주세요.')
    }
    return { ...(snapshot.data() as Omit<Profile, 'id'>), id: snapshot.id }
  })
}

/** 연도 내림차순으로 정렬된 전체 연구 업적 */
export function getPublications(): Promise<Publication[]> {
  return cached('publications', async () => {
    const items = isUsingFirestore ? await readCollection<Publication>('publications') : localPublications
    return [...items].sort((a, b) => b.year - a.year || a.title.localeCompare(b.title))
  })
}

/** 홈 화면용 대표 논문 (featured: true) */
export async function getFeaturedPublications(limit = 3): Promise<Publication[]> {
  const all = await getPublications()
  return all.filter((p) => p.featured).slice(0, limit)
}

export function getProjects(): Promise<Project[]> {
  const order = { ongoing: 0, completed: 1 }
  return cached('projects', async () => {
    const items = isUsingFirestore ? await readCollection<Project>('projects') : localProjects
    return [...items].sort(
      (a, b) => order[a.status] - order[b.status] || b.startDate.localeCompare(a.startDate),
    )
  })
}

/** 최신순 소식. limit 을 주면 그 개수만 */
export async function getNews(limit?: number): Promise<NewsItem[]> {
  const all = await cached('news', async () => {
    const items = isUsingFirestore ? await readCollection<NewsItem>('news') : localNews
    return [...items].sort((a, b) => b.date.localeCompare(a.date))
  })
  return limit === undefined ? all : all.slice(0, limit)
}

// ───────────── 쓰기 (관리자 페이지용) ─────────────
// 실제 쓰기 권한은 Firestore 보안 규칙(firestore.rules)이 관리자 계정에만 허용합니다.

export async function saveProfile(profile: Profile): Promise<void> {
  requireFirestore()
  await setDoc(doc(getDb(), ...PROFILE_PATH), withoutId(profile))
  cache.delete('profile')
}

/** 저장 후 문서 ID를 돌려줍니다. id 가 비어 있으면 새로 만듭니다. */
export const savePublication = (item: Publication) => saveToCollection('publications', item)
export const deletePublication = (id: string) => deleteFromCollection('publications', id)

export const saveProject = (item: Project) => saveToCollection('projects', item)
export const deleteProject = (id: string) => deleteFromCollection('projects', id)

export const saveNews = (item: NewsItem) => saveToCollection('news', item)
export const deleteNews = (id: string) => deleteFromCollection('news', id)

/**
 * src/data/ 의 내용을 Firestore로 한 번에 옮깁니다 (처음 1회용).
 * 같은 id 의 문서는 덮어쓰고, Firestore에만 있는 문서는 그대로 둡니다.
 * @returns 저장한 문서 수
 */
export async function importLocalData(): Promise<number> {
  requireFirestore()
  const db = getDb()
  const batch = writeBatch(db)
  batch.set(doc(db, ...PROFILE_PATH), withoutId(localProfile))
  const groups: [CollectionName, { id: string }[]][] = [
    ['publications', localPublications],
    ['projects', localProjects],
    ['news', localNews],
  ]
  let count = 1
  for (const [name, items] of groups) {
    for (const item of items) {
      batch.set(doc(db, name, item.id), withoutId(item))
      count++
    }
  }
  await batch.commit()
  cache.clear()
  return count
}
