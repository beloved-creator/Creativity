interface Props {
  src?: string
  name: string
}

/** 교수 사진 (빛나는 그라데이션 테두리). 사진이 없으면 기본 그림(placeholder)을 보여줍니다. */
export default function ProfilePhoto({ src, name }: Props) {
  const box = 'h-44 w-36 overflow-hidden rounded-[1.4rem] sm:h-56 sm:w-44'
  return (
    <div className="relative w-fit shrink-0 self-center sm:self-auto">
      <div aria-hidden="true" className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-sky-300 via-accent-500 to-pink-400 opacity-60 blur-xl" />
      <div className="relative rounded-[1.6rem] bg-gradient-to-br from-sky-300 via-white to-pink-300 p-1">
        {src ? (
          <img src={src} alt={`${name} 교수 사진`} className={`${box} object-cover`} />
        ) : (
          <div role="img" aria-label={`${name} 교수 사진 자리 (사진 준비 중)`} className={`${box} flex items-end justify-center bg-gradient-to-b from-accent-50 to-indigo-100`}>
            <svg aria-hidden="true" viewBox="0 0 80 100" className="h-4/5 w-4/5 text-accent-200" fill="currentColor">
              <circle cx="40" cy="34" r="18" />
              <path d="M6 100c0-22 15-36 34-36s34 14 34 36z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  )
}
