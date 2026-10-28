/**
 * 관리자 입력 폼의 항목 정의.
 * 화면에 보일 이름(label)과 도움말(help)을 바꾸고 싶으면 이 파일을 고치세요.
 */
import type { PublicationType } from '../../types'

export type FieldKind =
  | 'text' // 한 줄 글
  | 'textarea' // 여러 줄 글
  | 'number'
  | 'date' // YYYY-MM-DD
  | 'month' // YYYY-MM
  | 'checkbox'
  | 'select'
  | 'lines' // 한 줄에 하나씩 → 문자열 목록
  | 'links' // "이름 | 주소" 한 줄에 하나씩 → 링크 목록
  | 'pubRefs' // 연구 업적 선택 (체크박스)

export interface FieldDef {
  name: string
  label: string
  kind: FieldKind
  required?: boolean
  help?: string
  placeholder?: string
  options?: { value: string; label: string }[]
  /** 연구 업적: 이 유형일 때만 보이는 항목 */
  showFor?: PublicationType[]
}

export const publicationTypeOptions: { value: PublicationType; label: string }[] = [
  { value: 'journal', label: '학술지 논문' },
  { value: 'book', label: '저서' },
  { value: 'chapter', label: '책의 챕터' },
  { value: 'conference', label: '학술대회 발표' },
  { value: 'grant', label: '연구비 수주' },
]

export const publicationFields: FieldDef[] = [
  { name: 'type', label: '유형', kind: 'select', required: true, options: publicationTypeOptions },
  {
    name: 'authors',
    label: '저자',
    kind: 'lines',
    required: true,
    help: '한 줄에 한 명씩, 순서대로. APA 표기 그대로 (예: Kim, S.  /  김서연). 연구비는 연구책임자.',
  },
  { name: 'year', label: '연도', kind: 'number', required: true, help: '연구비는 시작 연도' },
  { name: 'endYear', label: '종료 연도', kind: 'number', showFor: ['grant'], help: '진행 중이면 비워 두세요' },
  { name: 'month', label: '발표 월 (영문)', kind: 'text', placeholder: 'May', showFor: ['conference'] },
  { name: 'title', label: '제목', kind: 'textarea', required: true, help: '영어 제목은 문장형 대소문자 (첫 글자·고유명사만 대문자)' },
  {
    name: 'venue',
    label: '학술지명 / 출판사 / 학술대회명 / 지원기관',
    kind: 'text',
    required: true,
  },
  { name: 'editors', label: '편집자', kind: 'lines', showFor: ['chapter'], help: '한 줄에 한 명 (예: M. Lee)' },
  { name: 'bookTitle', label: '책 제목', kind: 'text', showFor: ['chapter'] },
  { name: 'edition', label: '판', kind: 'text', placeholder: '2nd', showFor: ['book'] },
  { name: 'volume', label: '권 (Volume)', kind: 'text', showFor: ['journal'] },
  { name: 'issue', label: '호 (Issue)', kind: 'text', showFor: ['journal'] },
  { name: 'pages', label: '쪽', kind: 'text', placeholder: '812–826', showFor: ['journal', 'chapter'] },
  {
    name: 'presentationType',
    label: '발표 형식',
    kind: 'text',
    placeholder: 'Paper presentation / Poster presentation',
    showFor: ['conference'],
  },
  { name: 'location', label: '개최 장소', kind: 'text', placeholder: 'Seoul, South Korea', showFor: ['conference'] },
  { name: 'role', label: '역할', kind: 'text', placeholder: '연구책임자', showFor: ['grant'] },
  { name: 'grantNumber', label: '과제 번호', kind: 'text', showFor: ['grant'] },
  { name: 'doi', label: 'DOI', kind: 'text', placeholder: '10.1037/xxxx', help: 'https://doi.org/ 는 빼고 입력' },
  { name: 'url', label: '웹 주소 (DOI가 없을 때)', kind: 'text' },
  {
    name: 'pdfUrl',
    label: 'PDF 경로',
    kind: 'text',
    placeholder: '/papers/kim-2026.pdf',
    help: 'PDF는 GitHub 저장소의 public/papers/ 폴더에 올리고 경로만 입력합니다.',
  },
  { name: 'osfUrl', label: 'OSF 주소', kind: 'text' },
  { name: 'preregistered', label: '사전등록', kind: 'checkbox' },
  { name: 'openData', label: '공개 데이터', kind: 'checkbox' },
  { name: 'openMaterials', label: '공개 자료', kind: 'checkbox' },
  { name: 'featured', label: '홈 화면 대표 논문으로 표시', kind: 'checkbox' },
  { name: 'keywords', label: '키워드', kind: 'lines', help: '한 줄에 하나 (검색에 사용)' },
  { name: 'abstract', label: '초록', kind: 'textarea' },
]

export const projectFields: FieldDef[] = [
  { name: 'title', label: '프로젝트 제목', kind: 'text', required: true },
  {
    name: 'status',
    label: '상태',
    kind: 'select',
    required: true,
    options: [
      { value: 'ongoing', label: '진행 중' },
      { value: 'completed', label: '완료' },
    ],
  },
  { name: 'startDate', label: '시작', kind: 'month', required: true },
  { name: 'endDate', label: '종료', kind: 'month', help: '미정이면 비워 두세요' },
  { name: 'funder', label: '지원기관', kind: 'text', required: true },
  { name: 'summary', label: '요약', kind: 'textarea', required: true },
  { name: 'relatedPublicationIds', label: '관련 연구 업적', kind: 'pubRefs' },
]

export const newsFields: FieldDef[] = [
  { name: 'date', label: '날짜', kind: 'date', required: true },
  { name: 'title', label: '제목', kind: 'text', required: true },
  { name: 'body', label: '내용', kind: 'textarea' },
  { name: 'url', label: '관련 링크', kind: 'text' },
]

export const postFields: FieldDef[] = [
  { name: 'title', label: '제목', kind: 'text', required: true },
  { name: 'date', label: '날짜', kind: 'date', required: true },
  { name: 'body', label: '본문', kind: 'textarea', required: true, help: '줄바꿈은 그대로 표시됩니다.' },
  { name: 'pinned', label: '목록 맨 위에 고정 (공지)', kind: 'checkbox' },
]

export const profileFields: FieldDef[] = [
  { name: 'nameKo', label: '이름 (한글)', kind: 'text', required: true },
  { name: 'nameEn', label: '이름 (영문)', kind: 'text', required: true },
  { name: 'position', label: '직위', kind: 'text', required: true },
  { name: 'affiliation', label: '소속', kind: 'text', required: true },
  {
    name: 'photoUrl',
    label: '사진 경로',
    kind: 'text',
    placeholder: '/images/profile.jpg',
    help: '사진은 GitHub 저장소의 public/images/ 폴더에 올리고 경로만 입력합니다. 비우면 기본 그림.',
  },
  { name: 'bio', label: '소개', kind: 'lines', required: true, help: '한 줄 = 한 문단' },
  { name: 'researchInterests', label: '연구 관심 분야', kind: 'lines', required: true, help: '한 줄에 하나' },
  { name: 'email', label: '이메일', kind: 'text', required: true },
  { name: 'office', label: '연구실 위치', kind: 'text', required: true },
  { name: 'officeHoursNote', label: '면담 안내', kind: 'lines', required: true, help: '한 줄 = 한 문단' },
  {
    name: 'authorNames',
    label: '굵게 표시할 내 이름 표기',
    kind: 'lines',
    required: true,
    help: '논문 저자 목록에 쓴 표기와 똑같이, 한 줄에 하나 (예: Kim, S.  /  김서연)',
  },
  { name: 'links', label: '외부 링크', kind: 'links', help: '한 줄에 하나: 이름 | 주소  (예: ORCID | https://orcid.org/...)' },
]

// ───────────── 데이터 ↔ 폼 값 변환 ─────────────

export type FormValue = string | boolean | string[]
export type FormValues = Record<string, FormValue>

export function isFieldVisible(field: FieldDef, values: FormValues): boolean {
  return !field.showFor || field.showFor.includes(values.type as PublicationType)
}

/** 저장된 데이터 → 폼 입력값 */
export function toFormValues(item: object, fields: FieldDef[]): FormValues {
  const values: FormValues = {}
  for (const f of fields) {
    const v = (item as Record<string, unknown>)[f.name]
    switch (f.kind) {
      case 'checkbox':
        values[f.name] = v === true
        break
      case 'lines':
        values[f.name] = Array.isArray(v) ? v.join('\n') : ''
        break
      case 'links':
        values[f.name] = Array.isArray(v)
          ? (v as { label: string; url: string }[]).map((l) => `${l.label} | ${l.url}`).join('\n')
          : ''
        break
      case 'pubRefs':
        values[f.name] = Array.isArray(v) ? (v as string[]) : []
        break
      default:
        values[f.name] = v === undefined || v === null ? '' : String(v)
    }
  }
  return values
}

const splitLines = (s: string) =>
  s
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

/**
 * 폼 입력값 → 저장할 데이터. 빈 칸·숨겨진 항목은 저장하지 않습니다.
 * 필수 항목이 비었거나 숫자가 잘못되면 오류 메시지 목록을 돌려줍니다.
 */
export function fromFormValues(
  values: FormValues,
  fields: FieldDef[],
): { data: Record<string, unknown>; errors: string[] } {
  const data: Record<string, unknown> = {}
  const errors: string[] = []
  for (const f of fields) {
    if (!isFieldVisible(f, values)) continue
    const raw = values[f.name]
    let out: unknown
    switch (f.kind) {
      case 'checkbox':
        out = raw === true ? true : undefined
        break
      case 'lines': {
        const list = splitLines(String(raw ?? ''))
        out = list.length ? list : undefined
        break
      }
      case 'links': {
        const list = splitLines(String(raw ?? '')).map((line) => {
          const [label, ...rest] = line.split('|')
          return { label: label.trim(), url: rest.join('|').trim() }
        })
        if (list.some((l) => !l.label || !l.url)) errors.push(`${f.label}: "이름 | 주소" 형식으로 적어 주세요.`)
        out = list.length ? list : undefined
        break
      }
      case 'pubRefs': {
        const list = Array.isArray(raw) ? raw : []
        out = list.length ? list : undefined
        break
      }
      case 'number': {
        const s = String(raw ?? '').trim()
        if (s && !Number.isInteger(Number(s))) errors.push(`${f.label}: 숫자만 입력해 주세요.`)
        out = s ? Number(s) : undefined
        break
      }
      default: {
        const s = String(raw ?? '').trim()
        out = s || undefined
      }
    }
    if (f.required && out === undefined) errors.push(`${f.label}: 필수 항목입니다.`)
    if (out !== undefined) data[f.name] = out
  }
  return { data, errors }
}
