import { Link } from 'react-router'

/** Firestore에 아직 데이터가 없을 때 보이는 안내 (오류가 아님) */
export default function SetupNotice() {
  return (
    <div role="status" className="rounded-2xl bg-amber-50 p-6 text-amber-950 ring-1 ring-amber-200">
      <p className="text-lg font-bold">아직 사이트에 내용이 없습니다.</p>
      <p className="mt-2 leading-relaxed">
        사이트 관리자라면 관리자 페이지에 로그인한 뒤 <strong>프로필</strong> 탭에서 프로필을 입력해 저장하거나,{' '}
        <strong>데이터 가져오기</strong> 탭에서 샘플 데이터를 한 번에 가져오세요.
      </p>
      <Link
        to="/admin"
        className="mt-4 inline-block rounded-full bg-amber-900 px-5 py-2 font-bold text-white hover:bg-amber-950"
      >
        관리자 페이지로 이동
      </Link>
    </div>
  )
}
