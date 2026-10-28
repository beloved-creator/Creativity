import type { ReactNode } from 'react'
import type { ApaSegment } from '../utils/apa'

/** APA 서식 조각을 화면에 표시 (기울임·굵게·링크) */
export default function ApaCitation({ segments }: { segments: ApaSegment[] }) {
  return (
    <>
      {segments.map((s, i) => {
        let node: ReactNode = s.text
        if (s.italic) node = <i>{node}</i>
        if (s.bold) node = <strong className="font-semibold text-slate-900">{node}</strong>
        if (s.href)
          node = (
            <a href={s.href} target="_blank" rel="noopener noreferrer" className="break-all text-accent-700 underline decoration-accent-200 underline-offset-2 hover:decoration-accent-600">
              {node}
            </a>
          )
        return <span key={i}>{node}</span>
      })}
    </>
  )
}
