export type ValidationRule<T> = (value: T) => string | null

export type FieldRules<T extends Record<string, unknown>> = {
  [K in keyof T]?: ValidationRule<T[K]>[]
}

export type FieldErrors<T extends Record<string, unknown>> = {
  [K in keyof T]?: string
}

export const rules = {
  required: (message = 'Обязательное поле'): ValidationRule<string> =>
    (v) => (!v || v.trim().length === 0 ? message : null),

  minLength: (min: number, message?: string): ValidationRule<string> =>
    (v) => (v && v.length < min ? message ?? `Минимум ${min} символов` : null),

  maxLength: (max: number, message?: string): ValidationRule<string> =>
    (v) => (v && v.length > max ? message ?? `Максимум ${max} символов` : null),

  email: (message = 'Некорректный email'): ValidationRule<string> =>
    (v) => (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? message : null),

  url: (message = 'Некорректный URL'): ValidationRule<string> =>
    (v) => {
      if (!v) return null
      try { new URL(v); return null }
      catch { return message }
    },

  year: (message = 'Некорректный год'): ValidationRule<string> =>
    (v) => {
      if (!v) return null
      const n = parseInt(v, 10)
      return (isNaN(n) || n < 1400 || n > new Date().getFullYear()) ? message : null
    },

  number: (min?: number, max?: number, message?: string): ValidationRule<string> =>
    (v) => {
      if (!v) return null
      const n = parseFloat(v)
      if (isNaN(n)) return message ?? 'Должно быть числом'
      if (min !== undefined && n < min) return message ?? `Минимум ${min}`
      if (max !== undefined && n > max) return message ?? `Максимум ${max}`
      return null
    },
}

export function validate<T extends Record<string, unknown>>(
  values: T,
  fieldRules: FieldRules<T>,
): FieldErrors<T> {
  const errors: FieldErrors<T> = {}
  for (const field in fieldRules) {
    const fieldRuleList = fieldRules[field]
    if (!fieldRuleList) continue
    for (const rule of fieldRuleList) {
      const error = rule(values[field] as T[typeof field])
      if (error) { errors[field] = error; break }
    }
  }
  return errors
}

export function hasErrors<T extends Record<string, unknown>>(
  errors: FieldErrors<T>,
): boolean {
  return Object.values(errors).some(Boolean)
}
