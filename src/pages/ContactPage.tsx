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
            <dl className="space-y-6">
              <div>
                <dt className="text-sm font-semibold text-slate-500">이메일</dt>
                <dd className="mt-1 text-lg">
                  <a href={`mailto:${profile.email}`} className="font-medium text-brand-700 underline underline-offset-2 hover:text-brand-900">
                    {profile.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-slate-500">연구실 위치</dt>
                <dd className="mt-1 text-lg text-slate-800">{profile.office}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-slate-500">소속</dt>
                <dd className="mt-1 text-lg text-slate-800">
                  {profile.affiliation} · {profile.position}
                </dd>
              </div>
            </dl>
            <section aria-labelledby="office-hours" className="rounded-lg bg-brand-50 p-6">
              <h2 id="office-hours" className="text-lg font-bold text-brand-900">
                면담 안내
              </h2>
              <div className="mt-3 space-y-3 leading-relaxed text-slate-700">
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
