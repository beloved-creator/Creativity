import { useMemo, useRef, type KeyboardEvent } from 'react'
import { useSearchParams } from 'react-router'
import AsyncBoundary from '../components/AsyncBoundary'
import PageHeader from '../components/PageHeader'
import PublicationItem from '../components/PublicationItem'
import { useAsyncData } from '../hooks/useAsyncData'
import { usePageMeta } from '../hooks/usePageMeta'
import { getProfile, getPublications } from '../services/dataService'
import type { Profile, Publication } from '../types'
import { publicationTabs } from '../utils/format'

const loadPage = () => Promise.all([getPublications(), getProfile()])

/** 검색어를 공백으로 나눠, 모든 단어가 제목·저자·키워드(및 학술지명·책 제목) 중 어딘가에 들어 있으면 일치 */
function matchesQuery(p: Publication, query: string): boolean {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (words.length === 0) return true
  const haystack = [p.title, ...p.authors, ...(p.keywords ?? []), p.venue, p.bookTitle ?? ''].join(' ').toLowerCase()
  return words.every((w) => haystack.includes(w))
}

function PublicationList({ publications, profile }: { publications: Publication[]; profile: Profile }) {
  const [params, setParams] = useSearchParams()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const tabKey = publicationTabs.some((t) => t.key === params.get('tab')) ? params.get('tab')! : publicationTabs[0].key
  const tab = publicationTabs.find((t) => t.key === tabKey)!
  const query = params.get('q') ?? ''
  const yearParam = params.get('year') ?? ''

  /** URL 주소에 필터 상태를 저장 → 새로고침·링크 공유해도 유지됨 */
  const update = (changes: Record<string, string>) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        for (const [k, v] of Object.entries(changes)) {
          if (v) next.set(k, v)
          else next.delete(k)
        }
        return next
      },
      { replace: true },
    )
  }

  const inTab = useMemo(() => publications.filter((p) => tab.types.includes(p.type)), [publications, tab])
  const years = useMemo(() => [...new Set(inTab.map((p) => p.year))].sort((a, b) => b - a), [inTab])
  const year = years.includes(Number(yearParam)) ? Number(yearParam) : undefined

  const filtered = useMemo(
    () => inTab.filter((p) => (year === undefined || p.year === year) && matchesQuery(p, query)),
    [inTab, year, query],
  )

  const groups = useMemo(() => {
    const map = new Map<number, Publication[]>()
    for (const p of filtered) map.set(p.year, [...(map.get(p.year) ?? []), p])
    return [...map.entries()].sort((a, b) => b[0] - a[0])
  }, [filtered])

  const countFor = (types: string[]) => publications.filter((p) => types.includes(p.type)).length

  // 탭 키보드 조작: ←/→, Home/End
  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = publicationTabs.length - 1
    const target =
      e.key === 'ArrowRight' ? (index === last ? 0 : index + 1)
      : e.key === 'ArrowLeft' ? (index === 0 ? last : index - 1)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : undefined
    if (target === undefined) return
    e.preventDefault()
    update({ tab: publicationTabs[target].key, year: '' })
    tabRefs.current[target]?.focus()
  }

  return (
    <>
      <div role="tablist" aria-label="연구 업적 유형" className="-mx-4 flex gap-1 overflow-x-auto border-b border-slate-200 px-4 sm:mx-0 sm:px-0">
        {publicationTabs.map((t, i) => {
          const selected = t.key === tabKey
          return (
            <button
              key={t.key}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`tab-${t.key}`}
              aria-selected={selected}
              aria-controls="publication-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => update({ tab: t.key, year: '' })}
              onKeyDown={(e) => onTabKeyDown(e, i)}
              className={`-mb-px shrink-0 whitespace-nowrap border-b-2 px-3 py-3 text-[15px] font-semibold transition-colors sm:px-4 ${
                selected ? 'border-brand-700 text-brand-800' : 'border-transparent text-slate-600 hover:text-brand-700'
              }`}
            >
              {t.label} <span className="font-normal text-slate-500">({countFor(t.types)})</span>
            </button>
          )
        })}
      </div>

      <div id="publication-panel" role="tabpanel" aria-labelledby={`tab-${tabKey}`} className="pt-6">
        {/* 검색·필터 */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <label htmlFor="pub-search" className="sr-only">
              제목, 저자, 키워드 검색
            </label>
            <input
              id="pub-search"
              type="search"
              value={query}
              onChange={(e) => update({ q: e.target.value })}
              placeholder="제목, 저자, 키워드 검색"
              className="w-full rounded border border-slate-300 px-3 py-2 text-base placeholder:text-slate-500 focus:border-brand-600"
            />
          </div>
          <div>
            <label htmlFor="pub-year" className="sr-only">
              연도 선택
            </label>
            <select
              id="pub-year"
              value={year ?? ''}
              onChange={(e) => update({ year: e.target.value })}
              className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-base sm:w-40"
            >
              <option value="">전체 연도</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}년
                </option>
              ))}
            </select>
          </div>
        </div>

        <p aria-live="polite" className="mt-4 text-sm text-slate-600">
          {filtered.length}건
          {(query || year) && (
            <button
              type="button"
              onClick={() => update({ q: '', year: '' })}
              className="ml-3 font-medium text-brand-700 underline underline-offset-2 hover:text-brand-900"
            >
              필터 초기화
            </button>
          )}
        </p>

        {groups.length === 0 ? (
          <p className="py-10 text-center text-slate-600">조건에 맞는 항목이 없습니다.</p>
        ) : (
          <div className="mt-6 space-y-10">
            {groups.map(([y, items]) => (
              <section key={y} aria-labelledby={`year-${y}`}>
                <h2 id={`year-${y}`} className="mb-4 border-b border-slate-200 pb-2 text-xl font-bold text-brand-900">
                  {y}
                </h2>
                <ul className="space-y-7">
                  {items.map((p) => (
                    <li key={p.id}>
                      <PublicationItem publication={p} highlightNames={profile.authorNames} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default function PublicationsPage() {
  usePageMeta('연구 업적', '학술지 논문, 저서, 학술대회 발표, 연구비 수주 목록 (APA 7판)')
  const state = useAsyncData(loadPage)

  return (
    <>
      <PageHeader title="연구 업적" description="APA 7판 형식으로 표시합니다. 각 항목의 버튼으로 인용문을 복사할 수 있습니다." />
      <AsyncBoundary state={state} loadingLabel="연구 업적을 불러오는 중…">
        {([publications, profile]) => <PublicationList publications={publications} profile={profile} />}
      </AsyncBoundary>
    </>
  )
}
