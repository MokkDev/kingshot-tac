import mapImage from '../../../../../html/map.webp'
import { SIDE_REGIONS } from '../../data/map-data'
import {
  createArrowGeometry,
  expandMapKeys,
  MAP_HEIGHT,
  MAP_WIDTH,
  mapNodePosition,
  pointString,
} from '../../utils/map-geometry'
import { replaceSideTokens, translate } from '../../utils/localization'
import type { Locale } from '../../utils/localization'
import { SideRole } from '../../types/guide'
import type { GuideStep, Side } from '../../types/guide'
import type { useMapViewport } from '../../hooks/use-map-viewport'

const roleColors: Record<SideRole, string> = {
  [SideRole.Attack]: '#c2410c',
  [SideRole.Defense]: '#1d4ed8',
  [SideRole.Floater]: '#7e22ce',
  [SideRole.Leader]: '#0f766e',
}

interface BattleMapProps {
  step: GuideStep
  side: Side
  locale: Locale
  viewport: ReturnType<typeof useMapViewport>
}

export function BattleMap({ step, side, locale, viewport }: BattleMapProps) {
  const { mapRef, viewBox, peekedNode } = viewport
  const unit = viewBox[2] / Math.max(mapRef.current?.clientWidth ?? 200, 200)
  const highlightedNodes = expandMapKeys(step.highlights ?? [])
  const manyHighlights = highlightedNodes.length > 4
  const viewBoxText = viewBox.join(' ')

  return (
    <div
      ref={mapRef}
      className="map"
      role="region"
      tabIndex={0}
      aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight + - Home"
      aria-label={translate(
        'Map of the Tri-Alliance Clash battlefield with the current step highlighted',
        locale,
      )}
      onPointerDown={viewport.handlePointerDown}
      onPointerMove={viewport.handlePointerMove}
      onPointerUp={viewport.finishPointer}
      onPointerCancel={viewport.finishPointer}
      onWheel={viewport.handleWheel}
      onKeyDown={viewport.handleKeyDown}
    >
      <svg
        viewBox={viewBoxText}
        role="img"
        aria-label={translate(
          'Map of the Tri-Alliance Clash battlefield with the current step highlighted',
          locale,
        )}
        preserveAspectRatio="none"
      >
        <image
          href={mapImage}
          x="0"
          y="0"
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
        />

        {step.showRegion && (
          <polygon
            className="reg"
            points={SIDE_REGIONS[side].map(pointString).join(' ')}
            strokeWidth={3 * unit}
            strokeDasharray={`${10 * unit} ${6 * unit}`}
          />
        )}

        {(step.arrows ?? []).map(([from, to, type], index) => {
          const arrow = createArrowGeometry(from, to, type, side, unit)
          if (!arrow) return null
          const colorClass = `a-${type}`
          return (
            <g
              key={`${from}-${to}-${index}`}
              className={`ar ${colorClass}`}
              strokeWidth={arrow.strokeWidth}
            >
              <line
                x1={arrow.start[0]}
                y1={arrow.start[1]}
                x2={arrow.end[0]}
                y2={arrow.end[1]}
              />
              <polyline
                points={`${pointString(arrow.endHead[0])} ${pointString(arrow.end)} ${pointString(arrow.endHead[1])}`}
              />
              {arrow.startHead && (
                <polyline
                  points={`${pointString(arrow.startHead[0])} ${pointString(arrow.start)} ${pointString(arrow.startHead[1])}`}
                />
              )}
            </g>
          )
        })}

        {highlightedNodes.map((key) => {
          const point = mapNodePosition(key, side)
          if (!point) return null
          return manyHighlights ? (
            <circle
              key={key}
              cx={point[0] + Math.max(22, 6 * unit)}
              cy={point[1] - Math.max(26, 7 * unit)}
              r={4 * unit}
              fill="#0f172a"
              stroke="#fff"
              strokeWidth={1.5 * unit}
            />
          ) : (
            <g key={key}>
              <circle
                cx={point[0]}
                cy={point[1]}
                r={Math.max(
                  (key === 'tmp' ? 18 : 11) * unit,
                  key === 'tmp' ? 44 : 30,
                )}
                fill="none"
                stroke="#fff"
                strokeOpacity=".9"
                strokeWidth={6 * unit}
              />
              <circle
                className="ring"
                cx={point[0]}
                cy={point[1]}
                r={Math.max(
                  (key === 'tmp' ? 18 : 11) * unit,
                  key === 'tmp' ? 44 : 30,
                )}
                strokeWidth={2.8 * unit}
              />
            </g>
          )
        })}

        {(step.roleMarkers ?? []).map(([key, role]) => {
          const point = mapNodePosition(key, side)
          if (!point) return null
          return (
            <g key={`${key}-${role}`}>
              <circle
                cx={point[0]}
                cy={point[1]}
                r={Math.max(11 * unit, 30)}
                fill="none"
                stroke="#fff"
                strokeOpacity=".9"
                strokeWidth={6.2 * unit}
              />
              <circle
                cx={point[0]}
                cy={point[1]}
                r={Math.max(11 * unit, 30)}
                fill="none"
                stroke={roleColors[role]}
                strokeWidth={3 * unit}
              />
            </g>
          )
        })}

        {(step.mapMarkers ?? []).map(
          ([key, untranslatedLabel, role], index) => {
            const point = mapNodePosition(key, side)
            if (!point) return null
            const label = replaceSideTokens(
              translate(untranslatedLabel, locale),
              side,
            )
            const width = (label.length * 6.8 + 22) * unit
            const x = Math.min(
              Math.max(point[0], viewBox[0] + width / 2 + 4 * unit),
              viewBox[0] + viewBox[2] - width / 2 - 4 * unit,
            )
            const y =
              point[1] - 36 * unit < viewBox[1] + 16 * unit
                ? point[1] + 38 * unit
                : point[1] - 36 * unit
            return (
              <g key={`${key}-${index}`}>
                <rect
                  className="mk"
                  x={x - width / 2}
                  y={y - 12 * unit}
                  width={width}
                  height={24 * unit}
                  rx={12 * unit}
                  strokeWidth={2 * unit}
                  stroke={role ? roleColors[role] : undefined}
                />
                <text className="mt" x={x} y={y} fontSize={13 * unit}>
                  {label}
                </text>
              </g>
            )
          },
        )}

        {peekedNode &&
          (() => {
            const point = mapNodePosition(peekedNode, side)
            if (!point) return null
            const width = (peekedNode.length * 8 + 20) * unit
            const radius = Math.max(15 * unit, 34)
            return (
              <g>
                <circle
                  cx={point[0]}
                  cy={point[1]}
                  r={radius}
                  fill="none"
                  stroke="#fff"
                  strokeWidth={7 * unit}
                />
                <circle
                  cx={point[0]}
                  cy={point[1]}
                  r={radius}
                  fill="none"
                  stroke="#db2777"
                  strokeWidth={4 * unit}
                />
                <rect
                  x={point[0] - width / 2}
                  y={point[1] - 44 * unit}
                  width={width}
                  height={22 * unit}
                  rx={11 * unit}
                  fill="#db2777"
                />
                <text
                  x={point[0]}
                  y={point[1] - 33 * unit}
                  fill="#fff"
                  fontSize={13 * unit}
                  fontWeight="700"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {peekedNode}
                </text>
              </g>
            )
          })()}
      </svg>

      <div className="mc">
        <button
          type="button"
          aria-label={translate('Zoom in', locale)}
          onClick={() => viewport.zoomBy(0.65)}
        >
          +
        </button>
        <button
          type="button"
          aria-label={translate('Zoom out', locale)}
          onClick={() => viewport.zoomBy(1 / 0.65)}
        >
          −
        </button>
        <button
          type="button"
          aria-label={translate('Reset view', locale)}
          onClick={viewport.reset}
        >
          ⤢
        </button>
      </div>
      <div className="cr">Map by Daryl, kingshotguides.com (edited)</div>
    </div>
  )
}
