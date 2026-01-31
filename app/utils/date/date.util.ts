import { DEFAULT_LOCALE } from '~/constants/locale/locale.constant'

export class DateUtil {
  /**
   * Formats a date using Intl.DateTimeFormat.
   * @param date - The date to format (Date, string, or number)
   * @param locales - Optional BCP 47 language tag(s), e.g. 'nl-be'
   * @param options - Intl.DateTimeFormat options
   * @returns The formatted date string
   */
  static format(
    date: Date | string | number,
    locales: string | string[] = DEFAULT_LOCALE,
    options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  ): string {
    if (!date)
      return ''
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
    if (Number.isNaN(d.getTime()))
      return ''
    return new Intl.DateTimeFormat(locales, options).format(d)
  }
}
