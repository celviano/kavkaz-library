import { twMerge } from 'tailwind-merge'

type ClassArray = ClassValue[]
type ClassObject = Record<string, unknown>
type ClassValue = string | number | boolean | undefined | null | ClassArray | ClassObject

function toVal(mix: ClassValue): string {
  let str = ''
  if (typeof mix === 'string' || typeof mix === 'number') {
    str += mix
  } else if (typeof mix === 'object' && mix !== null) {
    if (Array.isArray(mix)) {
      for (let i = 0; i < mix.length; i++) {
        if (mix[i]) {
          const y = toVal(mix[i])
          if (y) {
            str && (str += ' ')
            str += y
          }
        }
      }
    } else {
      for (const key in mix) {
        if (mix[key]) {
          str && (str += ' ')
          str += key
        }
      }
    }
  }
  return str
}

export function cn(...inputs: ClassValue[]): string {
  let str = ''
  for (let i = 0; i < inputs.length; i++) {
    const tmp = inputs[i]
    if (tmp) {
      const x = toVal(tmp)
      if (x) {
        str && (str += ' ')
        str += x
      }
    }
  }
  return twMerge(str)
}
