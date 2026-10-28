/**
 * ==============================================================
 *  연구 프로젝트 — "연구 프로젝트" 페이지에 카드로 표시됩니다.
 *  ★ Firebase 연결 후에는 사이트 주소/admin 의 관리자 페이지에서 수정하세요.
 *    이 파일은 처음 한 번 Firestore로 옮길 때(관리자 → 데이터 가져오기)와
 *    Firebase 설정이 없을 때(내 컴퓨터 미리보기)만 쓰입니다.
 * ==============================================================
 *  새 프로젝트 추가: { ... }, 블록 하나를 복사해 붙이고 내용을 바꾸세요.
 *  - id: 다른 프로젝트와 겹치지 않는 영문/숫자
 *  - startDate / endDate: 'YYYY-MM' 형식 (종료일 미정이면 endDate 줄 삭제)
 *  - status: 'ongoing'(진행 중) 또는 'completed'(완료)
 *  - relatedPublicationIds: 관련 논문의 id (publications.ts 에 있는 id) 목록
 *  ※ 지금 내용은 샘플입니다.
 * ==============================================================
 */
import type { Project } from '../types'

export const projects: Project[] = [
  {
    id: 'proj-digital-er',
    title: '청소년 정서조절 디지털 개입의 효과 검증',
    startDate: '2026-09',
    endDate: '2029-08',
    funder: '한국연구재단 중견연구자지원사업',
    status: 'ongoing',
    summary:
      '스마트폰 기반 정서조절 훈련 프로그램을 학교 현장에 적용하여 효과와 지속성을 검증하고, 개입 효과가 큰 청소년의 특성을 규명합니다.',
    relatedPublicationIds: ['lee-2025-jad', 'kim-2026-sps'],
  },
  {
    id: 'proj-esm-depression',
    title: '경험표집법을 활용한 청소년 우울 발병 예측',
    startDate: '2023-09',
    endDate: '2026-08',
    funder: '한국연구재단 신진연구자지원사업',
    status: 'completed',
    summary:
      '청소년 400여 명을 2년간 추적하며 일상 정서 변동성과 정서조절 전략 사용이 우울 발병을 예측하는지 검증하였습니다.',
    relatedPublicationIds: ['kim-2026-emotion', 'park-2024-cpr', 'kim-2024-sras'],
  },
  {
    id: 'proj-measurement',
    title: '한국판 청소년 정서조절 척도 개발 및 타당화',
    startDate: '2021-03',
    endDate: '2022-12',
    funder: '○○대학교 교내연구비',
    status: 'completed',
    summary:
      '국외 정서조절 척도를 한국 청소년에게 맞게 번안하고 신뢰도·타당도와 측정 동일성을 검증하였습니다.',
    relatedPublicationIds: ['choi-2022-pid', 'choi-2025-kpa'],
  },
]
