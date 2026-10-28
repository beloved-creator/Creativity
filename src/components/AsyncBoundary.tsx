import type { ReactNode } from 'react'
import type { AsyncState } from '../hooks/useAsyncData'
import { DataNotReadyError } from '../services/dataService'
import ErrorState from './ErrorState'
import LoadingState from './LoadingState'
import SetupNotice from './SetupNotice'

interface Props<T> {
  state: AsyncState<T>
  loadingLabel?: string
  errorMessage?: string
  children: (data: T) => ReactNode
}

/** 로딩 중이면 로딩 표시, 데이터가 아직 없으면 설정 안내, 오류면 오류 표시, 성공하면 children(data) 를 그립니다. */
export default function AsyncBoundary<T>({ state, loadingLabel, errorMessage, children }: Props<T>) {
  if (state.loading) return <LoadingState label={loadingLabel} />
  if (state.error instanceof DataNotReadyError) return <SetupNotice />
  if (state.error || state.data === undefined) return <ErrorState message={errorMessage} onRetry={state.retry} />
  return <>{children(state.data)}</>
}
