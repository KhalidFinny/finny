import { useEffect, useState } from 'react'
import { CanvasTexture, LinearFilter, SRGBColorSpace, Texture, TextureLoader } from 'three'

// Labels and icons on the panel are drawn into textures rather than projected as DOM. DOM text
// on a CSS3D plane is re-rasterised every frame while the panel turns, which shimmers — the
// flicker on the button labels and the logo. Textures are rasterised once and then only sampled.

function makeCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas')
  // Drawn oversized so the text stays crisp when the panel is close to the camera.
  canvas.width = Math.max(2, Math.round(width))
  canvas.height = Math.max(2, Math.round(height))
  return canvas
}

function toTexture(canvas: HTMLCanvasElement) {
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.minFilter = LinearFilter
  texture.magFilter = LinearFilter
  texture.needsUpdate = true
  return texture
}

function token(name: string, fallback: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}

// The site's sans, so panel labels match the site rather than a default face.
function panelFont(sizePx: number) {
  return `500 ${sizePx}px "Schibsted Grotesk", ui-sans-serif, system-ui, sans-serif`
}

// Rasterises text into a texture, transparent apart from the glyphs, so the button mesh shows
// through behind it.
export function createTextTexture({
  text,
  color,
  widthPx,
  heightPx,
  letterSpacing = 0.06,
}: {
  text: string
  color: string
  widthPx: number
  heightPx: number
  letterSpacing?: number
}) {
  const scale = 3
  const canvas = makeCanvas(widthPx * scale, heightPx * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) return toTexture(canvas)

  const fontPx = Math.min(heightPx * 0.42, (widthPx / (text.length * 0.72 + 1.4)) * 0.72)
  ctx.font = panelFont(fontPx * scale)
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  // Canvas has no letter-spacing property, so the glyphs are placed individually.
  const spacing = letterSpacing * fontPx * scale
  const upper = text.toUpperCase()
  const widths = [...upper].map((char) => ctx.measureText(char).width)
  const total = widths.reduce((sum, w) => sum + w, 0) + spacing * (upper.length - 1)
  let x = (canvas.width - total) / 2
  for (const [index, char] of [...upper].entries()) {
    ctx.fillText(char, x + widths[index] / 2, canvas.height / 2)
    x += widths[index] + spacing
  }
  return toTexture(canvas)
}

// Draws a FontAwesome icon from its SVG path data.
export function createIconTexture({
  pathData,
  viewBoxWidth,
  viewBoxHeight,
  color,
  sizePx,
}: {
  pathData: string
  viewBoxWidth: number
  viewBoxHeight: number
  color: string
  sizePx: number
}) {
  const scale = 3
  const canvas = makeCanvas(sizePx * scale, sizePx * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) return toTexture(canvas)

  const fit = Math.min(canvas.width / viewBoxWidth, canvas.height / viewBoxHeight) * 0.92
  ctx.save()
  ctx.translate((canvas.width - viewBoxWidth * fit) / 2, (canvas.height - viewBoxHeight * fit) / 2)
  ctx.scale(fit, fit)
  ctx.fillStyle = color
  ctx.fill(new Path2D(pathData))
  ctx.restore()
  return toTexture(canvas)
}

// Loads the brand mark so it can be mapped onto a mesh like the other panel controls.
export function useLogoSvgTexture(url: string) {
  const [texture, setTexture] = useState<Texture | null>(null)

  useEffect(() => {
    let cancelled = false
    new TextureLoader().load(url, (loaded) => {
      if (cancelled) {
        loaded.dispose()
        return
      }
      loaded.colorSpace = SRGBColorSpace
      setTexture(loaded)
    })
    return () => {
      cancelled = true
    }
  }, [url])

  return texture
}

// Canvas text needs the font present, or it rasterises a fallback face. This flips once the
// site's fonts have loaded so the textures can be rebuilt against the real one.
export function useFontsReady() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let cancelled = false
    void document.fonts.ready.then(() => {
      if (!cancelled) setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])
  return ready
}

export { token }
