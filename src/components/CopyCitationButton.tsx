import { useEffect, useState } from 'react'
import { apaToHtml, apaToPlainText, type ApaSegment } from '../utils/apa'
import { copyToClipboard } from '../utils/clipboard'

type Status = 'idle' | 'copied' | 'failed'

export default function CopyCitationButton({ segments }: { segments: ApaSegment[] }) {
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    if (status === 'idle') return
    const timer = window.setTimeout(() => setStatus('idle'), 2000)
    return () => window.clearTimeout(timer)
  }, [status])

  const handleClick = async () => {
    const ok = await copyToClipboard(apaToPlainText(segments), apaToHtml(segments))
    setStatus(ok ? 'copied' : 'failed')
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 rounded border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-brand-600 hover:text-brand-700"
    >
      <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="5" y="5" width="8.5" height="8.5" rx="1.5" />
        <path d="M3 10.5V3.5A1 1 0 0 1 4 2.5h6.5" />
      </svg>
      <span aria-live="polite">
        {status === 'copied' ? '복사되었습니다' : status === 'failed' ? '복사 실패' : 'APA 인용 복사'}
      </span>
    </button>
  )
}
