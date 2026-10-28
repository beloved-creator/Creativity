import { Link } from 'react-router'
import AsyncBoundary from '../components/AsyncBoundary'
import ProfilePhoto from '../components/ProfilePhoto'
import PublicationItem from '../components/PublicationItem'
import { useAsyncData } from '../hooks/useAsyncData'
import { usePageMeta } from '../hooks/usePageMeta'
import { getFeaturedPublications, getNews, getProfile } from '../services/dataService'
import { formatDate } from '../utils/format'

// 로더는 컴포넌트 밖에 두어야 매 렌더링마다 다시 조회하지 않습니다.
const loadFeatured = () => getFeaturedPublications(3)
const loadRecentNews = () => getNews(3)

function SectionTitle({ id, children }: { id: string; children: string }) {
  return (
    <h2 id={id} className="mb-5 text-xl font-bold text-brand-900 sm:text-2xl">
      {children}
    </h2>
  )
}

export default function HomePage() {
  usePageMeta(undefined)
  const profileState = useAsyncData(getProfile)
  const featuredState = useAsyncData(loadFeatured)
  const newsState = useAsyncData(loadRecentNews)
  const highlightNames = profileState.data?.authorNames ?? []

  return (
    <div className="space-y-16">
      {/* 소개 */}
      <AsyncBoundary state={profileState} loadingLabel="프로필을 불러오는 중…">
        {(profile) => (
          <section aria-labelledby="intro-heading" className="flex flex-col gap-8 sm:flex-row sm:items-start">
            <ProfilePhoto src={profile.photoUrl} name={profile.nameKo} />
            <div className="min-w-0">
              <h1 id="intro-heading" className="text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl">
                {profile.nameKo}
                <span className="ml-3 text-xl font-medium text-slate-500 sm:text-2xl">{profile.nameEn}</span>
              </h1>
              <p className="mt-2 text-lg text-slate-700">
                {profile.affiliation} · {profile.position}
              </p>
              <div className="mt-5 space-y-3 leading-relaxed text-slate-700">
                {profile.bio.map((para) => (
                  <p key={para}>{para}</p>
                ))}
              </div>
              <h2 className="sr-only">연구 관심 분야</h2>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="연구 관심 분야">
                {profile.researchInterests.map((k) => (
                  <li key={k} className="rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-800 ring-1 ring-brand-100">
                    {k}
                  </li>
                ))}
              </ul>
              {profile.links && profile.links.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  {profile.links.map((l) => (
                    <li key={l.url + l.label}>
                      <a href={l.url} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-700 underline underline-offset-2 hover:text-brand-900">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}
      </AsyncBoundary>

      {/* 대표 논문 */}
      <section aria-labelledby="featured-heading">
        <SectionTitle id="featured-heading">대표 논문</SectionTitle>
        <AsyncBoundary state={featuredState} loadingLabel="논문을 불러오는 중…">
          {(pubs) =>
            pubs.length === 0 ? (
              <p className="text-slate-600">등록된 대표 논문이 없습니다.</p>
            ) : (
              <ol className="space-y-6">
                {pubs.map((p) => (
                  <li key={p.id} className="rounded-lg border border-slate-200 p-5">
                    <PublicationItem publication={p} highlightNames={highlightNames} showAbstract={false} />
                  </li>
                ))}
              </ol>
            )
          }
        </AsyncBoundary>
        <p className="mt-5">
          <Link to="/publications" className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-900">
            전체 연구 업적 보기 →
          </Link>
        </p>
      </section>

      {/* 최근 소식 */}
      <section aria-labelledby="news-heading">
        <SectionTitle id="news-heading">최근 소식</SectionTitle>
        <AsyncBoundary state={newsState} loadingLabel="소식을 불러오는 중…">
          {(items) =>
            items.length === 0 ? (
              <p className="text-slate-600">새 소식이 없습니다.</p>
            ) : (
              <ul className="divide-y divide-slate-200 border-y border-slate-200">
                {items.map((n) => (
                  <li key={n.id} className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-6">
                    <time dateTime={n.date} className="shrink-0 text-sm tabular-nums text-slate-500 sm:w-28 sm:pt-0.5">
                      {formatDate(n.date)}
                    </time>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {n.url ? (
                          <a href={n.url} target="_blank" rel="noopener noreferrer" className="hover:text-brand-700 hover:underline">
                            {n.title}
                          </a>
                        ) : (
                          n.title
                        )}
                      </h3>
                      {n.body && <p className="mt-1 text-sm leading-relaxed text-slate-600">{n.body}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            )
          }
        </AsyncBoundary>
      </section>
    </div>
  )
}
