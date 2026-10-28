interface Props {
  title: string
  description?: string
}

export default function PageHeader({ title, description }: Props) {
  return (
    <div className="mb-8 border-b border-slate-200 pb-6">
      <h1 className="text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl">{title}</h1>
      {description && <p className="mt-3 text-slate-600">{description}</p>}
    </div>
  )
}
