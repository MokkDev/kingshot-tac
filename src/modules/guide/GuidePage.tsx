import { useState } from 'react'
import { GuideToolbar } from './components/controls/GuideToolbar'
import { BattleMap } from './components/map/BattleMap'
import { GuideStepSheet } from './components/steps/GuideStepSheet'
import { StepNavigation } from './components/steps/StepNavigation'
import { useGuideController } from './hooks/use-guide-controller'
import { useMapViewport } from './hooks/use-map-viewport'
import { translate } from './utils/localization'

export function GuidePage() {
  const [collapsed, setCollapsed] = useState(false)
  const guide = useGuideController()
  const viewport = useMapViewport({ step: guide.step, side: guide.side })

  return (
    <main id="app">
      <h1 className="sr">
        {translate('Tri-Alliance Clash member guide', guide.locale)}
      </h1>
      <GuideToolbar
        locale={guide.locale}
        side={guide.side}
        sections={guide.sections}
        activeSectionIndex={guide.step.sectionIndex}
        onLocaleChange={guide.setLocale}
        onSideChange={guide.setSide}
        onSectionChange={guide.jumpToSection}
      />
      <BattleMap
        step={guide.step}
        side={guide.side}
        locale={guide.locale}
        viewport={viewport}
      />
      <GuideStepSheet
        step={guide.step}
        stepIndex={guide.stepIndex}
        side={guide.side}
        locale={guide.locale}
        collapsed={collapsed}
        direction={guide.direction}
        onToggleCollapsed={() => setCollapsed((value) => !value)}
        onNavigate={guide.navigate}
        onPeekStart={viewport.peekStart}
        onPeekEnd={viewport.peekEnd}
      />
      <StepNavigation
        locale={guide.locale}
        stepIndex={guide.stepIndex}
        stepCount={guide.steps.length}
        onNavigate={guide.navigate}
      />
    </main>
  )
}
