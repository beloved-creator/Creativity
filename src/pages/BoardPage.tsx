import { Link } from 'react-router'
import AsyncBoundary from '../components/AsyncBoundary'
import PageHeader from '../components/PageHeader'
import { useAsyncData } from '../hooks/useAsyncData'
import { usePageMeta } from '../hooks/usePageMeta'
import { getPosts } from '../services/dataService'
import { formatDate } from '../utils/format'

export default function BoardPage() {
  usePageMeta('게시판', '연구실 공지와 안내')
  const state = useAsyncData(getPosts)

  return (
    <>
      <PageHeader title="게시판" description="연구실 공지와 안내를 전합니다." />
      <AsyncBoundary state={state} loadingLabel="게시글을 불러오는 중…">
        {(posts) =>
          posts.length === 0 ? (
            <p className="rounded-2xl bg-white py-12 text-center text-slate-600 ring-1 ring-slate-200">아직 게시글이 없습니다.</p>
          ) : (
            <ul className="divide-y divide-slate-200 overflow-hidden rounded-2xl bg-white shadow-md shadow-slate-900/5 ring-1 ring-slate-200">
              {posts.map((post) => (
                <li key={post.id}>
                  <Link
                    to={`/board/${encodeURIComponent(post.id)}`}
                    className="group flex flex-col gap-1 p-5 transition-colors hover:bg-accent-50 sm:flex-row sm:items-center sm:gap-4"
                  >
                    <span className="flex min-w-0 flex-1 items-center gap-2">
                      {post.pinned && (
                        <span className="shrink-0 rounded-full bg-hero px-2.5 py-0.5 text-xs font-bold text-white">공지</span>
                      )}
                      <span className="truncate text-lg font-bold text-slate-900 group-hover:text-accent-700">{post.title}</span>
                    </span>
                    <time dateTime={post.date} className="shrink-0 text-sm tabular-nums text-slate-500">
                      {formatDate(post.date)}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          )
        }
      </AsyncBoundary>
    </>
  )
}
