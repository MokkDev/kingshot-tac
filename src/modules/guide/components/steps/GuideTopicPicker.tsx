import { translate } from '../../utils/localization'
import type { Locale } from '../../utils/localization'
import type { GuideTopic } from '../../types/guide'

interface GuideTopicPickerProps {
  locale: Locale
  topics: GuideTopic[]
  completedTopics: GuideTopic['id'][]
  onChoose: (topicId: GuideTopic['id']) => void
}

export function GuideTopicPicker({
  locale,
  topics,
  completedTopics,
  onChoose,
}: GuideTopicPickerProps) {
  return (
    <section className="topic-picker" aria-labelledby="topic-picker-title">
      <h2 id="topic-picker-title" tabIndex={-1}>
        {translate('Choose a topic', locale)}
      </h2>
      <ul className="topic-list" role="list">
        {topics.map((topic) => (
          <li key={topic.id}>
            <button type="button" onClick={() => onChoose(topic.id)}>
              <span className="topic-copy">
                <span className="topic-title">
                  {translate(topic.title, locale)}
                </span>
                <span className="topic-description">
                  {translate(topic.description, locale)}
                </span>
              </span>
              {completedTopics.includes(topic.id) && (
                <span className="sr">{translate('Completed', locale)}</span>
              )}
              <span className="topic-actions" aria-hidden="true">
                {completedTopics.includes(topic.id) && (
                  <span className="topic-complete">
                    <svg viewBox="0 0 16 16">
                      <path d="m3 8 3.2 3.2L13 4.5" />
                    </svg>
                  </span>
                )}
                <span className="topic-arrow">→</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
