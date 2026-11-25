import { useCallback, useEffect, useMemo, useState } from 'react'
import { getGuideTopic, GUIDE_SECTIONS, GUIDE_TOPICS } from '../data/guide-data'
import { buildDisplaySteps, sectionStartIndex } from '../utils/guide-steps'
import { translate } from '../utils/localization'
import type { Locale } from '../utils/localization'
import type { GuideTopicId, Side } from '../types/guide'

const COMPLETED_TOPIC_STORAGE_KEY = 'kingshot-tac:guide:completed:'

export function useGuideController() {
  const [locale, setLocale] = useState<Locale>('en')
  const [side, setSide] = useState<Side>('A')
  const [topicId, setTopicId] = useState<GuideTopicId | null>(null)
  const [completedTopics, setCompletedTopics] = useState<GuideTopicId[]>([])
  const [stepIndex, setStepIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const steps = useMemo(
    () => (topicId ? buildDisplaySteps(side, topicId) : []),
    [side, topicId],
  )
  const currentIndex = Math.min(stepIndex, Math.max(steps.length - 1, 0))
  const step = steps.at(currentIndex)
  const sections = useMemo(() => {
    return topicId
      ? getGuideTopic(topicId).sectionIndexes.map((index, displayIndex) => ({
          index,
          title: GUIDE_SECTIONS[index][0],
          displayIndex: displayIndex + 1,
        }))
      : []
  }, [topicId])

  const chooseTopic = useCallback((nextTopicId: GuideTopicId) => {
    setTopicId(nextTopicId)
    setDirection(1)
    setStepIndex(0)
  }, [])

  const showTopics = useCallback(() => {
    setTopicId(null)
    setStepIndex(0)
    setDirection(-1)
  }, [])

  const completeTopic = useCallback((completedTopicId: GuideTopicId) => {
    window.sessionStorage.setItem(
      `${COMPLETED_TOPIC_STORAGE_KEY}${completedTopicId}`,
      'done',
    )
    setCompletedTopics((current) =>
      current.includes(completedTopicId)
        ? current
        : [...current, completedTopicId],
    )
  }, [])

  const navigate = useCallback(
    (delta: number) => {
      if (steps.length === 0) return
      const nextIndex = currentIndex + delta
      if (nextIndex < 0) return
      if (nextIndex >= steps.length) {
        if (nextIndex === steps.length && delta > 0 && topicId) {
          completeTopic(topicId)
          showTopics()
        }
        return
      }
      setDirection(delta)
      setStepIndex(nextIndex)
    },
    [completeTopic, currentIndex, showTopics, steps.length, topicId],
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
    setCompletedTopics(
      GUIDE_TOPICS.filter(
        ({ id }) =>
          window.sessionStorage.getItem(
            `${COMPLETED_TOPIC_STORAGE_KEY}${id}`,
          ) === 'done',
      ).map(({ id }) => id),
    )
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
    document.title = translate('Tri-Alliance Clash - Guide', locale)
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
      if (steps.length === 0) return

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
  }, [navigate, steps.length])

  return {
    locale,
    setLocale,
    side,
    setSide,
    topics: GUIDE_TOPICS,
    completedTopics,
    topicId,
    chooseTopic,
    showTopics,
    steps,
    stepIndex: currentIndex,
    step,
    direction,
    sections,
    navigate,
    jumpToSection,
  }
}
