import { useEffect } from 'react'
import { siteConfig } from '../siteConfig'

/** 페이지별 브라우저 탭 제목과 description 메타 태그를 설정합니다. */
export function usePageMeta(title: string | undefined, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${siteConfig.siteName}` : siteConfig.siteName
    const meta = document.querySelector('meta[name="description"]')
    meta?.setAttribute('content', description ?? siteConfig.defaultDescription)
  }, [title, description])
}
