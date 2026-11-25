import { GUIDE_SECTIONS } from '../data/guide-data'
import type { GuideStep, Side } from '../types/guide'

export interface DisplayStep extends GuideStep {
  sectionIndex: number
  localIndex: number
  sectionStepCount: number
  sectionTitle: string
}

export function buildDisplaySteps(side: Side): DisplayStep[] {
  return GUIDE_SECTIONS.flatMap(
    ([sectionTitle, sectionSteps], sectionIndex) => {
      const visibleSteps = sectionSteps.filter(
        (step) => !step.side || step.side === side,
      )

      return visibleSteps.map((step, localIndex) => ({
        ...step,
        sectionIndex,
        localIndex,
        sectionStepCount: visibleSteps.length,
        sectionTitle,
      }))
    },
  )
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
