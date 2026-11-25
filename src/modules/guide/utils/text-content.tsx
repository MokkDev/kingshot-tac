import type { ReactNode } from 'react'
import { NODE_COORDINATES } from '../data/map-data'
import { RoleBadge } from '../components/content/RoleBadge'
import type { GuideRole } from '../components/content/RoleBadge'
import { replaceSideTokens, translate } from './localization'
import type { Locale } from './localization'
import type { Side } from '../types/guide'

const roleNames = new Set<GuideRole>(['Attack', 'Defense', 'Floater', 'Leader'])
const inlinePattern = /\[(Attack|Defense|Floater|Leader)\]|\b([ABC]\d{1,2})\b/g

export function renderGuideLine(
  line: string,
  side: Side,
  locale: Locale,
  onPeekStart: (node: string) => void,
  onPeekEnd: () => void,
): ReactNode[] {
  const localized = replaceSideTokens(translate(line, locale), side)
  const output: ReactNode[] = []
  let cursor = 0

  for (const match of localized.matchAll(inlinePattern)) {
    const index = match.index
    const fullMatch = match[0]
    if (index > cursor) output.push(localized.slice(cursor, index))

    const role = match[1]
    const node = match[2]
    if (role && roleNames.has(role as GuideRole)) {
      output.push(
        <RoleBadge
          key={`${index}-${role}`}
          role={role as GuideRole}
          locale={locale}
        />,
      )
    } else if (node && node in NODE_COORDINATES) {
      output.push(
        <button
          key={`${index}-${node}`}
          type="button"
          className="node"
          onPointerDown={() => onPeekStart(node)}
          onPointerUp={onPeekEnd}
          onPointerCancel={onPeekEnd}
          onPointerLeave={onPeekEnd}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') onPeekStart(node)
          }}
          onKeyUp={(event) => {
            if (event.key === 'Enter' || event.key === ' ') onPeekEnd()
          }}
          onBlur={onPeekEnd}
        >
          {node}
        </button>,
      )
    } else {
      output.push(fullMatch)
    }

    cursor = index + fullMatch.length
  }

  if (cursor < localized.length) output.push(localized.slice(cursor))
  return output
}
