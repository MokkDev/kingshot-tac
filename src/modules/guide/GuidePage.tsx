import { useEffect, useRef, useState } from 'react'
import { GuideToolbar } from './components/controls/GuideToolbar'
import { BattleMap } from './components/map/BattleMap'
import { GuideStepSheet } from './components/steps/GuideStepSheet'
import { StepNavigation } from './components/steps/StepNavigation'
import { GuideTopicPicker } from './components/steps/GuideTopicPicker'
import { getGuideTopic } from './data/guide-data'
import { useGuideController } from './hooks/use-guide-controller'
import { useMapViewport } from './hooks/use-map-viewport'
import type { GuideStep } from './types/guide'
import { translate } from './utils/localization'

const EMPTY_GUIDE_STEP: GuideStep = { mapFocus: ['ALL'] }

export function GuidePage() {
  const [collapsed, setCollapsed] = useState(false)
  const guide = useGuideController()
  const previousTopicId = useRef(guide.topicId)
  const mapStep = guide.step ?? EMPTY_GUIDE_STEP
  const viewport = useMapViewport({
    step: mapStep,
    side: guide.side,
    enabled: Boolean(guide.topicId),
  })

  useEffect(() => {
    if (guide.topicId) {
      document.getElementById('guide-step-title')?.focus()
    } else if (previousTopicId.current) {
      document.getElementById('topic-picker-title')?.focus()
    }
    previousTopicId.current = guide.topicId
  }, [guide.topicId])

  if (!guide.topicId) {
    return (
      <main id="app" className="landing">
        <div className="landing-main">
          <header className="landing-intro">
            <h1>{translate('Tri-Alliance Clash - Guide', guide.locale)}</h1>
          </header>
          <GuideTopicPicker
            locale={guide.locale}
            topics={guide.topics}
            completedTopics={guide.completedTopics}
            onChoose={(topicId) => {
              setCollapsed(false)
              guide.chooseTopic(topicId)
            }}
          />
        </div>
        <GuideToolbar
          layout="landing"
          locale={guide.locale}
          side={guide.side}
          sections={[]}
          activeSectionIndex={-1}
          onLocaleChange={guide.setLocale}
          onSideChange={guide.setSide}
          onSectionChange={guide.jumpToSection}
        />
      </main>
    )
  }
  if (!guide.step) throw new Error('Selected guide topic has no steps')

  return (
    <main id="app">
      <h1 className="sr">
        {translate('Tri-Alliance Clash - Guide', guide.locale)}
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
        step={mapStep}
        side={guide.side}
        locale={guide.locale}
        viewport={viewport}
      />
      <GuideStepSheet
        step={guide.step}
        stepIndex={guide.stepIndex}
        topicTitle={getGuideTopic(guide.topicId).title}
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
        onChooseTopics={() => {
          setCollapsed(false)
          guide.showTopics()
        }}
      />
    </main>
  )
}
