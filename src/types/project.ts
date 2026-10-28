export type ProjectStatus = 'ongoing' | 'completed'

export interface Project {
  /** Firestore 문서 ID로 사용할 예정 */
  id: string
  title: string
  /** 시작 (예: "2024-03") */
  startDate: string
  /** 종료 (예: "2027-02"). 진행 중이고 미정이면 생략 */
  endDate?: string
  funder: string
  status: ProjectStatus
  summary: string
  /** 관련 논문의 id 목록 (publications.ts 의 id) */
  relatedPublicationIds?: string[]
}
