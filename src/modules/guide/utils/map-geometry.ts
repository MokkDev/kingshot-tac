import {
  NODE_COORDINATES,
  SIDE_REGIONS,
  SIDE_TARGET,
  SIDE_THREAT,
} from '../data/map-data'
import { ArrowType } from '../types/guide'
import type { Side } from '../types/guide'

export const MAP_WIDTH = 1600
export const MAP_HEIGHT = 1168
export type ViewBox = [x: number, y: number, width: number, height: number]
export type Point = [x: number, y: number]

export function pointString(point: Point): string {
  return point.join(',')
}

export interface ArrowGeometry {
  start: Point
  end: Point
  endHead: [Point, Point]
  startHead?: [Point, Point]
  strokeWidth: number
}

export function mapNodeKey(key: string, side: Side): string {
  if (key === 'tmp') return key
  const sideLabels = { X: side, Y: SIDE_TARGET[side], Z: SIDE_THREAT[side] }
  const prefix = key[0]
  return `${prefix && prefix in sideLabels ? sideLabels[prefix as keyof typeof sideLabels] : prefix}${key.slice(1)}`
}

export function mapNodePosition(key: string, side: Side): Point | undefined {
  return NODE_COORDINATES[mapNodeKey(key, side)]
}

export function expandMapKeys(keys: string[]): string[] {
  return keys.flatMap((key) => {
    if (key === '@CL') return [13, 21, 22, 23, 29].map((node) => `X${node}`)
    if (key === '@RU')
      return [2, 3, 4, 9, 10, 11, 12, 25, 26].map((node) => `X${node}`)
    if (key === '@HUB')
      return [18, 19, 27, 28, 30, 31].map((node) => `X${node}`)
    if (key === '@CAP') {
      return [
        'X1',
        'X24',
        ...[13, 21, 22, 23, 29].map((node) => `X${node}`),
        ...[2, 3, 4, 9, 10, 11, 12, 25, 26].map((node) => `X${node}`),
      ]
    }
    return [key]
  })
}

export function clampViewBox(viewBox: ViewBox, aspect: number): ViewBox {
  const maxWidth = Math.max(MAP_WIDTH, MAP_HEIGHT * aspect)
  const width = Math.min(Math.max(viewBox[2], 260), maxWidth)
  const height = width / aspect
  const x =
    width >= MAP_WIDTH
      ? (MAP_WIDTH - width) / 2
      : Math.min(Math.max(viewBox[0], 0), MAP_WIDTH - width)
  const y =
    height >= MAP_HEIGHT
      ? (MAP_HEIGHT - height) / 2
      : Math.min(Math.max(viewBox[1], 0), MAP_HEIGHT - height)
  return [x, y, width, height]
}

export function fitViewBox(
  focus: string[],
  side: Side,
  aspect: number,
): ViewBox {
  const maxWidth = Math.max(MAP_WIDTH, MAP_HEIGHT * aspect)
  if (focus[0] === 'ALL') return clampViewBox([0, 0, maxWidth, 0], aspect)

  const points =
    focus[0] === 'REG'
      ? SIDE_REGIONS[side]
      : expandMapKeys(focus)
          .map((key) => mapNodePosition(key, side))
          .filter((point): point is Point => point !== undefined)
  if (points.length === 0) return clampViewBox([0, 0, maxWidth, 0], aspect)

  const xs = points.map(([x]) => x)
  const ys = points.map(([, y]) => y)
  const padding = 170
  let width = Math.max(Math.max(...xs) - Math.min(...xs) + 2 * padding, 720)
  let height = width / aspect
  if (Math.max(...ys) - Math.min(...ys) + 2 * padding > height) {
    height = Math.max(...ys) - Math.min(...ys) + 2 * padding
    width = height * aspect
  }
  return clampViewBox(
    [
      (Math.min(...xs) + Math.max(...xs)) / 2 - width / 2,
      (Math.min(...ys) + Math.max(...ys)) / 2 - height / 2,
      width,
      height,
    ],
    aspect,
  )
}

export function createArrowGeometry(
  from: string,
  to: string,
  type: ArrowType,
  side: Side,
  unit: number,
): ArrowGeometry | undefined {
  const start = mapNodePosition(from, side)
  const end = mapNodePosition(to, side)
  if (!start || !end) return undefined

  const dx = end[0] - start[0]
  const dy = end[1] - start[1]
  const length = Math.hypot(dx, dy)
  if (length === 0) return undefined

  const direction: Point = [dx / length, dy / length]
  const bidirectional = type === ArrowType.Bidirectional
  const linePixels = length / unit
  const padding = Math.min(17, linePixels * 0.2)
  const available = linePixels - 2 * padding
  const headSize = Math.max(
    4,
    Math.min(12, available / (bidirectional ? 3.4 : 2.4)),
  )
  const headLength = headSize * 1.1
  const startPoint: Point = [
    start[0] + direction[0] * padding * unit,
    start[1] + direction[1] * padding * unit,
  ]
  const endPoint: Point = [
    end[0] - direction[0] * padding * unit,
    end[1] - direction[1] * padding * unit,
  ]
  const makeHead = (point: Point, vector: Point): [Point, Point] => [
    [
      point[0] -
        vector[1] * headSize * 0.6 * unit -
        vector[0] * headLength * unit,
      point[1] +
        vector[0] * headSize * 0.6 * unit -
        vector[1] * headLength * unit,
    ],
    [
      point[0] +
        vector[1] * headSize * 0.6 * unit -
        vector[0] * headLength * unit,
      point[1] -
        vector[0] * headSize * 0.6 * unit -
        vector[1] * headLength * unit,
    ],
  ]

  return {
    start: startPoint,
    end: endPoint,
    endHead: makeHead(endPoint, direction),
    startHead: bidirectional
      ? makeHead(startPoint, [-direction[0], -direction[1]])
      : undefined,
    strokeWidth: Math.min(4, Math.max(2.5, available / 10)) * unit,
  }
}
