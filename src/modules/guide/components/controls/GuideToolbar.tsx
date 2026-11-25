import { useEffect, useRef, useState } from 'react'
import { LOCALES } from '../../data/translations'
import {
  LOCALE_CODES,
  LOCALE_LABELS,
  translate,
} from '../../utils/localization'
import type { Locale } from '../../utils/localization'
import type { Side } from '../../types/guide'

interface GuideToolbarProps {
  locale: Locale
  side: Side
  sections: Array<{ index: number; title: string }>
  activeSectionIndex: number
  onLocaleChange: (locale: Locale) => void
  onSideChange: (side: Side) => void
  onSectionChange: (sectionIndex: number) => void
}

export function GuideToolbar({
  locale,
  side,
  sections,
  activeSectionIndex,
  onLocaleChange,
  onSideChange,
  onSectionChange,
}: GuideToolbarProps) {
  const localeDetails = useRef<HTMLDetailsElement>(null)
  const [localeOpen, setLocaleOpen] = useState(false)

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      const details = localeDetails.current
      if (
        details?.open &&
        event.target instanceof Node &&
        !details.contains(event.target)
      ) {
        details.open = false
        setLocaleOpen(false)
      }
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      const details = localeDetails.current
      if (event.key !== 'Escape' || !details?.open) return
      details.open = false
      setLocaleOpen(false)
      details.querySelector('summary')?.focus()
    }

    document.addEventListener('click', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('click', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  return (
    <header className="top">
      <details
        ref={localeDetails}
        className="locale"
        onToggle={(event) => setLocaleOpen(event.currentTarget.open)}
      >
        <summary
          aria-label={`${translate('Language', locale)}: ${LOCALE_LABELS[locale]}`}
          aria-expanded={localeOpen}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
          </svg>
          <span className="locale-code">{LOCALE_CODES[locale]}</span>
        </summary>
        <div className="locale-menu" aria-label={translate('Language', locale)}>
          {LOCALES.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={option === locale}
              onClick={() => {
                onLocaleChange(option)
                if (localeDetails.current) {
                  localeDetails.current.open = false
                  localeDetails.current.querySelector('summary')?.focus()
                }
              }}
            >
              {LOCALE_LABELS[option]}
            </button>
          ))}
        </div>
      </details>

      <label className="sr" htmlFor="guide-section">
        {translate('Jump to step', locale)}
      </label>
      <select
        id="guide-section"
        aria-label={translate('Jump to step', locale)}
        value={activeSectionIndex}
        onChange={(event) => {
          const sectionIndex = Number(event.currentTarget.value)
          onSectionChange(sectionIndex)
        }}
      >
        {sections.map(({ index, title }) => (
          <option key={index} value={index}>
            {index + 1} · {translate(title, locale)}
          </option>
        ))}
      </select>

      <div
        className="side"
        role="group"
        aria-label={translate('Our side', locale)}
      >
        {(['A', 'B', 'C'] as const).map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={option === side}
            onClick={() => onSideChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </header>
  )
}
