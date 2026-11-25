import { COPY, LOCALES } from '../data/translations'
import { SIDE_TARGET, SIDE_THREAT } from '../data/map-data'
import type { Side } from '../types/guide'

export type Locale = (typeof LOCALES)[number]

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  tr: 'Türkçe',
  'pt-BR': 'Português',
  th: 'ไทย',
  ko: '한국어',
  pl: 'Polski',
  no: 'Norsk',
  fr: 'Français',
}

export const LOCALE_CODES: Record<Locale, string> = {
  en: 'EN',
  tr: 'TR',
  'pt-BR': 'PT',
  th: 'TH',
  ko: 'KO',
  pl: 'PL',
  no: 'NO',
  fr: 'FR',
}

const untranslatedRoles = new Set(['Attack', 'Defense', 'Floater', 'Leader'])

export function translate(text: string, locale: Locale): string {
  if (locale === 'en' || untranslatedRoles.has(text)) return text

  const row = COPY.find(([english]) => english === text)
  const languageIndex = LOCALES.indexOf(locale)
  return row?.[languageIndex] ?? text
}

export function replaceSideTokens(text: string, side: Side): string {
  return text.replace(/\{([XYZ])\}/g, (_match, token: 'X' | 'Y' | 'Z') => {
    if (token === 'X') return side
    return token === 'Y' ? SIDE_TARGET[side] : SIDE_THREAT[side]
  })
}
