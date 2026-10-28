import { Link } from 'react-router'
import { siteConfig } from '../siteConfig'

const currentYear = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="bg-hero relative mt-16 overflow-hidden text-white">
      <div aria-hidden="true" className="bg-dots absolute inset-0" />
      <div className="relative mx-auto flex max-w-5xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-lg font-bold">{siteConfig.siteName}</p>
          <p className="mt-1 text-sm text-white/80">
            © {currentYear} {siteConfig.siteName}. All rights reserved.
          </p>
        </div>
        <nav aria-label="바닥글 메뉴">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
            <li><Link to="/publications" className="text-white/90 hover:text-white hover:underline">연구 업적</Link></li>
            <li><Link to="/projects" className="text-white/90 hover:text-white hover:underline">연구 프로젝트</Link></li>
            <li><Link to="/contact" className="text-white/90 hover:text-white hover:underline">연락처</Link></li>
            <li><Link to="/admin" className="text-white/80 hover:text-white hover:underline">관리</Link></li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
