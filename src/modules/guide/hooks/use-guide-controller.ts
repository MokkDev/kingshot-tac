import { useCallback, useEffect, useMemo, useState } from 'react'
import { GUIDE_SECTIONS } from '../data/guide-data'
import { buildDisplaySteps, sectionStartIndex } from '../utils/guide-steps'
import { translate } from '../utils/localization'
import type { Locale } from '../utils/localization'
import type { Side } from '../types/guide'

export function useGuideController() {
  const [locale, setLocale] = useState<Locale>('en')
  const [side, setSide] = useState<Side>('A')
  const [stepIndex, setStepIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const steps = useMemo(() => buildDisplaySteps(side), [side])
  const currentIndex = Math.min(stepIndex, Math.max(steps.length - 1, 0))
  const step = steps[currentIndex]
  const sections = useMemo(
    () => GUIDE_SECTIONS.map(([title], index) => ({ index, title })),
    [],
  )

  const navigate = useCallback(
    (delta: number) => {
      const nextIndex = currentIndex + delta
      if (nextIndex < 0 || nextIndex >= steps.length) return
      setDirection(delta)
      setStepIndex(nextIndex)
    },
    [currentIndex, steps.length],
  )

  const jumpToSection = useCallback(
    (sectionIndex: number) => {
      const nextIndex = sectionStartIndex(steps, sectionIndex)
      if (nextIndex < 0) return
      setDirection(nextIndex > currentIndex ? 1 : -1)
      setStepIndex(nextIndex)
    },
    [currentIndex, steps],
  )

  useEffect(() => {
    document.documentElement.lang = locale
    document.title = translate('Tri-Alliance Clash: Member Guide', locale)
  }, [locale])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.closest('.map') ||
          target.tagName === 'SELECT' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        navigate(1)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        navigate(-1)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  return {
    locale,
    setLocale,
    side,
    setSide,
    steps,
    stepIndex: currentIndex,
    step,
    direction,
    sections,
    navigate,
    jumpToSection,
  }
}
