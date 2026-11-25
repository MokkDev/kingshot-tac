import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { translate } from '../../utils/localization'
import type { Locale } from '../../utils/localization'

const roleDescriptions = {
  Attack:
    'Captures enemy buildings and pushes Garrisons and the Temple. Leaders set your role before the battle.',
  Defense:
    'Protects our buildings and routes. Leaders set your role before the battle.',
  Floater:
    'Reinforces wherever needed. Leaders set your role before the battle.',
  Leader:
    'R5 & R4 - Assigns energy (captains), tags squads and calls plan changes',
}

export type GuideRole = keyof typeof roleDescriptions

interface RoleBadgeProps {
  role: GuideRole
  locale: Locale
}

export function RoleBadge({ role, locale }: RoleBadgeProps) {
  const [open, setOpen] = useState(false)
  const [placement, setPlacement] = useState<'up' | 'down'>('up')
  const [position, setPosition] = useState({ left: 0, top: 0, arrow: '50%' })
  const tooltipId = useId()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const tooltipRef = useRef<HTMLSpanElement>(null)
  const tooltipStyle: CSSProperties & { '--ax': string } = {
    left: position.left,
    top: position.top,
    '--ax': position.arrow,
  }

  useEffect(() => {
    if (!open) return

    const updatePosition = () => {
      const button = buttonRef.current
      const tooltip = tooltipRef.current
      if (!button || !tooltip) return
      const anchor = button.getBoundingClientRect()
      const width = tooltip.offsetWidth
      const height = tooltip.offsetHeight
      const center = anchor.left + anchor.width / 2
      const left = Math.min(
        Math.max(center - width / 2, 8),
        window.innerWidth - width - 8,
      )
      const above = anchor.top > height + 16
      setPlacement(above ? 'up' : 'down')
      setPosition({
        left,
        top: above ? anchor.top - height - 10 : anchor.bottom + 10,
        arrow: `${center - left}px`,
      })
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [locale, open])

  return (
    <span className="role-wrap">
      <button
        ref={buttonRef}
        type="button"
        className={`role r${role[0]}`}
        aria-describedby={tooltipId}
        onClick={() => setOpen(true)}
        onPointerEnter={(event) => {
          if (event.pointerType === 'mouse') setOpen(true)
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === 'mouse') setOpen(false)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setOpen(false)
        }}
      >
        {role}
      </button>
      <span
        ref={tooltipRef}
        id={tooltipId}
        className={`role-tip ${placement}`}
        role="tooltip"
        style={tooltipStyle}
        hidden={!open}
      >
        {translate(roleDescriptions[role], locale)}
      </span>
    </span>
  )
}
