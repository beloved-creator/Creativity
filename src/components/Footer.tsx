import { siteConfig } from '../siteConfig'

const currentYear = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-slate-600 sm:px-6">
        © {currentYear} {siteConfig.siteName}. All rights reserved.
      </div>
    </footer>
  )
}
