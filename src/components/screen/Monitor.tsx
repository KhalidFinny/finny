import { useMemo } from 'react'
import { BoxGeometry, ExtrudeGeometry, MeshStandardMaterial, Path, Shape } from 'three'
import { CORNER_RADIUS, OPENING_H, OPENING_W, PANEL_DEPTH, PANEL_H, PANEL_W, SCREEN_CENTER_Y } from './monitorGeometry'
import PanelChin from './PanelChin'

function token(name: string, fallback: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}

// Rounded rectangle as a path, wound clockwise from the top-left corner.
function roundedRect(path: Shape | Path, width: number, height: number, radius: number, cy: number) {
  const x0 = -width / 2
  const x1 = width / 2
  const y0 = cy - height / 2
  const y1 = cy + height / 2
  const r = Math.min(radius, width / 2, height / 2)
  path.moveTo(x0 + r, y0)
  path.lineTo(x1 - r, y0)
  path.absarc(x1 - r, y0 + r, r, -Math.PI / 2, 0, false)
  path.lineTo(x1, y1 - r)
  path.absarc(x1 - r, y1 - r, r, 0, Math.PI / 2, false)
  path.lineTo(x0 + r, y1)
  path.absarc(x0 + r, y1 - r, r, Math.PI / 2, Math.PI, false)
  path.lineTo(x0, y0 + r)
  path.absarc(x0 + r, y0 + r, r, Math.PI, Math.PI * 1.5, false)
  return path
}

// The panel shell: a frame with a real cavity, so the glass sits recessed behind a lip and the
// bezel reads as having depth. The screen's DOM is projected onto that recessed plane, and the
// chin carries physical buttons.
export default function Monitor({
  activeIndex,
  onHover,
}: {
  activeIndex: number
  onHover: (label: string | null, x: number, topY: number) => void
}) {
  const frame = useMemo(() => {
    const shape = new Shape()
    roundedRect(shape, PANEL_W, PANEL_H, 0.004, 0)
    const hole = new Path()
    roundedRect(hole, OPENING_W, OPENING_H, CORNER_RADIUS, SCREEN_CENTER_Y)
    shape.holes.push(hole)
    const geometry = new ExtrudeGeometry(shape, {
      depth: PANEL_DEPTH,
      bevelEnabled: true,
      bevelThickness: 0.0006,
      bevelSize: 0.0006,
      bevelSegments: 2,
      curveSegments: 6,
    })
    // ExtrudeGeometry grows along +Z from zero; centre it on the panel's depth.
    geometry.translate(0, 0, -PANEL_DEPTH / 2)
    return geometry
  }, [])

  // Closes the cavity from behind, so the back is a solid slab rather than a hole.
  const backing = useMemo(() => new BoxGeometry(OPENING_W, OPENING_H, PANEL_DEPTH * 0.4), [])

  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        // Paper, the site's raised-surface token, so the panel reads as a surface against the
        // canvas-coloured wall.
        color: token('--color-paper', '#FFFDFC'),
        roughness: 0.72,
        metalness: 0,
      }),
    [],
  )

  // ExtrudeGeometry takes its materials by group: index 0 is the front and back faces, index 1
  // the extruded sides — which includes the cavity walls. Toning the sides darker is what makes
  // the panel read as a slab with depth instead of a flat sheet, and darkens the recess around
  // the glass the way a real screen's edge does.
  const edgeMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        // Only a shade darker than the shell: enough to separate the slab's edge from the wall
        // and to darken the recess around the glass, without reading as a frame in its own right.
        color: token('--color-line', '#E7D5D1'),
        roughness: 0.6,
        metalness: 0.05,
      }),
    [],
  )

  return (
    <group>
      <mesh geometry={frame} material={[material, edgeMaterial]} />
      <mesh
        geometry={backing}
        material={material}
        position={[0, SCREEN_CENTER_Y, -PANEL_DEPTH / 2 + PANEL_DEPTH * 0.2]}
      />
      <PanelChin activeIndex={activeIndex} onHover={onHover} />
    </group>
  )
}
