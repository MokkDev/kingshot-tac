import { translate } from '../../utils/localization'
import type { Locale } from '../../utils/localization'

interface StepNavigationProps {
  locale: Locale
  stepIndex: number
  stepCount: number
  onNavigate: (delta: number) => void
  onChooseTopics: () => void
}

export function StepNavigation({
  locale,
  stepIndex,
  stepCount,
  onNavigate,
  onChooseTopics,
}: StepNavigationProps) {
  const isLastStep = stepIndex === stepCount - 1

  return (
    <nav className="bar" aria-label="Guide steps">
      <button
        id="home"
        type="button"
        aria-label={translate('Back to guide home', locale)}
        onClick={onChooseTopics}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-7h6v7" />
        </svg>
      </button>
      <span className="bar-divider" aria-hidden="true" />
      <button
        id="prev"
        type="button"
        disabled={stepIndex === 0}
        onClick={() => onNavigate(-1)}
      >
        {translate('Back', locale)}
      </button>
      <button id="next" type="button" onClick={() => onNavigate(1)}>
        {translate(isLastStep ? 'Finish' : 'Next', locale)}
      </button>
    </nav>
  )
}
