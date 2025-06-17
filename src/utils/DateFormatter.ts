import { format, parseISO } from 'date-fns'
import { id } from 'date-fns/locale'

export const DateFormatter = (value: string) => {
  return format(parseISO(value), "dd MMMM yyyy, HH:mm", { locale: id })
}
