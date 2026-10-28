import { useId, useState, type FormEvent } from 'react'
import { fromFormValues, isFieldVisible, type FieldDef, type FormValue, type FormValues } from './fields'

export interface PubOption {
  id: string
  label: string
}

interface Props {
  fields: FieldDef[]
  initialValues: FormValues
  /** 저장 버튼을 누르면 변환된 데이터로 호출. 오류를 던지면 화면에 표시 */
  onSubmit: (data: Record<string, unknown>) => Promise<void>
  onCancel?: () => void
  submitLabel?: string
  /** 'pubRefs' 항목에서 고를 연구 업적 목록 */
  pubOptions?: PubOption[]
}

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-base focus:border-accent-600'

export default function EntityForm({ fields, initialValues, onSubmit, onCancel, submitLabel = '저장', pubOptions = [] }: Props) {
  const formId = useId()
  const [values, setValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const set = (name: string, value: FormValue) => setValues((prev) => ({ ...prev, [name]: value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const { data, errors: found } = fromFormValues(values, fields)
    setErrors(found)
    if (found.length) return
    setSaving(true)
    try {
      await onSubmit(data)
    } catch (err) {
      setErrors([`저장하지 못했습니다: ${err instanceof Error ? err.message : String(err)}`])
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {fields.filter((f) => isFieldVisible(f, values)).map((f) => {
        const id = `${formId}-${f.name}`
        const helpId = f.help ? `${id}-help` : undefined
        const label = (
          <>
            {f.label}
            {f.required && <span className="ml-1 text-red-600" aria-hidden="true">*</span>}
          </>
        )
        const help = f.help && (
          <p id={helpId} className="mt-1 text-sm text-slate-500">
            {f.help}
          </p>
        )

        if (f.kind === 'checkbox') {
          return (
            <div key={f.name} className="flex items-center gap-2">
              <input
                id={id}
                type="checkbox"
                checked={values[f.name] === true}
                onChange={(e) => set(f.name, e.target.checked)}
                className="h-5 w-5 accent-accent-600"
              />
              <label htmlFor={id} className="font-medium text-slate-800">
                {f.label}
              </label>
            </div>
          )
        }

        if (f.kind === 'pubRefs') {
          const selected = (values[f.name] as string[]) ?? []
          return (
            <fieldset key={f.name}>
              <legend className="mb-2 font-semibold text-slate-800">{f.label}</legend>
              <div className="max-h-64 space-y-1 overflow-y-auto rounded-xl border border-slate-300 bg-white p-3">
                {pubOptions.length === 0 && <p className="text-sm text-slate-500">등록된 연구 업적이 없습니다.</p>}
                {pubOptions.map((opt) => (
                  <label key={opt.id} className="flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 shrink-0 accent-accent-600"
                      checked={selected.includes(opt.id)}
                      onChange={(e) =>
                        set(f.name, e.target.checked ? [...selected, opt.id] : selected.filter((x) => x !== opt.id))
                      }
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )
        }

        const common = {
          id,
          'aria-describedby': helpId,
          'aria-required': f.required || undefined,
          value: String(values[f.name] ?? ''),
          placeholder: f.placeholder,
          className: inputClass,
        }
        let control
        if (f.kind === 'select') {
          control = (
            <select {...common} onChange={(e) => set(f.name, e.target.value)}>
              {f.options?.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          )
        } else if (f.kind === 'textarea' || f.kind === 'lines' || f.kind === 'links') {
          control = <textarea {...common} rows={f.kind === 'textarea' ? 4 : 3} onChange={(e) => set(f.name, e.target.value)} />
        } else {
          const type = f.kind === 'number' ? 'number' : f.kind === 'date' ? 'date' : f.kind === 'month' ? 'month' : 'text'
          control = <input {...common} type={type} onChange={(e) => set(f.name, e.target.value)} />
        }
        return (
          <div key={f.name}>
            <label htmlFor={id} className="mb-1 block font-semibold text-slate-800">
              {label}
            </label>
            {control}
            {help}
          </div>
        )
      })}

      {errors.length > 0 && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          <ul className="list-disc space-y-1 pl-5">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-hero rounded-full px-6 py-2.5 font-bold text-white shadow-md shadow-accent-600/30 disabled:opacity-60"
        >
          {saving ? '저장 중…' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full bg-white px-6 py-2.5 font-semibold text-slate-700 ring-1 ring-slate-300 hover:ring-accent-300"
          >
            취소
          </button>
        )}
      </div>
    </form>
  )
}
