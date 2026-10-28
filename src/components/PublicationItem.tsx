import type { Publication } from '../types'
import { doiUrl, formatApa } from '../utils/apa'
import ApaCitation from './ApaCitation'
import CopyCitationButton from './CopyCitationButton'
import OpenScienceBadges from './OpenScienceBadges'

interface Props {
  publication: Publication
  /** 굵게 표시할 교수 본인 이름 표기 (profile.authorNames) */
  highlightNames: string[]
  /** 초록 펼쳐보기 표시 여부 */
  showAbstract?: boolean
}

const linkClass =
  'inline-flex items-center rounded-full border border-accent-200 bg-accent-50 px-3 py-1 text-xs font-bold text-accent-700 transition-colors hover:border-accent-600 hover:bg-accent-600 hover:text-white'

export default function PublicationItem({ publication: p, highlightNames, showAbstract = true }: Props) {
  const segments = formatApa(p, highlightNames)
  return (
    <article className="space-y-3">
      <p className="pl-8 -indent-8 leading-relaxed text-slate-800">
        <ApaCitation segments={segments} />
      </p>
      <OpenScienceBadges publication={p} />
      <div className="flex flex-wrap items-center gap-2">
        {p.doi && (
          <a href={doiUrl(p.doi)} target="_blank" rel="noopener noreferrer" className={linkClass}>
            DOI<span className="sr-only"> (새 창): {p.title}</span>
          </a>
        )}
        {p.pdfUrl && (
          <a href={p.pdfUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
            PDF<span className="sr-only"> (새 창): {p.title}</span>
          </a>
        )}
        {p.osfUrl && (
          <a href={p.osfUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
            OSF<span className="sr-only"> (새 창): {p.title}</span>
          </a>
        )}
        <CopyCitationButton segments={segments} />
      </div>
      {showAbstract && p.abstract && (
        <details className="text-sm text-slate-700">
          <summary className="cursor-pointer select-none font-medium text-slate-600 hover:text-accent-700">초록 보기</summary>
          <p className="mt-2 leading-relaxed">{p.abstract}</p>
        </details>
      )}
    </article>
  )
}
