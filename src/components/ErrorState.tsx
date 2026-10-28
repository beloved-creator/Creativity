interface Props {
  message?: string
  onRetry?: () => void
}

export default function ErrorState({ message = '데이터를 불러오지 못했습니다.', onRetry }: Props) {
  return (
    <div role="alert" className="my-6 rounded-lg border border-red-200 bg-red-50 p-5 text-red-900">
      <p className="font-medium">{message}</p>
      <p className="mt-1 text-sm text-red-800">잠시 후 다시 시도해 주세요. 문제가 계속되면 페이지를 새로고침해 주세요.</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-900 hover:bg-red-100"
        >
          다시 시도
        </button>
      )}
    </div>
  )
}
