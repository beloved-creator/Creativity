import { Link } from 'react-router'
import { usePageMeta } from '../hooks/usePageMeta'

export default function NotFoundPage() {
  usePageMeta('페이지를 찾을 수 없습니다')
  return (
    <div className="py-16 text-center">
      <p className="text-sm font-semibold tracking-widest text-brand-600">404</p>
      <h1 className="mt-2 text-3xl font-bold text-brand-900">페이지를 찾을 수 없습니다</h1>
      <p className="mt-4 text-slate-600">주소가 바뀌었거나 삭제된 페이지입니다.</p>
      <Link to="/" className="mt-8 inline-block rounded bg-brand-700 px-5 py-2.5 font-semibold text-white hover:bg-brand-800">
        홈으로 돌아가기
      </Link>
    </div>
  )
}
