import { useState } from 'react'
import AsyncBoundary from '../../components/AsyncBoundary'
import { useAsyncData } from '../../hooks/useAsyncData'
import EntityForm, { type PubOption } from './EntityForm'
import { toFormValues, type FieldDef } from './fields'

export interface ListSummary {
  title: string
  meta: string
}

interface Props<T extends { id: string }> {
  /** 예: "연구 업적" */
  label: string
  fields: FieldDef[]
  /** 목록을 불러오는 함수 — 모듈 최상위에 정의된 함수여야 합니다 */
  load: () => Promise<T[]>
  save: (item: T) => Promise<string>
  remove: (id: string) => Promise<void>
  summarize: (item: T) => ListSummary
  /** "새로 추가" 시 기본값을 만드는 함수 */
  createEmpty: () => Record<string, unknown>
  pubOptions?: PubOption[]
}

type Editing<T> = { mode: 'new'; initial: Record<string, unknown> } | { mode: 'edit'; item: T } | null

/** 목록 + 추가/수정/삭제 화면 (연구 업적·프로젝트·소식 공용) */
export default function CollectionEditor<T extends { id: string }>({
  label,
  fields,
  load,
  save,
  remove,
  summarize,
  createEmpty,
  pubOptions,
}: Props<T>) {
  const state = useAsyncData(load)
  const [editing, setEditing] = useState<Editing<T>>(null)
  const [message, setMessage] = useState('')
  const [filter, setFilter] = useState('')

  const handleSave = async (data: Record<string, unknown>) => {
    const id = editing?.mode === 'edit' ? editing.item.id : ''
    await save({ ...data, id } as T)
    setEditing(null)
    setMessage(`저장했습니다: ${String(data.title ?? '')}`)
    state.retry() // 목록 새로고침
  }

  const handleDelete = async (item: T) => {
    const { title } = summarize(item)
    if (!window.confirm(`"${title}" 을(를) 삭제할까요? 되돌릴 수 없습니다.`)) return
    try {
      await remove(item.id)
      setMessage(`삭제했습니다: ${title}`)
      if (editing?.mode === 'edit' && editing.item.id === item.id) setEditing(null)
      state.retry()
    } catch (err) {
      setMessage(`삭제하지 못했습니다: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  return (
    <div className="space-y-6">
      <p aria-live="polite" className="min-h-6 text-sm font-medium text-emerald-700">
        {message}
      </p>

      {editing ? (
        <section aria-labelledby="editor-heading" className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-accent-200 sm:p-6">
          <h2 id="editor-heading" className="mb-5 text-xl font-extrabold text-slate-900">
            {editing.mode === 'new' ? `새 ${label} 추가` : `${label} 수정`}
          </h2>
          <EntityForm
            key={editing.mode === 'edit' ? editing.item.id : 'new'}
            fields={fields}
            initialValues={toFormValues(editing.mode === 'edit' ? editing.item : editing.initial, fields)}
            onSubmit={handleSave}
            onCancel={() => setEditing(null)}
            pubOptions={pubOptions}
          />
        </section>
      ) : (
        <button
          type="button"
          onClick={() => {
            setMessage('')
            setEditing({ mode: 'new', initial: createEmpty() })
          }}
          className="bg-hero rounded-full px-5 py-2.5 font-bold text-white shadow-md shadow-accent-600/30"
        >
          + 새 {label} 추가
        </button>
      )}

      <AsyncBoundary state={state} loadingLabel="목록을 불러오는 중…">
        {(items) => {
          const q = filter.trim().toLowerCase()
          const shown = q ? items.filter((it) => JSON.stringify(it).toLowerCase().includes(q)) : items
          return (
            <div>
              <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-bold text-slate-900">
                  {label} 목록 <span className="text-accent-700">({items.length})</span>
                </h2>
                <label className="sr-only" htmlFor="admin-filter">
                  목록 검색
                </label>
                <input
                  id="admin-filter"
                  type="search"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="목록 검색"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 sm:w-64"
                />
              </div>
              {shown.length === 0 ? (
                <p className="rounded-2xl bg-white p-6 text-center text-slate-600 ring-1 ring-slate-200">항목이 없습니다.</p>
              ) : (
                <ul className="divide-y divide-slate-200 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
                  {shown.map((item) => {
                    const s = summarize(item)
                    return (
                      <li key={item.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">{s.title}</p>
                          <p className="text-sm text-slate-500">{s.meta}</p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setMessage('')
                              setEditing({ mode: 'edit', item })
                              window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}
                            className="rounded-full bg-accent-50 px-4 py-1.5 text-sm font-bold text-accent-700 ring-1 ring-accent-200 hover:bg-accent-100"
                            aria-label={`${s.title} 수정`}
                          >
                            수정
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            className="rounded-full bg-white px-4 py-1.5 text-sm font-bold text-red-700 ring-1 ring-red-200 hover:bg-red-50"
                            aria-label={`${s.title} 삭제`}
                          >
                            삭제
                          </button>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )
        }}
      </AsyncBoundary>
    </div>
  )
}
