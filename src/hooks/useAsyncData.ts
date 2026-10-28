import { useCallback, useEffect, useState } from 'react'

export interface AsyncState<T> {
  data: T | undefined
  loading: boolean
  error: Error | undefined
  /** 오류 후 "다시 시도" 버튼에서 호출 */
  retry: () => void
}

/**
 * dataService 의 비동기 함수를 불러와 로딩·오류 상태를 관리합니다.
 * 사용 예: const { data, loading, error, retry } = useAsyncData(getProjects)
 * 주의: loader 는 컴포넌트 밖에서 정의된 함수(또는 useCallback)여야 무한 반복 호출이 없습니다.
 */
export function useAsyncData<T>(loader: () => Promise<T>): AsyncState<T> {
  const [data, setData] = useState<T>()
  const [error, setError] = useState<Error>()
  const [loading, setLoading] = useState(true)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    loader()
      .then((result) => {
        if (!active) return
        setData(result)
        setError(undefined)
      })
      .catch((err: unknown) => {
        if (!active) return
        setError(err instanceof Error ? err : new Error(String(err)))
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [loader, attempt])

  const retry = useCallback(() => {
    setLoading(true)
    setError(undefined)
    setAttempt((n) => n + 1)
  }, [])

  return { data, loading, error, retry }
}
