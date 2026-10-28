/** 교수 프로필 정보 */
export interface ExternalLink {
  /** 화면에 보일 이름 (예: "Google Scholar") */
  label: string
  url: string
}

export interface Profile {
  /** Firestore 문서 ID로 사용할 예정 */
  id: string
  nameKo: string
  nameEn: string
  position: string
  affiliation: string
  /** 사진 경로 (예: "/images/profile.jpg"). 비워 두면 기본 이미지가 표시됩니다. */
  photoUrl?: string
  /** 홈 화면의 짧은 소개 (문단별로 나눔) */
  bio: string[]
  researchInterests: string[]
  email: string
  office: string
  /** 연락처 페이지의 면담 안내 문구 (문단별로 나눔) */
  officeHoursNote: string[]
  /**
   * 논문 저자 목록에서 굵게 표시할 본인 이름 표기들.
   * publications.ts 의 authors 에 적은 표기와 정확히 같아야 합니다.
   */
  authorNames: string[]
  links?: ExternalLink[]
}
