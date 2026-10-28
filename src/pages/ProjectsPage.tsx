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
    <article className="flex flex-col rounded-lg border border-slate-200 p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            ongoing ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-700 ring-1 ring-slate-300'
          }`}
        >
          {projectStatusLabel[project.status]}
        </span>
        <span className="text-sm tabular-nums text-slate-600">{formatPeriod(project.startDate, project.endDate)}</span>
      </div>
      <h2 className="mt-3 text-lg font-bold leading-snug text-brand-900">{project.title}</h2>
      <p className="mt-1 text-sm text-slate-600">
        <span className="sr-only">지원기관: </span>
        {project.funder}
      </p>
      <p className="mt-4 leading-relaxed text-slate-700">{project.summary}</p>
      {related.length > 0 && (
        <div className="mt-5 border-t border-slate-200 pt-4">
          <h3 className="text-sm font-semibold text-slate-500">관련 연구 업적</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {related.map((p) => (
              <li key={p.id}>
                <Link
                  to={`/publications?tab=${tabKeyOf(p)}&q=${encodeURIComponent(p.title)}`}
                  className="text-brand-700 underline underline-offset-2 hover:text-brand-900"
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
