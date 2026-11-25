import { translate } from '../../utils/localization'
import type { Locale } from '../../utils/localization'

interface StepNavigationProps {
  locale: Locale
  stepIndex: number
  stepCount: number
  onNavigate: (delta: number) => void
}

export function StepNavigation({
  locale,
  stepIndex,
  stepCount,
  onNavigate,
}: StepNavigationProps) {
  return (
    <nav className="bar" aria-label="Guide steps">
      <button
        id="prev"
        type="button"
        disabled={stepIndex === 0}
        onClick={() => onNavigate(-1)}
      >
        {translate('Back', locale)}
      </button>
      <button
        id="next"
        type="button"
        disabled={stepIndex === stepCount - 1}
        onClick={() => onNavigate(1)}
      >
        {translate('Next', locale)}
      </button>
    </nav>
  )
}
