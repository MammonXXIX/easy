import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export const DateFormatter = (value: Date): string => {
  return format(value, "dd MMMM yyyy, HH:mm", { locale: id })
}
