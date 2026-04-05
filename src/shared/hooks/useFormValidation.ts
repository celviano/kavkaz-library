'use client'

import { useState, useCallback } from 'react'
import { validate, hasErrors } from '@/shared/lib/validation'
import type { FieldRules, FieldErrors } from '@/shared/lib/validation'

interface UseFormValidationOptions<T extends Record<string, unknown>> {
  rules: FieldRules<T>
  initialValues?: Partial<T>
}

export function useFormValidation<T extends Record<string, unknown>>({
  rules: fieldRules,
  initialValues = {},
}: UseFormValidationOptions<T>) {
  const [errors, setErrors] = useState<FieldErrors<T>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})

  const validateField = useCallback(
    (field: keyof T, value: T[keyof T]) => {
      const fieldRuleList = fieldRules[field]
      if (!fieldRuleList) return null

      for (const rule of fieldRuleList) {
        const error = rule(value)
        if (error) return error
      }
      return null
    },
    [fieldRules],
  )

  const touchField = useCallback(
    (field: keyof T, value: T[keyof T]) => {
      setTouched((prev) => ({ ...prev, [field]: true }))
      const error = validateField(field, value)
      setErrors((prev) => ({ ...prev, [field]: error ?? undefined }))
    },
    [validateField],
  )

  const validateAll = useCallback(
    (values: T): boolean => {
      const newErrors = validate(values, fieldRules)
      // Mark all fields as touched
      const allTouched = Object.keys(fieldRules).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as Record<keyof T, boolean>,
      )
      setTouched(allTouched)
      setErrors(newErrors)
      return !hasErrors(newErrors)
    },
    [fieldRules],
  )

  const clearErrors = useCallback(() => {
    setErrors({})
    setTouched({})
  }, [])

  const getFieldError = useCallback(
    (field: keyof T): string | undefined => {
      return touched[field] ? errors[field] : undefined
    },
    [errors, touched],
  )

  return {
    errors,
    touched,
    touchField,
    validateAll,
    clearErrors,
    getFieldError,
    isValid: !hasErrors(errors),
  }
}
