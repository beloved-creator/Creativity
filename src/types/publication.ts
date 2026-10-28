/**
 * 연구 업적 유형
 * - journal: 학술지 논문
 * - book: 저서 (책 전체)
 * - chapter: 책의 한 챕터
 * - conference: 학술대회 발표
 * - grant: 연구비 수주
 */
export type PublicationType = 'journal' | 'book' | 'chapter' | 'conference' | 'grant'

export interface Publication {
  /** Firestore 문서 ID로 사용할 예정 — 다른 항목과 겹치지 않게 */
  id: string
  type: PublicationType
  /** APA 표기 그대로 (예: "Kim, S.", "Lee, J.-H.", "김서연") */
  authors: string[]
  year: number
  title: string
  /** 학술지명 / 출판사 / 학술대회명 / 지원기관 */
  venue: string
  volume?: string
  issue?: string
  pages?: string
  /** "10.xxxx/..." 형태 (https://doi.org/ 는 빼고) */
  doi?: string
  url?: string
  /** public/papers/ 에 넣은 파일 경로 (예: "/papers/kim-2025.pdf") */
  pdfUrl?: string
  osfUrl?: string
  preregistered?: boolean
  openData?: boolean
  openMaterials?: boolean
  keywords?: string[]
  /** true 이면 홈 화면 "대표 논문"에 표시 */
  featured?: boolean
  abstract?: string

  // ---- 유형별 추가 정보 (해당할 때만) ----
  /** 챕터: 편집자 (예: ["J. Smith", "K. Lee"]) */
  editors?: string[]
  /** 챕터: 책 제목 */
  bookTitle?: string
  /** 저서: 판 (예: "2nd") */
  edition?: string
  /** 학술대회: 개최 월 (예: "May") */
  month?: string
  /** 학술대회: 발표 형식 (예: "Paper presentation", "Poster presentation") */
  presentationType?: string
  /** 학술대회: 개최 장소 (예: "Seoul, South Korea") */
  location?: string
  /** 연구비: 종료 연도 (진행 중이면 생략) */
  endYear?: number
  /** 연구비: 과제 번호 */
  grantNumber?: string
  /** 연구비: 역할 (예: "연구책임자") */
  role?: string
}
