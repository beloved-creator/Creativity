/**
 * 관리자 페이지 (/admin)
 * - Google 로그인 후 VITE_ADMIN_EMAIL 계정만 편집 화면이 보입니다.
 * - 실제 쓰기 권한은 Firestore 보안 규칙(firestore.rules)이 막습니다.
 * - 이 페이지 코드는 /admin 에 들어올 때만 내려받습니다 (일반 방문자 속도에 영향 없음).
 */
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import ErrorState from '../../components/ErrorState'
import LoadingState from '../../components/LoadingState'
import PageHeader from '../../components/PageHeader'
import { useAsyncData } from '../../hooks/useAsyncData'
import { usePageMeta } from '../../hooks/usePageMeta'
import { adminEmail, isAdmin, signInWithGoogle, signOutUser, watchAuth, type User } from '../../lib/auth'
import {
  deleteNews,
  deleteProject,
  deletePublication,
  getNews,
  getProfile,
  getProjects,
  getPublications,
  importLocalData,
  isUsingFirestore,
  saveNews,
  saveProfile,
  saveProject,
  savePublication,
} from '../../services/dataService'
import type { NewsItem, Profile, Project, Publication } from '../../types'
import { formatDate, formatPeriod, projectStatusLabel } from '../../utils/format'
import CollectionEditor from './CollectionEditor'
import EntityForm from './EntityForm'
import { newsFields, profileFields, projectFields, publicationFields, publicationTypeOptions, toFormValues } from './fields'

const loadNews = () => getNews()

const typeLabel = (t: Publication['type']) => publicationTypeOptions.find((o) => o.value === t)?.label ?? t

const tabs = [
  { key: 'publications', label: '연구 업적' },
  { key: 'projects', label: '프로젝트' },
  { key: 'news', label: '소식' },
  { key: 'profile', label: '프로필' },
  { key: 'import', label: '데이터 가져오기' },
] as const
type TabKey = (typeof tabs)[number]['key']

const buttonClass = 'rounded-full px-5 py-2.5 font-bold'

// ───────────── 탭별 화면 ─────────────

function PublicationsTab() {
  return (
    <CollectionEditor<Publication>
      label="연구 업적"
      fields={publicationFields}
      load={getPublications}
      save={savePublication}
      remove={deletePublication}
      createEmpty={() => ({ type: 'journal', year: new Date().getFullYear() })}
      summarize={(p) => ({ title: p.title, meta: `${typeLabel(p.type)} · ${p.year} · ${p.authors.join(', ')}` })}
    />
  )
}

function ProjectsTab() {
  const pubs = useAsyncData(getPublications)
  const pubOptions = (pubs.data ?? []).map((p) => ({ id: p.id, label: `${p.year} · ${p.title}` }))
  return (
    <CollectionEditor<Project>
      label="프로젝트"
      fields={projectFields}
      load={getProjects}
      save={saveProject}
      remove={deleteProject}
      createEmpty={() => ({ status: 'ongoing' })}
      pubOptions={pubOptions}
      summarize={(p) => ({
        title: p.title,
        meta: `${projectStatusLabel[p.status]} · ${formatPeriod(p.startDate, p.endDate)} · ${p.funder}`,
      })}
    />
  )
}

function NewsTab() {
  return (
    <CollectionEditor<NewsItem>
      label="소식"
      fields={newsFields}
      load={loadNews}
      save={saveNews}
      remove={deleteNews}
      createEmpty={() => ({ date: new Date().toISOString().slice(0, 10) })}
      summarize={(n) => ({ title: n.title, meta: formatDate(n.date) })}
    />
  )
}

function ProfileTab() {
  const state = useAsyncData(getProfile)
  const [message, setMessage] = useState('')

  if (state.loading) return <LoadingState />
  if (state.error || !state.data) {
    return <ErrorState message={state.error?.message ?? '프로필을 불러오지 못했습니다.'} onRetry={state.retry} />
  }
  return (
    <section className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-slate-200 sm:p-6">
      <p aria-live="polite" className="mb-4 min-h-6 text-sm font-medium text-emerald-700">
        {message}
      </p>
      <EntityForm
        fields={profileFields}
        initialValues={toFormValues(state.data, profileFields)}
        submitLabel="프로필 저장"
        onSubmit={async (data) => {
          await saveProfile({ ...data, id: 'main' } as Profile)
          setMessage('프로필을 저장했습니다.')
        }}
      />
    </section>
  )
}

function ImportTab() {
  const [status, setStatus] = useState<'idle' | 'working' | 'done' | 'error'>('idle')
  const [detail, setDetail] = useState('')

  const run = async () => {
    if (
      !window.confirm(
        'src/data/ 폴더의 내용(프로필·연구 업적·프로젝트·소식)을 Firestore에 저장합니다.\n같은 id 의 항목은 덮어씁니다. 계속할까요?',
      )
    )
      return
    setStatus('working')
    try {
      const count = await importLocalData()
      setStatus('done')
      setDetail(`${count}개 문서를 저장했습니다.`)
    } catch (err) {
      setStatus('error')
      setDetail(err instanceof Error ? err.message : String(err))
    }
  }

  return (
    <section className="space-y-4 rounded-2xl bg-white p-5 shadow-md ring-1 ring-slate-200 sm:p-6">
      <h2 className="text-xl font-extrabold text-slate-900">기존 데이터 가져오기 (처음 1회)</h2>
      <p className="leading-relaxed text-slate-700">
        사이트를 처음 Firestore에 연결했을 때, 그동안 <code className="rounded bg-slate-100 px-1">src/data/</code> 파일에
        적어 둔 내용을 Firestore로 옮깁니다. 이후에는 이 관리자 페이지에서 내용을 수정하세요.
      </p>
      <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900 ring-1 ring-amber-200">
        주의: 같은 id 의 항목은 파일 내용으로 덮어씁니다. 관리자 페이지에서 고친 내용이 있다면 다시 실행하지 마세요.
      </p>
      <button
        type="button"
        onClick={run}
        disabled={status === 'working'}
        className={`${buttonClass} bg-hero text-white shadow-md shadow-accent-600/30 disabled:opacity-60`}
      >
        {status === 'working' ? '가져오는 중…' : '기존 데이터 가져오기'}
      </button>
      <p aria-live="polite" className={status === 'error' ? 'font-medium text-red-700' : 'font-medium text-emerald-700'}>
        {status === 'error' ? `실패했습니다: ${detail}` : detail}
      </p>
    </section>
  )
}

// ───────────── 로그인 확인 ─────────────

function Dashboard({ user }: { user: User }) {
  const [tab, setTab] = useState<TabKey>('publications')
  return (
    <>
      <div className="mb-6 flex flex-col gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          <strong className="text-slate-900">{user.email}</strong> 로 로그인됨
        </p>
        <button type="button" onClick={() => signOutUser()} className="self-start text-sm font-semibold text-accent-700 underline sm:self-auto">
          로그아웃
        </button>
      </div>
      <nav aria-label="관리 메뉴" className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            aria-current={tab === t.key ? 'page' : undefined}
            onClick={() => setTab(t.key)}
            className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[15px] font-bold transition-all ${
              tab === t.key ? 'bg-hero text-white shadow-md shadow-accent-600/30' : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:text-accent-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>
      {tab === 'publications' && <PublicationsTab />}
      {tab === 'projects' && <ProjectsTab />}
      {tab === 'news' && <NewsTab />}
      {tab === 'profile' && <ProfileTab />}
      {tab === 'import' && <ImportTab />}
    </>
  )
}

function AdminGate() {
  // undefined: 로그인 상태 확인 중 / null: 로그아웃
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const [error, setError] = useState('')

  useEffect(() => watchAuth(setUser), [])

  if (user === undefined) return <LoadingState label="로그인 상태 확인 중…" />

  if (!user) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-md ring-1 ring-slate-200">
        <p className="text-slate-700">관리자 Google 계정으로 로그인해 주세요.</p>
        <button
          type="button"
          onClick={() => {
            setError('')
            signInWithGoogle().catch((err: unknown) => {
              const code = (err as { code?: string }).code ?? ''
              if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return
              setError(
                code === 'auth/popup-blocked'
                  ? '팝업이 차단되었습니다. 브라우저 주소창의 팝업 차단을 해제해 주세요.'
                  : code === 'auth/unauthorized-domain'
                    ? '이 사이트 주소가 Firebase 승인된 도메인에 없습니다. Firebase 콘솔 → Authentication → 설정에서 추가해 주세요.'
                    : `로그인하지 못했습니다 (${code || String(err)})`,
              )
            })
          }}
          className={`${buttonClass} bg-hero mt-5 text-white shadow-md shadow-accent-600/30`}
        >
          Google 계정으로 로그인
        </button>
        {error && (
          <p role="alert" className="mt-4 text-sm font-medium text-red-700">
            {error}
          </p>
        )}
      </div>
    )
  }

  if (!isAdmin(user)) {
    return (
      <div role="alert" className="rounded-2xl bg-white p-8 text-center shadow-md ring-1 ring-red-200">
        <p className="font-semibold text-red-800">관리자 권한이 없는 계정입니다.</p>
        <p className="mt-2 text-sm text-slate-600">
          {user.email} 로 로그인했습니다.
          {!adminEmail && ' (VITE_ADMIN_EMAIL 환경 변수가 비어 있습니다.)'}
        </p>
        <button type="button" onClick={() => signOutUser()} className={`${buttonClass} mt-5 bg-white text-slate-700 ring-1 ring-slate-300`}>
          로그아웃
        </button>
      </div>
    )
  }

  return <Dashboard user={user} />
}

export default function AdminPage() {
  usePageMeta('관리자')

  // 검색엔진에 관리자 페이지가 노출되지 않도록
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])

  return (
    <>
      <PageHeader title="관리자" description="연구 업적·프로젝트·소식·프로필을 추가하고 수정합니다." />
      {isUsingFirestore ? (
        <AdminGate />
      ) : (
        <div role="alert" className="rounded-2xl bg-amber-50 p-6 text-amber-900 ring-1 ring-amber-200">
          <p className="font-semibold">Firebase가 연결되어 있지 않습니다.</p>
          <p className="mt-2 text-sm">
            .env.local (내 컴퓨터) 또는 Netlify 환경 변수에 VITE_FIREBASE_* 값을 넣어 주세요. 자세한 방법은 README를 참고하세요.
          </p>
          <Link to="/" className="mt-3 inline-block text-sm font-semibold underline">
            홈으로
          </Link>
        </div>
      )}
    </>
  )
}
