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
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
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
