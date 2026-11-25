import { getGuideTopic, GUIDE_SECTIONS } from '../data/guide-data'
import type { GuideStep, GuideTopicId, Side } from '../types/guide'

export interface DisplayStep extends GuideStep {
  sectionIndex: number
  localIndex: number
  sectionStepCount: number
  sectionTitle: string
  topicSectionIndex: number
  topicStepIndex: number
  topicStepCount: number
}

export function buildDisplaySteps(
  side: Side,
  topicId: GuideTopicId,
): DisplayStep[] {
  const topic = getGuideTopic(topicId)

  const topicSteps = topic.sectionIndexes.flatMap(
    (sectionIndex, topicSectionIndex) => {
      const [sectionTitle, sectionSteps] = GUIDE_SECTIONS[sectionIndex]
      const visibleSteps = sectionSteps.filter(
        (step) => !step.side || step.side === side,
      )

      return visibleSteps.map((step, localIndex) => ({
        ...step,
        sectionIndex,
        localIndex,
        sectionStepCount: visibleSteps.length,
        sectionTitle,
        topicSectionIndex,
      }))
    },
  )

  return topicSteps.map((step, topicStepIndex) => ({
    ...step,
    topicStepIndex,
    topicStepCount: topicSteps.length,
  }))
}

export function sectionStartIndex(
  steps: DisplayStep[],
  sectionIndex: number,
): number {
  return steps.findIndex((step) => step.sectionIndex === sectionIndex)
}

export function getStepFocus(step: GuideStep): string[] {
  if (step.mapFocus) return step.mapFocus
  if (step.showRegion) return ['REG']
  const focus = [
    ...(step.highlights ?? []),
    ...(step.roleMarkers ?? []).map(([node]) => node),
    ...(step.arrows ?? []).flatMap(([from, to]) => [from, to]),
  ]
  return focus.length > 0 ? focus : ['ALL']
}
