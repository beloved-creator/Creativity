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

function SectionTitle({ id, eyebrow, children }: { id: string; eyebrow: string; children: string }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-bold tracking-[0.2em] text-accent-600 uppercase">{eyebrow}</p>
      <h2 id={id} className="text-gradient mt-1 inline-block text-2xl font-extrabold sm:text-3xl">
        {children}
      </h2>
    </div>
  )
}

export default function HomePage() {
  usePageMeta(undefined)
  const profileState = useAsyncData(getProfile)
  const featuredState = useAsyncData(loadFeatured)
  const newsState = useAsyncData(loadRecentNews)
  const highlightNames = profileState.data?.authorNames ?? []

  return (
    <div className="space-y-20">
      {/* 소개 (그라데이션 히어로) */}
      <AsyncBoundary state={profileState} loadingLabel="프로필을 불러오는 중…">
        {(profile) => (
          <section
            aria-labelledby="intro-heading"
            className="bg-hero relative animate-fade-up overflow-hidden rounded-[2rem] p-6 text-white shadow-2xl shadow-accent-700/25 sm:p-10"
          >
            <div aria-hidden="true" className="bg-dots absolute inset-0" />
            <div aria-hidden="true" className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-accent-500/50 blur-3xl" />
            <div aria-hidden="true" className="absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-sky-400/30 blur-3xl" />

            <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center">
              <ProfilePhoto src={profile.photoUrl} name={profile.nameKo} />
              <div className="min-w-0">
                <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium ring-1 ring-white/25 backdrop-blur">
                  <span aria-hidden="true" className="h-2 w-2 rounded-full bg-emerald-300" />
                  {profile.affiliation} · {profile.position}
                </p>
                <h1 id="intro-heading" className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
                  {profile.nameKo}
                  <span className="mt-1 block text-xl font-semibold text-white/75 sm:ml-3 sm:inline sm:text-2xl">
                    {profile.nameEn}
                  </span>
                </h1>
                <div className="mt-5 space-y-3 leading-relaxed text-white/90">
                  {profile.bio.map((para) => (
                    <p key={para}>{para}</p>
                  ))}
                </div>
                <h2 className="sr-only">연구 관심 분야</h2>
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="연구 관심 분야">
                  {profile.researchInterests.map((k) => (
                    <li
                      key={k}
                      className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold ring-1 ring-white/30 backdrop-blur transition-colors hover:bg-white/25"
                    >
                      # {k}
                    </li>
                  ))}
                </ul>
                {profile.links && profile.links.length > 0 && (
                  <ul className="mt-6 flex flex-wrap gap-2 text-sm">
                    {profile.links.map((l) => (
                      <li key={l.url + l.label}>
                        <a
                          href={l.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-1.5 font-bold text-brand-800 shadow-md transition-transform hover:-translate-y-0.5"
                        >
                          {l.label} <span aria-hidden="true">↗</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        )}
      </AsyncBoundary>

      {/* 대표 논문 */}
      <section aria-labelledby="featured-heading">
        <SectionTitle id="featured-heading" eyebrow="Featured">
          대표 논문
        </SectionTitle>
        <AsyncBoundary state={featuredState} loadingLabel="논문을 불러오는 중…">
          {(pubs) =>
            pubs.length === 0 ? (
              <p className="text-slate-600">등록된 대표 논문이 없습니다.</p>
            ) : (
              <ol className="space-y-5">
                {pubs.map((p, i) => (
                  <li
                    key={p.id}
                    style={{ animationDelay: `${i * 90}ms` }}
                    className="group relative animate-fade-up overflow-hidden rounded-2xl bg-white p-6 pl-8 shadow-lg shadow-slate-900/5 ring-1 ring-slate-200 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-accent-600/15 hover:ring-accent-200"
                  >
                    <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-sky-400 via-accent-500 to-pink-500" />
                    <PublicationItem publication={p} highlightNames={highlightNames} showAbstract={false} />
                  </li>
                ))}
              </ol>
            )
          }
        </AsyncBoundary>
        <p className="mt-6">
          <Link
            to="/publications"
            className="bg-hero inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold text-white shadow-lg shadow-accent-600/30 transition-transform hover:-translate-y-0.5"
          >
            전체 연구 업적 보기 <span aria-hidden="true">→</span>
          </Link>
        </p>
      </section>

      {/* 최근 소식 (타임라인) */}
      <section aria-labelledby="news-heading">
        <SectionTitle id="news-heading" eyebrow="News">
          최근 소식
        </SectionTitle>
        <AsyncBoundary state={newsState} loadingLabel="소식을 불러오는 중…">
          {(items) =>
            items.length === 0 ? (
              <p className="text-slate-600">새 소식이 없습니다.</p>
            ) : (
              <ul className="relative space-y-6 border-l-2 border-accent-200 pl-6 sm:pl-8">
                {items.map((n) => (
                  <li key={n.id} className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute top-1.5 -left-[33px] h-4 w-4 rounded-full bg-gradient-to-br from-sky-400 to-accent-600 ring-4 ring-slate-50 sm:-left-[41px]"
                    />
                    <div className="rounded-2xl bg-white p-5 shadow-md shadow-slate-900/5 ring-1 ring-slate-200 transition-shadow hover:shadow-lg hover:shadow-accent-600/10">
                      <time dateTime={n.date} className="text-sm font-bold tabular-nums text-accent-700">
                        {formatDate(n.date)}
                      </time>
                      <h3 className="mt-1 text-lg font-bold text-slate-900">
                        {n.url ? (
                          <a href={n.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent-700 hover:underline">
                            {n.title}
                          </a>
                        ) : (
                          n.title
                        )}
                      </h3>
                      {n.body && <p className="mt-1 leading-relaxed text-slate-600">{n.body}</p>}
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
