/**
 * ==============================================================
 *  연구 업적 — 논문·저서·발표·연구비 목록
 * ==============================================================
 *  이 목록에 항목을 추가하면 "연구 업적" 페이지에 APA 7판 형식으로 자동 표시됩니다.
 *  (순서는 상관없습니다. 화면에서 연도 내림차순으로 자동 정렬됩니다.)
 *
 *  ▶ 새 논문 추가하는 법
 *    1. 아래에서 비슷한 유형의 { ... }, 블록 하나를 통째로 복사합니다.
 *    2. 목록 맨 위([ 바로 아래)에 붙여 넣고 내용을 바꿉니다.
 *    3. id 는 다른 항목과 겹치지 않게 (예: 'kim-2026-emotion').
 *
 *  ▶ type (유형)
 *    'journal' 학술지 논문 | 'book' 저서 | 'chapter' 책의 챕터
 *    'conference' 학술대회 발표 | 'grant' 연구비 수주
 *
 *  ▶ 자주 쓰는 항목
 *    authors   : ['Kim, S.', 'Lee, J.-H.'] 처럼 APA 표기 그대로, 순서대로.
 *                내 이름은 profile.ts 의 authorNames 와 똑같이 적어야 굵게 표시됩니다.
 *    title     : APA 규칙상 영어 제목은 문장형 대소문자(첫 글자·고유명사만 대문자)로.
 *    venue     : 학술지명 / 출판사 / 학술대회명 / 지원기관
 *    doi       : '10.xxxx/....' (https://doi.org/ 는 빼고)
 *    pdfUrl    : PDF를 public/papers/ 에 넣고 '/papers/파일명.pdf'
 *    osfUrl    : OSF 프로젝트 주소
 *    preregistered / openData / openMaterials : 해당하면 true (배지 표시)
 *    featured  : true 이면 홈 화면 "대표 논문"에 표시 (3편 권장)
 *    필요 없는 줄은 통째로 지워도 됩니다.
 *
 *  ※ 지금 들어 있는 내용은 모두 샘플입니다. DOI(10.5555/...)는 예시용 가짜 번호입니다.
 * ==============================================================
 */
import type { Publication } from '../types'

export const publications: Publication[] = [
  // ───────────── 학술지 논문 (journal) ─────────────
  {
    id: 'kim-2026-emotion',
    type: 'journal',
    authors: ['Kim, S.', 'Park, J.', 'Lee, H.', 'Choi, Y.'],
    year: 2026,
    title: 'Emotion regulation strategy diversity in daily life and depressive symptoms in adolescents: An experience sampling study',
    venue: 'Emotion',
    volume: '26',
    issue: '4',
    pages: '812–826',
    doi: '10.5555/sample.emotion.2026.0412',
    pdfUrl: '/papers/sample-paper.pdf',
    osfUrl: 'https://osf.io/',
    preregistered: true,
    openData: true,
    openMaterials: true,
    keywords: ['emotion regulation', 'ESM', 'adolescence', 'depression', '정서조절'],
    featured: true,
    abstract: '청소년 212명을 대상으로 14일간 경험표집을 실시하여 정서조절 전략의 다양성과 우울 증상의 관계를 검증하였다.',
  },
  {
    id: 'lee-2025-jad',
    type: 'journal',
    authors: ['Lee, H.', 'Kim, S.'],
    year: 2025,
    title: 'A smartphone-based emotion regulation intervention for adolescents with elevated anxiety: A randomized controlled trial',
    venue: 'Journal of Adolescent Health',
    volume: '77',
    issue: '2',
    pages: '245–254',
    doi: '10.5555/sample.jah.2025.0221',
    osfUrl: 'https://osf.io/',
    preregistered: true,
    openMaterials: true,
    keywords: ['digital intervention', 'RCT', 'anxiety', '디지털 개입'],
    featured: true,
  },
  {
    id: 'kim-2025-kjcp',
    type: 'journal',
    authors: ['김서연', '박지훈', '최유진'],
    year: 2025,
    title: '청소년의 반추와 우울의 관계: 정서 인식 명확성의 조절효과',
    venue: '한국심리학회지: 임상심리 연구와 실제',
    volume: '11',
    issue: '1',
    pages: '45–68',
    doi: '10.5555/sample.kjcp.2025.11.1.45',
    keywords: ['반추', '우울', '정서 인식', 'rumination'],
  },
  {
    id: 'park-2024-cpr',
    type: 'journal',
    authors: ['Park, J.', 'Choi, Y.', 'Kim, S.'],
    year: 2024,
    title: 'Momentary affect dynamics as predictors of depression onset: A two-year longitudinal study',
    venue: 'Clinical Psychological Science',
    volume: '12',
    issue: '5',
    pages: '1003–1019',
    doi: '10.5555/sample.cps.2024.0517',
    osfUrl: 'https://osf.io/',
    openData: true,
    keywords: ['affect dynamics', 'longitudinal', 'depression'],
    featured: true,
  },
  {
    id: 'kim-2023-bjp',
    type: 'journal',
    authors: ['Kim, S.', 'Gross, J. J.'],
    year: 2023,
    title: 'Cultural context and the perceived efficacy of emotion regulation strategies',
    venue: 'Cognition and Emotion',
    volume: '37',
    issue: '3',
    pages: '512–527',
    doi: '10.5555/sample.cogemo.2023.0309',
    keywords: ['culture', 'emotion regulation', 'reappraisal'],
  },
  {
    id: 'choi-2022-pid',
    type: 'journal',
    authors: ['Choi, Y.', 'Kim, S.'],
    year: 2022,
    title: 'Validation of the Korean version of the Emotion Regulation Questionnaire for Children and Adolescents',
    venue: 'Personality and Individual Differences',
    volume: '189',
    pages: 'Article 111502',
    doi: '10.5555/sample.paid.2022.111502',
    openMaterials: true,
    keywords: ['validation', 'measurement', 'ERQ-CA', '척도 타당화'],
  },

  // ───────────── 저서 (book) · 챕터 (chapter) ─────────────
  {
    id: 'kim-2024-book',
    type: 'book',
    authors: ['김서연'],
    year: 2024,
    title: '청소년의 마음 읽기: 정서조절 발달의 이해',
    venue: '○○출판사',
    keywords: ['정서조절', '청소년', '교재'],
  },
  {
    id: 'kim-2023-chapter',
    type: 'chapter',
    authors: ['Kim, S.', 'Park, J.'],
    year: 2023,
    title: 'Experience sampling methods in developmental psychopathology',
    editors: ['M. Lee', 'T. Brown'],
    bookTitle: 'Handbook of intensive longitudinal methods in clinical psychology',
    pages: '211–234',
    venue: 'Academic Press',
    doi: '10.5555/sample.chapter.2023.11',
    keywords: ['ESM', 'methods', 'developmental psychopathology'],
  },

  // ───────────── 학술대회 발표 (conference) ─────────────
  {
    id: 'kim-2026-sps',
    type: 'conference',
    authors: ['Kim, S.', 'Lee, H.'],
    year: 2026,
    month: 'May',
    title: 'Who benefits from digital emotion regulation training? Moderators of treatment response',
    presentationType: 'Paper presentation',
    venue: 'Association for Psychological Science Annual Convention',
    location: 'Washington, DC, United States',
    osfUrl: 'https://osf.io/',
    keywords: ['digital intervention', 'moderators'],
  },
  {
    id: 'choi-2025-kpa',
    type: 'conference',
    authors: ['최유진', '김서연'],
    year: 2025,
    month: 'August',
    title: '청소년 정서조절 질문지의 측정 동일성 검증',
    presentationType: 'Poster presentation',
    venue: '한국심리학회 연차학술대회',
    location: '서울',
    keywords: ['측정 동일성', '정서조절'],
  },
  {
    id: 'kim-2024-sras',
    type: 'conference',
    authors: ['Kim, S.', 'Park, J.', 'Choi, Y.'],
    year: 2024,
    month: 'April',
    title: 'Daily emotion regulation in Korean adolescents: Findings from a 14-day ESM study',
    presentationType: 'Poster presentation',
    venue: 'Society for Research on Adolescence Biennial Meeting',
    location: 'Chicago, IL, United States',
    keywords: ['ESM', 'adolescence'],
  },

  // ───────────── 연구비 수주 (grant) ─────────────
  {
    id: 'grant-2026-nrf',
    type: 'grant',
    authors: ['Kim, S.'],
    year: 2026,
    endYear: 2029,
    title: '청소년 정서조절 디지털 개입의 효과 검증 및 확산 연구',
    venue: '한국연구재단 중견연구자지원사업',
    grantNumber: 'NRF-2026-XXXXXX',
    role: '연구책임자',
    keywords: ['디지털 개입', '청소년'],
  },
  {
    id: 'grant-2023-nrf',
    type: 'grant',
    authors: ['Kim, S.'],
    year: 2023,
    endYear: 2026,
    title: '경험표집법을 활용한 청소년 우울 발병 예측 모형 개발',
    venue: '한국연구재단 신진연구자지원사업',
    grantNumber: 'NRF-2023-XXXXXX',
    role: '연구책임자',
    keywords: ['ESM', '우울', '예측'],
  },
  {
    id: 'grant-2021-univ',
    type: 'grant',
    authors: ['Kim, S.'],
    year: 2021,
    endYear: 2022,
    title: '대학생 정서조절 전략 사용의 문화적 차이',
    venue: '○○대학교 교내연구비',
    role: '연구책임자',
    keywords: ['문화', '정서조절'],
  },
]
