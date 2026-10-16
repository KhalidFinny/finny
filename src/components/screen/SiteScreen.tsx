import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useRouterState } from '@tanstack/react-router'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import Monitor from './Monitor'
import { navItems } from '@/components/wireframe/home/data'
import ScreenProjector from './ScreenProjector'
import {
  FOV,
  PANEL_VIEWPORT_FIT_H,
  PANEL_VIEWPORT_FIT_W,
  PANEL_H,
  PANEL_W,
  PLANE_Z,
} from './monitorGeometry'

// Resting orientation, and the spring that always pulls the panel back to it. The drag only
// displaces the panel; it never stays where it was left.
const HOME_THETA = 0
const HOME_PHI = Math.PI / 2
const MIN_PHI = 0.85
const MAX_PHI = 2.2
// Radians of rotation per pixel dragged. Low on purpose: the panel should feel heavy, not
// skate away from the cursor.
const DRAG_SENSITIVITY = 0.002
// Spring constants for the return. Damping ratio ~0.71: it settles with a small overshoot,
// which is what gives the movement weight instead of snapping.
const SPRING_STIFFNESS = 45
const SPRING_DAMPING = 9.5
// Cap on carried-over velocity, so a fast flick cannot throw the panel.
const MAX_ANGULAR_VELOCITY = 3

// The opening: on first reveal the panel arrives from this fraction of its resting size, so
// the site's first paint is the panel coming in rather than already being there. The zoom is
// applied through the camera, which the projected DOM renders from as well, so the glass
// scales with the panel for free and lands back at exactly 1:1.
const OPENING_FROM = 0.6
const OPENING_SECONDS = 0.9
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

// Wrap an angle into (-PI, PI]. The panel spins freely, so on release it has to come home the
// short way instead of unwinding a whole turn.
const shortestAngle = (value: number) => {
  const wrapped = ((value + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI
  return wrapped
}

// R3F measures its own container, which can disagree with the layer we measured for the
// panel scale; any disagreement shows up as the site being resampled (soft text). Feeding it
// the same numbers keeps the projected plane at exactly 1:1.
function LayerSizeSync({ width, height }: { width: number; height: number }) {
  const setSize = useThree((state) => state.setSize)

  useEffect(() => {
    setSize(width, height)
  }, [setSize, width, height])

  return null
}

// Drags the camera around the panel and springs it home on release. Rotating the camera
// rather than the panel keeps the WebGL scene and the projected DOM in step for free, since
// both render from this same camera.
function PanelRig({
  panelScale,
  revealed,
  layerRef,
  onArrivalSettled,
}: {
  panelScale: number
  revealed: boolean
  layerRef: RefObject<HTMLDivElement | null>
  onArrivalSettled: () => void
}) {
  const camera = useThree((state) => state.camera)
  const gl = useThree((state) => state.gl)
  const size = useThree((state) => state.size)
  const state = useRef({
    theta: HOME_THETA,
    phi: HOME_PHI,
    vTheta: 0,
    vPhi: 0,
    dragging: false,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
  })
  // Progress of the arrival, 0 to 1.
  const opening = useRef(0)
  const settled = useRef(false)
  const reducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  useEffect(() => {
    const element = gl.domElement
    const s = state.current

    const onDown = (event: PointerEvent) => {
      s.dragging = true
      // While turning, the projected planes stop taking pointer events. Otherwise the cursor
      // sweeping across the control bar triggers its hover styles every frame, and those
      // repaints read as the bar flickering.
      layerRef.current?.setAttribute('data-turning', 'true')
      s.lastX = event.clientX
      s.lastY = event.clientY
      s.lastTime = performance.now()
      s.vTheta = 0
      s.vPhi = 0
      element.setPointerCapture(event.pointerId)
    }

    const onMove = (event: PointerEvent) => {
      if (!s.dragging) return
      const now = performance.now()
      const seconds = Math.max((now - s.lastTime) / 1000, 1 / 240)
      // Inverted on purpose: the panel follows the pointer the way a held object would, so
      // dragging right turns its right edge away from you rather than swinging it round.
      const dTheta = -(event.clientX - s.lastX) * DRAG_SENSITIVITY
      const dPhi = -(event.clientY - s.lastY) * DRAG_SENSITIVITY
      s.lastX = event.clientX
      s.lastY = event.clientY
      s.lastTime = now
      // Free spin: no clamp on theta, so the panel can be turned all the way round.
      s.theta += dTheta
      s.phi = clamp(s.phi + dPhi, MIN_PHI, MAX_PHI)
      // Per-second velocity, carried into the spring on release as inertia.
      s.vTheta = clamp(dTheta / seconds, -MAX_ANGULAR_VELOCITY, MAX_ANGULAR_VELOCITY)
      s.vPhi = clamp(dPhi / seconds, -MAX_ANGULAR_VELOCITY, MAX_ANGULAR_VELOCITY)
    }

    const onUp = (event: PointerEvent) => {
      s.dragging = false
      layerRef.current?.removeAttribute('data-turning')
      if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId)
    }

    element.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      element.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [gl, layerRef])

  useFrame((_, delta) => {
    const s = state.current
    const dt = Math.min(delta, 1 / 30)

    if (!s.dragging) {
      // Come home the short way, however many turns the panel was spun.
      s.theta = shortestAngle(s.theta)
      s.vTheta += (SPRING_STIFFNESS * (HOME_THETA - s.theta) - SPRING_DAMPING * s.vTheta) * dt
      s.vPhi += (SPRING_STIFFNESS * (HOME_PHI - s.phi) - SPRING_DAMPING * s.vPhi) * dt
      s.theta += s.vTheta * dt
      s.phi += s.vPhi * dt
    }

    // The panel waits at its start size while the boot mask is up, then runs the arrival once.
    if (!reducedMotion && revealed && opening.current < 1) {
      opening.current = Math.min(1, opening.current + dt / OPENING_SECONDS)
    }
    const zoom = reducedMotion
      ? 1
      : OPENING_FROM + (1 - OPENING_FROM) * easeOutCubic(opening.current)
    // Reported once, and immediately under reduced motion: the chin's tooltips wait for it,
    // since they anchor to a panel whose framing is still changing until then.
    if (!settled.current && (reducedMotion || opening.current >= 1)) {
      settled.current = true
      onArrivalSettled()
    }

    // The screen plane sits in front of the camera target, which magnifies it slightly; the
    // offset is added so the projection lands at exactly panelScale pixels per world unit and
    // the site is never resampled.
    const radius =
      size.height / (2 * Math.tan((FOV * Math.PI) / 360) * panelScale * zoom) + PLANE_Z
    camera.position.set(
      radius * Math.sin(s.phi) * Math.sin(s.theta),
      radius * Math.cos(s.phi),
      radius * Math.sin(s.phi) * Math.cos(s.theta),
    )
    camera.lookAt(0, 0, 0)
  })

  return null
}

// The site's container: a monitor panel filling the window, with the whole site rendered on
// its screen. It sits at the root so navigating between sections swaps only the screen's
// content — the panel, the canvas and the WebGL context stay mounted.
export default function SiteScreen({
  children,
  revealed,
}: {
  children: ReactNode
  revealed: boolean
}) {
  const layerRef = useRef<HTMLDivElement>(null)
  const [isDesktop, setIsDesktop] = useState(false)
  const [screenElement, setScreenElement] = useState<HTMLElement | null>(null)
  const [hoveredControl, setHoveredControl] = useState<{ label: string; x: number; topY: number } | null>(null)
  const [viewport, setViewport] = useState<{ width: number; height: number } | null>(null)
  // Held back until the panel's arrival has finished: a label anchored to a panel that is still
  // scaling would land in the wrong place.
  const [arrivalSettled, setArrivalSettled] = useState(false)
  const handleArrivalSettled = useCallback(() => setArrivalSettled(true), [])

  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)')
    const sync = () => setIsDesktop(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!isDesktop) return
    const layer = layerRef.current
    if (!layer) return
    const measure = () => setViewport({ width: layer.clientWidth, height: layer.clientHeight })
    // Measure once up front as well as on change: the observer alone only fires later, which
    // would leave the first paint unframed.
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(layer)
    return () => observer.disconnect()
  }, [isDesktop])

  const handleReady = useCallback((element: HTMLElement) => setScreenElement(element), [])
  const handleHover = useCallback(
    (label: string | null, x: number, topY: number) => setHoveredControl(label ? { label, x, topY } : null),
    [],
  )
  // The active section is shown by the button mesh, not by the label plane.
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const activeIndex = navItems.findIndex((item) => item.to === pathname)

  // Rendered pixels per world unit. The panel takes PANEL_VIEWPORT_FIT_W of the viewport
  // width, capped so it can never exceed the vertical share on a short window. Fixing this
  // ratio rather than a camera distance keeps the panel the same share at any viewport size.
  const panelScale = useMemo(() => {
    if (!viewport) return 0
    return Math.min(
      (PANEL_VIEWPORT_FIT_W * viewport.width) / PANEL_W,
      (PANEL_VIEWPORT_FIT_H * viewport.height) / PANEL_H,
    )
  }, [viewport])

  // Below the desktop breakpoint the site renders plainly: no canvas, no frame.
  if (!isDesktop) return <>{children}</>

  return (
    <div className="relative isolate h-dvh w-full overflow-hidden bg-wall">
      {viewport && panelScale ? (
        <Canvas
          flat
          dpr={[1, 2]}
          gl={{ antialias: true }}
          camera={{ position: [0, 0, 1], fov: FOV, near: 0.01, far: 10 }}
        >
          {/* Ambient carries the surface colour: three scales ambient by 1/PI, so it has to
              sit at PI to render the shell at its exact token colour. The two side lights
              have no Z component, so they graze the edges while the panel turns without
              brightening the screen face. */}
          <ambientLight intensity={Math.PI} />
          <directionalLight position={[-1.6, 1, 0]} intensity={0.4} />
          <directionalLight position={[1.6, -1, 0]} intensity={0.3} />
          <LayerSizeSync width={viewport.width} height={viewport.height} />
          <PanelRig
            panelScale={panelScale}
            revealed={revealed}
            layerRef={layerRef}
            onArrivalSettled={handleArrivalSettled}
          />
          <Monitor activeIndex={activeIndex} onHover={handleHover} />
          <ScreenProjector containerRef={layerRef} onReady={handleReady} />
        </Canvas>
      ) : null}
      {/* After the canvas in DOM order so the projected content paints over it. The layer is
          pointer-transparent; the planes inside it opt back in. */}
      <div ref={layerRef} className="pointer-events-none absolute inset-0 overflow-hidden" />
      {/* Tooltip portalled to the body with a high z-index. The canvas gets its own compositor
          layer in a real browser and can paint over a plain absolutely-positioned sibling, which
          is why the label could go missing; a body-level portal cannot be covered that way. */}
      {hoveredControl && arrivalSettled
        ? createPortal(
            <div
              className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-full"
              style={{
                left: `calc(50% + ${hoveredControl.x * panelScale}px)`,
                // Anchored to the control's own top edge, not the panel's: the panel fills almost
                // the whole viewport, so a label above the panel would sit off-screen.
                top: `calc(50% - ${hoveredControl.topY * panelScale + 8}px)`,
              }}
            >
              <span className="ui-sticker-label bg-ink text-paper">{hoveredControl.label}</span>
            </div>,
            document.body,
          )
        : null}
      {screenElement ? createPortal(children, screenElement) : null}
    </div>
  )
}
