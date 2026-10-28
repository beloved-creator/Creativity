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
  'inline-flex items-center rounded border border-brand-200 bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-800 hover:border-brand-600 hover:bg-brand-100'

export default function PublicationItem({ publication: p, highlightNames, showAbstract = true }: Props) {
  const segments = formatApa(p, highlightNames)
  // 본문의 DOI 주소는 인용문 안에 이미 링크로 표시되므로, 버튼 영역에는 짧은 "DOI" 링크를 둡니다.
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
          <summary className="cursor-pointer select-none font-medium text-slate-600 hover:text-brand-700">초록 보기</summary>
          <p className="mt-2 leading-relaxed">{p.abstract}</p>
        </details>
      )}
    </article>
  )
}
