interface Props {
  title: string
  description?: string
}

/** 각 페이지 상단의 그라데이션 제목 배너 */
export default function PageHeader({ title, description }: Props) {
  return (
    <div className="bg-hero relative mb-10 animate-fade-up overflow-hidden rounded-3xl px-6 py-10 text-white shadow-xl shadow-accent-700/20 sm:px-10 sm:py-12">
      <div aria-hidden="true" className="bg-dots absolute inset-0" />
      <div aria-hidden="true" className="absolute -top-16 -right-10 h-56 w-56 rounded-full bg-accent-500/40 blur-3xl" />
      <div className="relative">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-white/85">{description}</p>}
      </div>
    </div>
  )
}
