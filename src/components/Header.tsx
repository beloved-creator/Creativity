import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router'
import { siteConfig } from '../siteConfig'

const navItems = [
  { to: '/', label: '홈', end: true },
  { to: '/publications', label: '연구 업적' },
  { to: '/projects', label: '연구 프로젝트' },
  { to: '/board', label: '게시판' },
  { to: '/contact', label: '연락처' },
]

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-full px-4 py-2 text-[15px] font-semibold transition-all ${
    isActive
      ? 'bg-hero text-white shadow-md shadow-accent-600/30'
      : 'text-slate-700 hover:bg-accent-50 hover:text-accent-700'
  }`

export default function Header() {
  const [open, setOpen] = useState(false)

  // Esc 키로 모바일 메뉴 닫기
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/70 shadow-sm shadow-slate-900/5 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="group flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span
            aria-hidden="true"
            className="bg-hero flex h-9 w-9 items-center justify-center rounded-xl font-serif text-lg text-white shadow-md shadow-accent-600/30 transition-transform group-hover:rotate-6"
          >
            Ψ
          </span>
          <span className="text-gradient text-lg font-extrabold tracking-tight">{siteConfig.siteName}</span>
        </Link>

        {/* 데스크톱 메뉴 */}
        <nav aria-label="주 메뉴" className="hidden md:block">
          <ul className="flex gap-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} className={linkClass}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* 모바일 햄버거 버튼 */}
        <button
          type="button"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-slate-700 hover:bg-accent-50 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
          onClick={() => setOpen((v) => !v)}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="모바일 메뉴" className="border-t border-slate-200/70 bg-white/95 backdrop-blur-xl md:hidden">
          <ul className="mx-auto max-w-5xl space-y-1 px-4 py-3">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} className={linkClass} onClick={() => setOpen(false)}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
