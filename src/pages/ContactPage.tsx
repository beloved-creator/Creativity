import AsyncBoundary from '../components/AsyncBoundary'
import PageHeader from '../components/PageHeader'
import { useAsyncData } from '../hooks/useAsyncData'
import { usePageMeta } from '../hooks/usePageMeta'
import { getProfile } from '../services/dataService'

export default function ContactPage() {
  usePageMeta('연락처', '이메일, 연구실 위치와 면담 안내')
  const state = useAsyncData(getProfile)

  return (
    <>
      <PageHeader title="연락처" />
      <AsyncBoundary state={state}>
        {(profile) => (
          <div className="grid gap-10 md:grid-cols-2">
            <dl className="space-y-4">
              <div className="rounded-2xl bg-white p-5 shadow-md shadow-slate-900/5 ring-1 ring-slate-200">
                <dt className="text-xs font-bold tracking-widest text-accent-600 uppercase">이메일</dt>
                <dd className="mt-1 text-lg">
                  <a href={`mailto:${profile.email}`} className="font-bold text-brand-800 underline decoration-accent-300 underline-offset-4 hover:text-accent-700">
                    {profile.email}
                  </a>
                </dd>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-md shadow-slate-900/5 ring-1 ring-slate-200">
                <dt className="text-xs font-bold tracking-widest text-accent-600 uppercase">연구실 위치</dt>
                <dd className="mt-1 text-lg text-slate-800">{profile.office}</dd>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-md shadow-slate-900/5 ring-1 ring-slate-200">
                <dt className="text-xs font-bold tracking-widest text-accent-600 uppercase">소속</dt>
                <dd className="mt-1 text-lg text-slate-800">
                  {profile.affiliation} · {profile.position}
                </dd>
              </div>
            </dl>
            <section aria-labelledby="office-hours" className="bg-hero relative overflow-hidden rounded-2xl p-6 text-white shadow-xl shadow-accent-700/20 sm:p-8">
              <div aria-hidden="true" className="bg-dots absolute inset-0" />
              <h2 id="office-hours" className="relative text-xl font-extrabold">
                면담 안내
              </h2>
              <div className="relative mt-3 space-y-3 leading-relaxed text-white/90">
                {profile.officeHoursNote.map((para) => (
                  <p key={para}>{para}</p>
                ))}
              </div>
            </section>
          </div>
        )}
      </AsyncBoundary>
    </>
  )
}
