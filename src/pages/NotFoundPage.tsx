import { Link } from 'react-router'
import { usePageMeta } from '../hooks/usePageMeta'

export default function NotFoundPage() {
  usePageMeta('페이지를 찾을 수 없습니다')
  return (
    <div className="py-16 text-center">
      <p className="text-gradient animate-fade-up text-8xl font-black tracking-tight sm:text-9xl">404</p>
      <h1 className="mt-4 text-3xl font-extrabold text-slate-900">페이지를 찾을 수 없습니다</h1>
      <p className="mt-4 text-slate-600">주소가 바뀌었거나 삭제된 페이지입니다.</p>
      <Link to="/" className="bg-hero mt-8 inline-block rounded-full px-6 py-3 font-bold text-white shadow-lg shadow-accent-600/30 transition-transform hover:-translate-y-0.5">
        홈으로 돌아가기
      </Link>
    </div>
  )
}
