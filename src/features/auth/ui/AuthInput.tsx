import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { FormField } from '@/shared/ui/FormField'
import { Input } from '@/shared/ui/Input'

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, name, ...rest }, ref) => (
    <FormField label={label} error={error}>
      <Input id={`field-${name}`} name={name} error={error} ref={ref} {...rest} />
    </FormField>
  )
)

AuthInput.displayName = 'AuthInput'
