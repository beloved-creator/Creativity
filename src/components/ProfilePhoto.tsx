interface Props {
  src?: string
  name: string
}

/** 교수 사진. 사진이 없으면 기본 그림(placeholder)을 보여줍니다. */
export default function ProfilePhoto({ src, name }: Props) {
  const box = 'h-40 w-32 shrink-0 overflow-hidden rounded-lg border border-slate-200 sm:h-52 sm:w-40'
  if (src) {
    return <img src={src} alt={`${name} 교수 사진`} className={`${box} object-cover`} />
  }
  return (
    <div role="img" aria-label={`${name} 교수 사진 자리 (사진 준비 중)`} className={`${box} flex items-end justify-center bg-brand-50`}>
      <svg aria-hidden="true" viewBox="0 0 80 100" className="h-4/5 w-4/5 text-brand-200" fill="currentColor">
        <circle cx="40" cy="34" r="18" />
        <path d="M6 100c0-22 15-36 34-36s34 14 34 36z" />
      </svg>
    </div>
  )
}
