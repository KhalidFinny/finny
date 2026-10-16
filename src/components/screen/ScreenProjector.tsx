import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useState, type RefObject } from 'react'
import { Scene } from 'three'
import { CSS3DObject, CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js'
import { PLANE_Z, PX_PER_UNIT, SCREEN_CENTER_Y, SCREEN_PX_H, SCREEN_PX_W } from './monitorGeometry'

type Props = {
  containerRef: RefObject<HTMLDivElement | null>
  onReady: (element: HTMLElement) => void
}

export default function ScreenProjector({ containerRef, onReady }: Props) {
  const camera = useThree((state) => state.camera)
  const size = useThree((state) => state.size)
  const [panel, setPanel] = useState<{
    renderer: CSS3DRenderer
    scene: Scene
    element: HTMLElement
    object: CSS3DObject
  } | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const element = document.createElement('div')
    const object = new CSS3DObject(element)
    object.position.set(0, SCREEN_CENTER_Y, PLANE_Z)
    object.scale.set(1 / PX_PER_UNIT, 1 / PX_PER_UNIT, 1)
    element.className = 'screen-content'
    element.style.backfaceVisibility = 'hidden'
    element.style.width = `${SCREEN_PX_W}px`
    element.style.height = `${SCREEN_PX_H}px`
    element.style.pointerEvents = 'auto'
    // The page has to read as sunk inside the cavity. Projected DOM always paints above the
    // WebGL bezel, so the recess is drawn on top of the page's edges instead: an inset shadow
    // ring, which is what the bezel lip would cast if it could occlude it.
    element.classList.add('screen-recess')

    // The wheel reaches the glass but the browser does not scroll the page's own scroller: a
    // scroll container inside a 3D-transformed subtree is not treated as a composited scroller.
    // Forwarding the delta to the nearest scrollable ancestor makes the site inside the screen
    // scroll. Events with no scroller under them are left alone, so the default still applies.
    const onWheel = (event: WheelEvent) => {
      let node = event.target instanceof HTMLElement ? event.target : null
      while (node && node !== element) {
        const style = getComputedStyle(node)
        const scrollable =
          (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
          node.scrollHeight > node.clientHeight
        if (scrollable) {
          node.scrollTop += event.deltaY
          event.preventDefault()
          return
        }
        node = node.parentElement
      }
    }
    element.addEventListener('wheel', onWheel, { passive: false })

    const renderer = new CSS3DRenderer({ element: container })
    // CSS3DRenderer's own layers default to pointer-events auto and span the whole canvas,
    // which would swallow orbit drags before they reach it. Turning them off lets events
    // through to the canvas everywhere except the glass.
    const viewLayer = container.firstElementChild
    if (viewLayer instanceof HTMLElement) {
      viewLayer.style.pointerEvents = 'none'
      const cameraLayer = viewLayer.firstElementChild
      if (cameraLayer instanceof HTMLElement) cameraLayer.style.pointerEvents = 'none'
    }

    const scene = new Scene()
    scene.add(object)
    setPanel({ renderer, scene, element, object })

    return () => {
      element.removeEventListener('wheel', onWheel)
      scene.remove(object)
      container.replaceChildren()
      setPanel(null)
    }
  }, [containerRef])

  useEffect(() => {
    panel?.renderer.setSize(size.width, size.height)
  }, [panel, size.width, size.height])

  useEffect(() => {
    if (panel) onReady(panel.element)
  }, [panel, onReady])

  useFrame(() => {
    if (!panel) return
    panel.renderer.render(panel.scene, camera)
  })

  return null
}
