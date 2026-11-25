import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
  WheelEvent as ReactWheelEvent,
} from 'react'
import { getStepFocus } from '../utils/guide-steps'
import {
  clampViewBox,
  fitViewBox,
  MAP_HEIGHT,
  MAP_WIDTH,
  mapNodePosition,
} from '../utils/map-geometry'
import type { Point, ViewBox } from '../utils/map-geometry'
import type { GuideStep, Side } from '../types/guide'

interface GestureSnapshot {
  center: Point
  distance: number
  viewBox: ViewBox
  pointerCount: number
}

interface UseMapViewportOptions {
  step: GuideStep
  side: Side
  enabled?: boolean
}

export function useMapViewport({
  step,
  side,
  enabled = true,
}: UseMapViewportOptions) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [aspect, setAspect] = useState(MAP_WIDTH / MAP_HEIGHT)
  const [viewBox, setViewBox] = useState<ViewBox>([0, 0, MAP_WIDTH, MAP_HEIGHT])
  const [peekedNode, setPeekedNode] = useState<string | null>(null)
  const viewBoxRef = useRef(viewBox)
  const targetRef = useRef<ViewBox>([0, 0, MAP_WIDTH, MAP_HEIGHT])
  const frameRef = useRef<number | null>(null)
  const pointersRef = useRef(new Map<number, Point>())
  const gestureRef = useRef<GestureSnapshot | null>(null)
  const peekViewBoxRef = useRef<ViewBox | null>(null)
  const lastTapRef = useRef<{ x: number; y: number; at: number } | null>(null)
  const downRef = useRef<{ x: number; y: number; at: number } | null>(null)

  const updateViewBox = useCallback(
    (nextViewBox: ViewBox) => {
      const clamped = clampViewBox(nextViewBox, aspect)
      viewBoxRef.current = clamped
      setViewBox(clamped)
    },
    [aspect],
  )

  const animateTo = useCallback(
    (nextViewBox: ViewBox, updateTarget = true) => {
      const clamped = clampViewBox(nextViewBox, aspect)
      if (updateTarget) targetRef.current = clamped
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)

      const start = viewBoxRef.current
      const startedAt = performance.now()
      const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches
      const tick = (now: number) => {
        const progress = reducedMotion
          ? 1
          : Math.min((now - startedAt) / 420, 1)
        const eased =
          progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2
        updateViewBox(
          start.map(
            (value, index) => value + (clamped[index] - value) * eased,
          ) as ViewBox,
        )
        if (progress < 1) frameRef.current = requestAnimationFrame(tick)
        else frameRef.current = null
      }
      frameRef.current = requestAnimationFrame(tick)
    },
    [aspect, updateViewBox],
  )

  useEffect(() => {
    if (!enabled) return
    const element = mapRef.current
    if (!element) return

    const resizeObserver = new ResizeObserver(() => {
      const { width, height } = element.getBoundingClientRect()
      setAspect(Math.max(width, 100) / Math.max(height, 100))
    })
    resizeObserver.observe(element)
    return () => resizeObserver.disconnect()
  }, [enabled])

  useEffect(() => {
    if (!enabled) {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
      frameRef.current = null
      return
    }
    const nextViewBox = fitViewBox(getStepFocus(step), side, aspect)
    setPeekedNode(null)
    peekViewBoxRef.current = null
    animateTo(nextViewBox)
  }, [animateTo, aspect, enabled, side, step])

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    },
    [],
  )

  const snapshotGesture = useCallback((): GestureSnapshot | null => {
    const pointers = [...pointersRef.current.values()]
    if (pointers.length === 0) return null
    const [first, second] = pointers
    const center: Point =
      pointers.length > 1
        ? [(first[0] + second[0]) / 2, (first[1] + second[1]) / 2]
        : first
    return {
      center,
      distance:
        pointers.length > 1
          ? Math.hypot(first[0] - second[0], first[1] - second[1])
          : 0,
      viewBox: viewBoxRef.current,
      pointerCount: pointers.length,
    }
  }, [])

  const zoomAt = useCallback(
    (clientX: number, clientY: number, factor: number) => {
      const element = mapRef.current
      if (!element) return
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
      const rect = element.getBoundingClientRect()
      const current = viewBoxRef.current
      const scale = current[2] / rect.width
      const worldX = current[0] + (clientX - rect.left) * scale
      const worldY = current[1] + (clientY - rect.top) * scale
      const width = Math.min(
        Math.max(current[2] * factor, 260),
        Math.max(MAP_WIDTH, MAP_HEIGHT * aspect),
      )
      const nextScale = width / rect.width
      updateViewBox([
        worldX - (clientX - rect.left) * nextScale,
        worldY - (clientY - rect.top) * nextScale,
        width,
        width / aspect,
      ])
    },
    [aspect, updateViewBox],
  )

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.target instanceof Element && event.target.closest('.mc')) return
      event.currentTarget.setPointerCapture(event.pointerId)
      pointersRef.current.set(event.pointerId, [event.clientX, event.clientY])
      gestureRef.current = snapshotGesture()
      downRef.current = { x: event.clientX, y: event.clientY, at: Date.now() }
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    },
    [snapshotGesture],
  )

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!pointersRef.current.has(event.pointerId)) return
      pointersRef.current.set(event.pointerId, [event.clientX, event.clientY])
      const gesture = gestureRef.current
      const next = snapshotGesture()
      if (!gesture || !next) return
      if (next.pointerCount !== gesture.pointerCount) {
        gestureRef.current = next
        return
      }

      const element = mapRef.current
      if (!element) return
      const rect = element.getBoundingClientRect()
      const mapScale = gesture.viewBox[2] / rect.width
      const worldX =
        gesture.viewBox[0] + (gesture.center[0] - rect.left) * mapScale
      const worldY =
        gesture.viewBox[1] + (gesture.center[1] - rect.top) * mapScale
      const width =
        next.pointerCount > 1 && next.distance > 0 && gesture.distance > 0
          ? (gesture.viewBox[2] * gesture.distance) / next.distance
          : gesture.viewBox[2]
      const nextWidth = Math.min(
        Math.max(width, 260),
        Math.max(MAP_WIDTH, MAP_HEIGHT * aspect),
      )
      const nextScale = nextWidth / rect.width
      updateViewBox([
        worldX - (next.center[0] - rect.left) * nextScale,
        worldY - (next.center[1] - rect.top) * nextScale,
        nextWidth,
        nextWidth / aspect,
      ])
    },
    [aspect, snapshotGesture, updateViewBox],
  )

  const finishPointer = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!pointersRef.current.has(event.pointerId)) return
      pointersRef.current.delete(event.pointerId)
      gestureRef.current = snapshotGesture()

      const down = downRef.current
      if (
        event.type === 'pointerup' &&
        pointersRef.current.size === 0 &&
        down &&
        Math.hypot(event.clientX - down.x, event.clientY - down.y) < 8 &&
        Date.now() - down.at < 260
      ) {
        const lastTap = lastTapRef.current
        if (
          lastTap &&
          Date.now() - lastTap.at < 320 &&
          Math.hypot(event.clientX - lastTap.x, event.clientY - lastTap.y) < 30
        ) {
          zoomAt(
            event.clientX,
            event.clientY,
            viewBoxRef.current[2] < targetRef.current[2] * 0.7 ? 2.5 : 0.4,
          )
          lastTapRef.current = null
        } else {
          lastTapRef.current = {
            x: event.clientX,
            y: event.clientY,
            at: Date.now(),
          }
        }
      }
      if (pointersRef.current.size === 0) downRef.current = null
    },
    [snapshotGesture, zoomAt],
  )

  const handleWheel = useCallback(
    (event: ReactWheelEvent<HTMLDivElement>) => {
      zoomAt(event.clientX, event.clientY, Math.exp(event.deltaY * 0.0018))
    },
    [zoomAt],
  )

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Home') {
        event.preventDefault()
        animateTo(targetRef.current, false)
        return
      }

      if (event.key === '+' || event.key === '=') {
        event.preventDefault()
        const rect = mapRef.current?.getBoundingClientRect()
        if (rect)
          zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, 0.65)
        return
      }
      if (event.key === '-') {
        event.preventDefault()
        const rect = mapRef.current?.getBoundingClientRect()
        if (rect)
          zoomAt(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            1 / 0.65,
          )
        return
      }
      if (
        !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)
      )
        return

      event.preventDefault()
      const current = viewBoxRef.current
      const horizontal =
        event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0
      const vertical =
        event.key === 'ArrowUp' ? -1 : event.key === 'ArrowDown' ? 1 : 0
      updateViewBox([
        current[0] + horizontal * current[2] * 0.1,
        current[1] + vertical * current[3] * 0.1,
        current[2],
        current[3],
      ])
    },
    [animateTo, updateViewBox, zoomAt],
  )

  const zoomBy = useCallback(
    (factor: number) => {
      const element = mapRef.current
      if (!element) return
      const rect = element.getBoundingClientRect()
      zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, factor)
    },
    [zoomAt],
  )

  const peekStart = useCallback(
    (node: string) => {
      if (peekViewBoxRef.current) return
      const position = mapNodePosition(node, side)
      if (!position) return
      peekViewBoxRef.current = viewBoxRef.current
      setPeekedNode(node)
      const width = Math.min(560, Math.max(MAP_WIDTH, MAP_HEIGHT * aspect))
      animateTo(
        [
          position[0] - width / 2,
          position[1] - width / (2 * aspect),
          width,
          width / aspect,
        ],
        false,
      )
    },
    [animateTo, aspect, side],
  )

  const peekEnd = useCallback(() => {
    const previousViewBox = peekViewBoxRef.current
    if (!previousViewBox) return
    peekViewBoxRef.current = null
    setPeekedNode(null)
    animateTo(previousViewBox, false)
  }, [animateTo])

  const reset = useCallback(
    () => animateTo(targetRef.current, false),
    [animateTo],
  )

  return {
    mapRef,
    viewBox,
    peekedNode,
    handlePointerDown,
    handlePointerMove,
    finishPointer,
    handleWheel,
    handleKeyDown,
    zoomBy,
    reset,
    peekStart,
    peekEnd,
  }
}
