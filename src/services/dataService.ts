/**
 * 데이터 서비스 — 화면(컴포넌트)은 반드시 이 파일의 함수로만 데이터를 가져옵니다.
 *
 * 지금은 src/data/ 의 TypeScript 파일을 읽어 돌려줍니다.
 * 다음 단계에서 이 파일의 "내부"만 Firestore 조회로 바꿀 예정이며,
 * 함수 이름과 반환 타입(Promise<...>)은 그대로 유지해야 화면 코드를 고치지 않아도 됩니다.
 *
 * Firestore 무료 한도(하루 읽기 5만 회)를 아끼기 위해 결과를 메모리에 캐시합니다.
 * 같은 방문 중에는 페이지를 오가도 한 번만 조회합니다.
 */
import { news } from '../data/news'
import { profile } from '../data/profile'
import { projects } from '../data/projects'
import { publications } from '../data/publications'
import type { NewsItem, Profile, Project, Publication } from '../types'

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

export function getProfile(): Promise<Profile> {
  return cached('profile', async () => profile)
}

/** 연도 내림차순으로 정렬된 전체 연구 업적 */
export function getPublications(): Promise<Publication[]> {
  return cached('publications', async () =>
    [...publications].sort((a, b) => b.year - a.year || a.title.localeCompare(b.title)),
  )
}

/** 홈 화면용 대표 논문 (featured: true) */
export async function getFeaturedPublications(limit = 3): Promise<Publication[]> {
  const all = await getPublications()
  return all.filter((p) => p.featured).slice(0, limit)
}

export function getProjects(): Promise<Project[]> {
  const order = { ongoing: 0, completed: 1 }
  return cached('projects', async () =>
    [...projects].sort(
      (a, b) => order[a.status] - order[b.status] || b.startDate.localeCompare(a.startDate),
    ),
  )
}

/** 최신순 소식. limit 을 주면 그 개수만 */
export async function getNews(limit?: number): Promise<NewsItem[]> {
  const all = await cached('news', async () =>
    [...news].sort((a, b) => b.date.localeCompare(a.date)),
  )
  return limit === undefined ? all : all.slice(0, limit)
}
