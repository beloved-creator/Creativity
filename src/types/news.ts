export interface NewsItem {
  /** Firestore 문서 ID로 사용할 예정 */
  id: string
  /** "YYYY-MM-DD" 형식 */
  date: string
  title: string
  body?: string
  url?: string
}
