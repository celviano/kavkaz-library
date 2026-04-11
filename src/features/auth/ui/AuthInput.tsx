import { type InputHTMLAttributes, type FC } from 'react'
import { FormField } from '@/shared/ui/FormField'
import { Input } from '@/shared/ui/Input'

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const AuthInput: FC<AuthInputProps> = ({ label, error, name, ...rest }) => (
  <FormField label={label} error={error}>
    <Input id={`field-${name}`} name={name} error={error} {...rest} />
  </FormField>
)
