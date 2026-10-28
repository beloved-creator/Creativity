import { useCallback } from 'react'
import { Link, useParams } from 'react-router'
import AsyncBoundary from '../components/AsyncBoundary'
import { useAsyncData } from '../hooks/useAsyncData'
import { usePageMeta } from '../hooks/usePageMeta'
import { getPost } from '../services/dataService'
import { formatDate } from '../utils/format'

const backLink = (
  <Link to="/board" className="font-semibold text-accent-700 underline underline-offset-2 hover:text-accent-600">
    ← 목록으로
  </Link>
)

export default function PostPage() {
  const { postId = '' } = useParams()
  // postId 가 바뀔 때만 다시 찾음 (목록은 캐시되어 있어 추가 조회 없음).
  // 글이 없을 때도 '오류'가 아니라 '없음'으로 표시하려고 { post } 로 감쌉니다.
  const loader = useCallback(async () => ({ post: await getPost(postId) }), [postId])
  const state = useAsyncData(loader)
  const post = state.data?.post
  usePageMeta(post?.title ?? '게시판', post?.body.slice(0, 120))

  return (
    <AsyncBoundary state={state} loadingLabel="게시글을 불러오는 중…">
      {({ post }) =>
        post ? (
          <article className="animate-fade-up">
            <p className="mb-6">{backLink}</p>
            <header className="border-b border-slate-200 pb-5">
              {post.pinned && <span className="rounded-full bg-hero px-2.5 py-0.5 text-xs font-bold text-white">공지</span>}
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{post.title}</h1>
              <time dateTime={post.date} className="mt-2 block text-sm tabular-nums text-slate-500">
                {formatDate(post.date)}
              </time>
            </header>
            <div className="mt-6 whitespace-pre-line rounded-2xl bg-white p-6 text-lg leading-relaxed text-slate-800 shadow-md shadow-slate-900/5 ring-1 ring-slate-200 sm:p-8">
              {post.body}
            </div>
          </article>
        ) : (
          <div className="py-12 text-center">
            <h1 className="text-2xl font-extrabold text-slate-900">게시글을 찾을 수 없습니다</h1>
            <p className="mt-3 text-slate-600">삭제되었거나 주소가 잘못되었습니다.</p>
            <p className="mt-6">{backLink}</p>
          </div>
        )
      }
    </AsyncBoundary>
  )
}
