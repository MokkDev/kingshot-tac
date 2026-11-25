import { useRef } from 'react'
import { translate } from '../../utils/localization'
import type { Locale } from '../../utils/localization'
import { renderGuideLine } from '../../utils/text-content'
import type { DisplayStep } from '../../utils/guide-steps'
import type { Side } from '../../types/guide'
import { RoleBadge } from '../content/RoleBadge'
import type { GuideRole } from '../content/RoleBadge'

interface GuideStepSheetProps {
  step: DisplayStep
  stepIndex: number
  side: Side
  locale: Locale
  collapsed: boolean
  direction: number
  onToggleCollapsed: () => void
  onNavigate: (delta: number) => void
  onPeekStart: (node: string) => void
  onPeekEnd: () => void
}

export function GuideStepSheet({
  step,
  stepIndex,
  side,
  locale,
  collapsed,
  direction,
  onToggleCollapsed,
  onNavigate,
  onPeekStart,
  onPeekEnd,
}: GuideStepSheetProps) {
  const swipe = useRef<{ x: number; y: number; at: number } | null>(null)
  const sectionName = translate(step.sectionTitle, locale)
  const stepName = `${step.sectionIndex + 1}. ${sectionName}`
  const progressName = `${step.sectionIndex + 1}.${step.localIndex + 1} / ${step.sectionIndex + 1}.${step.sectionStepCount}`

  return (
    <section
      className={`sheet${collapsed ? ' min' : ''}`}
      aria-live="polite"
      onPointerDown={(event) => {
        if (
          event.target instanceof Element &&
          event.target.closest('.role, .node')
        )
          return
        swipe.current = { x: event.clientX, y: event.clientY, at: Date.now() }
      }}
      onPointerUp={(event) => {
        if (!swipe.current) return
        const { x, y, at } = swipe.current
        swipe.current = null
        const dx = event.clientX - x
        const dy = event.clientY - y
        if (
          Date.now() - at < 700 &&
          Math.abs(dx) > 48 &&
          Math.abs(dx) > 1.6 * Math.abs(dy)
        ) {
          onNavigate(dx < 0 ? 1 : -1)
        }
      }}
      onPointerCancel={() => {
        swipe.current = null
      }}
    >
      <div className="sh">
        <b>{stepName}</b>
        <span>{progressName}</span>
        <button
          type="button"
          className="collapse"
          aria-label={translate('Collapse text', locale)}
          aria-expanded={!collapsed}
          onClick={onToggleCollapsed}
        >
          <svg viewBox="0 0 30.727 30.727" aria-hidden="true">
            <path d="M29.994 10.183 15.363 24.812.733 10.184a2.5 2.5 0 0 1 3.536-3.536l11.094 11.093L26.46 6.647a2.5 2.5 0 0 1 3.535 3.536Z" />
          </svg>
        </button>
      </div>

      <div className="seg" aria-hidden="true">
        {Array.from({ length: step.sectionStepCount }, (_, index) => (
          <i key={index} className={index <= step.localIndex ? 'on' : ''} />
        ))}
      </div>

      {step.chips && (
        <div className="chips">
          {step.chips.map((item, index) => {
            const role = item.match(
              /^\[(Attack|Defense|Floater|Leader)\]$/,
            )?.[1] as GuideRole | undefined
            return role ? (
              <RoleBadge key={`${item}-${index}`} role={role} locale={locale} />
            ) : (
              <span
                key={`${item}-${index}`}
                className={item.startsWith('[') ? 'n' : ''}
              >
                {translate(item, locale)}
              </span>
            )
          })}
        </div>
      )}

      <div
        key={stepIndex}
        className={`tx${step.text.startsWith('Your job') ? ' job' : ''}${direction ? ` slide-${direction < 0 ? 'back' : 'forward'}` : ''}`}
      >
        {translate(step.text, locale)
          .split('\n')
          .map((line, index) => (
            <div key={`${stepIndex}-${index}`}>
              {renderGuideLine(line, side, locale, onPeekStart, onPeekEnd)}
            </div>
          ))}
      </div>
      <p className="hint" hidden={stepIndex > 0 || direction !== 0}>
        {translate(
          'Swipe the card or use the buttons. Pinch the map to zoom. Hold an underlined node name (like A28) to peek at it.',
          locale,
        )}
      </p>
    </section>
  )
}
