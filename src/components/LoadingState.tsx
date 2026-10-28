export default function LoadingState({ label = '불러오는 중…' }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex items-center gap-3 py-10 text-slate-600">
      <span
        aria-hidden="true"
        className="h-5 w-5 animate-spin rounded-full border-2 border-brand-200 border-t-brand-700"
      />
      <span>{label}</span>
    </div>
  )
}
