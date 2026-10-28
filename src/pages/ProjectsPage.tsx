import { Link } from 'react-router'
import AsyncBoundary from '../components/AsyncBoundary'
import PageHeader from '../components/PageHeader'
import { useAsyncData } from '../hooks/useAsyncData'
import { usePageMeta } from '../hooks/usePageMeta'
import { getProjects, getPublications } from '../services/dataService'
import type { Project, Publication } from '../types'
import { formatPeriod, projectStatusLabel, publicationTabs } from '../utils/format'

const loadPage = () => Promise.all([getProjects(), getPublications()])

function tabKeyOf(p: Publication): string {
  return publicationTabs.find((t) => t.types.includes(p.type))?.key ?? 'journal'
}

function ProjectCard({ project, pubsById }: { project: Project; pubsById: Map<string, Publication> }) {
  const related = (project.relatedPublicationIds ?? [])
    .map((id) => pubsById.get(id))
    .filter((p): p is Publication => p !== undefined)
  const ongoing = project.status === 'ongoing'

  return (
    <article className="group relative flex animate-fade-up flex-col overflow-hidden rounded-2xl bg-white p-6 pt-7 shadow-lg shadow-slate-900/5 ring-1 ring-slate-200 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-accent-600/15 hover:ring-accent-200">
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-sky-400 via-accent-500 to-pink-500" />
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
            ongoing ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-300' : 'bg-slate-100 text-slate-700 ring-1 ring-slate-300'
          }`}
        >
          {ongoing && (
            <span aria-hidden="true" className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
          )}
          {projectStatusLabel[project.status]}
        </span>
        <span className="text-sm tabular-nums text-slate-600">{formatPeriod(project.startDate, project.endDate)}</span>
      </div>
      <h2 className="mt-4 text-xl font-extrabold leading-snug text-slate-900 transition-colors group-hover:text-accent-700">{project.title}</h2>
      <p className="mt-2 inline-flex w-fit rounded-lg bg-accent-50 px-2.5 py-1 text-sm font-medium text-accent-700">
        <span className="sr-only">지원기관: </span>
        {project.funder}
      </p>
      <p className="mt-4 leading-relaxed text-slate-700">{project.summary}</p>
      {related.length > 0 && (
        <div className="mt-5 rounded-xl bg-slate-50 p-4">
          <h3 className="text-sm font-semibold text-slate-500">관련 연구 업적</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {related.map((p) => (
              <li key={p.id}>
                <Link
                  to={`/publications?tab=${tabKeyOf(p)}&q=${encodeURIComponent(p.title)}`}
                  className="font-medium text-brand-800 underline decoration-accent-200 underline-offset-2 hover:text-accent-700 hover:decoration-accent-600"
                >
                  {p.title}
                </Link>
                <span className="text-slate-500"> ({p.year})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  )
}

export default function ProjectsPage() {
  usePageMeta('연구 프로젝트', '진행 중이거나 완료된 연구 프로젝트 목록')
  const state = useAsyncData(loadPage)

  return (
    <>
      <PageHeader title="연구 프로젝트" description="진행 중이거나 완료된 연구 과제입니다." />
      <AsyncBoundary state={state} loadingLabel="프로젝트를 불러오는 중…">
        {([projects, pubs]) => {
          const pubsById = new Map(pubs.map((p) => [p.id, p]))
          return projects.length === 0 ? (
            <p className="text-slate-600">등록된 프로젝트가 없습니다.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} pubsById={pubsById} />
              ))}
            </div>
          )
        }}
      </AsyncBoundary>
    </>
  )
}
