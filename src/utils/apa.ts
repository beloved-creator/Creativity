/**
 * APA 7판 인용 서식 함수
 *
 * ──────────────────────────────────────────────────────────────
 *  [데이터 수정 안내] 이 파일은 고칠 필요가 없습니다!
 *  논문을 추가·수정하려면 src/data/publications.ts 를 여세요.
 *   - authors 는 'Kim, S.' 처럼 APA 표기 그대로 적습니다. (이 함수가 이름을 바꾸지 않습니다)
 *   - 굵게 표시할 내 이름은 src/data/profile.ts 의 authorNames 에 적습니다.
 *   - 영어 제목은 APA 규칙대로 문장형 대소문자로 적어 주세요. (자동 변환하지 않습니다)
 *   - doi 는 '10.xxxx/...' 만 적으면 https://doi.org/ 주소로 자동 변환됩니다.
 * ──────────────────────────────────────────────────────────────
 *
 * 서식 결과는 "조각(segment)" 배열로 돌려줍니다.
 * 화면에서는 조각마다 기울임(학술지명·권호 등)과 굵게(본인 이름)를 적용하고,
 * 인용 복사 시에는 같은 조각으로 일반 텍스트와 서식 있는 HTML을 만듭니다.
 */
import type { Publication } from '../types'

export interface ApaSegment {
  text: string
  italic?: boolean
  bold?: boolean
  /** 링크가 걸린 조각 (DOI/URL) */
  href?: string
}

const DOI_BASE = 'https://doi.org/'

export function doiUrl(doi: string): string {
  return doi.startsWith('http') ? doi : DOI_BASE + doi.replace(/^doi:\s*/i, '')
}

/** 문장 끝에 마침표가 없으면 붙입니다. (제목이 ? 나 ! 로 끝나면 그대로) */
function endWithPeriod(text: string): string {
  return /[.?!]$/.test(text.trim()) ? text.trim() : `${text.trim()}.`
}

const HANGUL = /[\uac00-\ud7a3]/

/** 저자가 모두 한글 이름이면 한국심리학회 방식(& 없이 쉼표로 나열)을 사용합니다. */
function isKoreanAuthorList(authors: string[]): boolean {
  return authors.length > 0 && authors.every((a) => HANGUL.test(a))
}

/**
 * 저자 목록을 APA 7판 규칙으로 나열합니다.
 * 1명: A / 2명: A, & B / 3–20명: A, B, & C / 21명 이상: 앞 19명, . . . 마지막 저자
 * 한글 저자: 김서연, 박지훈, 최유진
 */
export function formatAuthors(authors: string[], highlight: string[] = []): ApaSegment[] {
  const truncated = authors.length > 20
  const names = truncated ? [...authors.slice(0, 19), authors[authors.length - 1]] : authors
  const korean = isKoreanAuthorList(authors)
  const segments: ApaSegment[] = []
  names.forEach((name, i) => {
    if (i > 0) {
      const isLast = i === names.length - 1
      if (truncated && isLast) segments.push({ text: ', . . . ' })
      else if (isLast && !korean) segments.push({ text: ', & ' })
      else segments.push({ text: ', ' })
    }
    segments.push(highlight.includes(name) ? { text: name, bold: true } : { text: name })
  })
  return segments
}

/** 저자 뒤 마침표: 이니셜로 끝나 이미 '.'이 있거나 한글 저자면 생략 */
function authorsBlock(p: Publication, highlight: string[]): ApaSegment[] {
  const segs = formatAuthors(p.authors, highlight)
  const last = p.authors[p.authors.length - 1] ?? ''
  if (!last.endsWith('.') && !isKoreanAuthorList(p.authors)) segs.push({ text: '.' })
  return segs
}

function doiOrUrl(p: Publication): ApaSegment[] {
  if (p.doi) return [{ text: ' ' }, { text: doiUrl(p.doi), href: doiUrl(p.doi) }]
  if (p.url) return [{ text: ' ' }, { text: p.url, href: p.url }]
  return []
}

function formatJournal(p: Publication, h: string[]): ApaSegment[] {
  const segs: ApaSegment[] = [...authorsBlock(p, h), { text: ` (${p.year}). ${endWithPeriod(p.title)} ` }]
  segs.push({ text: p.venue, italic: true })
  if (p.volume) {
    segs.push({ text: ', ' }, { text: p.volume, italic: true })
    if (p.issue) segs.push({ text: `(${p.issue})` })
  }
  if (p.pages) segs.push({ text: `, ${p.pages}` })
  segs.push({ text: '.' })
  return [...segs, ...doiOrUrl(p)]
}

function formatBook(p: Publication, h: string[]): ApaSegment[] {
  const title = p.edition ? `${p.title} (${p.edition} ed.)` : p.title
  return [
    ...authorsBlock(p, h),
    { text: ` (${p.year}). ` },
    { text: endWithPeriod(title), italic: true },
    { text: ` ${endWithPeriod(p.venue)}` },
    ...doiOrUrl(p),
  ]
}

function formatChapter(p: Publication, h: string[]): ApaSegment[] {
  const segs: ApaSegment[] = [...authorsBlock(p, h), { text: ` (${p.year}). ${endWithPeriod(p.title)} ` }]
  if (p.editors?.length) {
    const eds =
      p.editors.length === 1
        ? p.editors[0]
        : p.editors.length === 2
          ? `${p.editors[0]} & ${p.editors[1]}`
          : `${p.editors.slice(0, -1).join(', ')}, & ${p.editors[p.editors.length - 1]}`
    segs.push({ text: `In ${eds} (${p.editors.length > 1 ? 'Eds.' : 'Ed.'}), ` })
  } else {
    segs.push({ text: 'In ' })
  }
  segs.push({ text: p.bookTitle ?? '', italic: true })
  if (p.pages) segs.push({ text: ` (pp. ${p.pages})` })
  segs.push({ text: `. ${endWithPeriod(p.venue)}` })
  return [...segs, ...doiOrUrl(p)]
}

function formatConference(p: Publication, h: string[]): ApaSegment[] {
  const date = p.month ? `${p.year}, ${p.month}` : `${p.year}`
  const kind = p.presentationType ? ` [${p.presentationType}]` : ''
  const where = p.location ? `${p.venue}, ${p.location}` : p.venue
  return [
    ...authorsBlock(p, h),
    { text: ` (${date}). ` },
    { text: p.title.replace(/\.$/, ''), italic: true },
    { text: `${kind}. ${endWithPeriod(where)}` },
    ...doiOrUrl(p),
  ]
}

/** 연구비: APA에 정해진 형식이 없어 APA 스타일을 따라 표시합니다. */
function formatGrant(p: Publication, h: string[]): ApaSegment[] {
  const period = p.endYear ? `${p.year}–${p.endYear}` : `${p.year}–현재`
  const extra = [p.role, p.grantNumber].filter(Boolean).join(', ')
  return [
    ...authorsBlock(p, h),
    { text: ` (${period}). ` },
    { text: p.title.replace(/\.$/, ''), italic: true },
    { text: `${extra ? ` [${extra}]` : ''}. ${endWithPeriod(p.venue)}` },
    ...doiOrUrl(p),
  ]
}

/** 연구 업적 하나를 APA 7판 조각 배열로 변환합니다. highlight: 굵게 표시할 이름들 */
export function formatApa(p: Publication, highlight: string[] = []): ApaSegment[] {
  switch (p.type) {
    case 'journal':
      return formatJournal(p, highlight)
    case 'book':
      return formatBook(p, highlight)
    case 'chapter':
      return formatChapter(p, highlight)
    case 'conference':
      return formatConference(p, highlight)
    case 'grant':
      return formatGrant(p, highlight)
  }
}

/** 복사용 일반 텍스트 */
export function apaToPlainText(segments: ApaSegment[]): string {
  return segments.map((s) => s.text).join('')
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** 복사용 HTML (워드·한글에 붙여 넣으면 기울임이 유지됨). 본인 이름 굵게는 복사하지 않습니다. */
export function apaToHtml(segments: ApaSegment[]): string {
  return segments
    .map((s) => {
      const t = escapeHtml(s.text)
      return s.italic ? `<i>${t}</i>` : t
    })
    .join('')
}
