/** 공지 게시판 글 (관리자만 작성) */
export interface Post {
  /** Firestore 문서 ID */
  id: string
  title: string
  /** 'YYYY-MM-DD' 형식 */
  date: string
  /** 본문. 줄바꿈은 그대로 표시됩니다. */
  body: string
  /** true 이면 목록 맨 위에 고정 */
  pinned?: boolean
}
