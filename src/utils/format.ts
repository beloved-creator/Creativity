import type { ProjectStatus, PublicationType } from '../types'

/** '2026-09-15' → '2026. 9. 15.' */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m) return iso
  return d ? `${y}. ${m}. ${d}.` : `${y}. ${m}.`
}

/** '2024-03' → '2024. 3.' */
export function formatYearMonth(ym: string): string {
  return formatDate(ym)
}

export function formatPeriod(start: string, end?: string): string {
  return `${formatYearMonth(start)} – ${end ? formatYearMonth(end) : '현재'}`
}

export const projectStatusLabel: Record<ProjectStatus, string> = {
  ongoing: '진행 중',
  completed: '완료',
}

/** 연구 업적 페이지의 탭 구성 (탭 하나에 여러 유형을 묶을 수 있음) */
export const publicationTabs: { key: string; label: string; types: PublicationType[] }[] = [
  { key: 'journal', label: '학술지 논문', types: ['journal'] },
  { key: 'book', label: '저서·챕터', types: ['book', 'chapter'] },
  { key: 'conference', label: '학술대회 발표', types: ['conference'] },
  { key: 'grant', label: '연구비 수주', types: ['grant'] },
]
