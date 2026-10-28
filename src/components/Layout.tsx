import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router'
import Footer from './Footer'
import Header from './Header'

export default function Layout() {
  const { pathname } = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const isFirstRender = useRef(true)

  // 페이지 이동 시 맨 위로 스크롤하고, 화면낭독기 사용자를 위해 본문으로 초점 이동
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    window.scrollTo(0, 0)
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname])

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">
      {/* 배경 장식: 흐릿한 컬러 원 (화면낭독기에서는 무시) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] overflow-hidden">
        <div className="absolute -top-32 -left-24 h-96 w-96 animate-float rounded-full bg-accent-200/60 blur-3xl" />
        <div className="absolute top-20 -right-24 h-[28rem] w-[28rem] animate-float rounded-full bg-indigo-200/60 blur-3xl [animation-delay:-4s]" />
        <div className="absolute top-72 left-1/3 h-72 w-72 animate-float rounded-full bg-sky-200/50 blur-3xl [animation-delay:-2s]" />
      </div>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-brand-700 focus:px-4 focus:py-2 focus:text-white"
      >
        본문 바로가기
      </a>
      <Header />
      <main id="main" ref={mainRef} tabIndex={-1} className="flex-1 outline-none">
        <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}
