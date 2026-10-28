import type { Publication } from '../types'

const badges = [
  { key: 'preregistered', label: '사전등록', title: 'Preregistered: 연구 가설과 분석 계획을 사전에 등록함' },
  { key: 'openData', label: '공개 데이터', title: 'Open Data: 연구 데이터를 공개함' },
  { key: 'openMaterials', label: '공개 자료', title: 'Open Materials: 연구 자료(설문, 코드 등)를 공개함' },
] as const

export default function OpenScienceBadges({ publication }: { publication: Publication }) {
  const active = badges.filter((b) => publication[b.key])
  if (active.length === 0) return null
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="오픈 사이언스">
      {active.map((b) => (
        <li
          key={b.key}
          title={b.title}
          className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-300"
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor">
            <path d="M6.2 11.3 3 8.1l1.1-1.1 2.1 2.1 5.7-5.7L13 4.5z" />
          </svg>
          {b.label}
        </li>
      ))}
    </ul>
  )
}
