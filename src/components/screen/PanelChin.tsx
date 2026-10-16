import { useFrame } from '@react-three/fiber'
import { useNavigate } from '@tanstack/react-router'
import { faGithub, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import {
  faBriefcase,
  faChartSimple,
  faEnvelope,
  faFileLines,
  faFolderOpen,
  faHouse,
  faMusic,
} from '@fortawesome/free-solid-svg-icons'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Group, MeshStandardMaterial, PlaneGeometry, type Texture } from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { navItems } from '@/components/wireframe/home/data'
import {
  BUTTON_Y,
  ICON_Z,
  KEY_DEPTH,
  KEY_TRAVEL,
  KEY_Z,
  LOGO_SIZE,
  LOGO_X,
  META_KEY,
  META_SIZE,
  NAV_KEY,
  NAV_SIZE,
  metaX,
  navX,
} from './monitorGeometry'
import { createIconTexture, token, useFontsReady, useLogoSvgTexture } from './panelTextures'

const NAV_ICONS = [faHouse, faBriefcase, faFolderOpen, faChartSimple, faMusic]

const CV_HREF = '/CV%20-%20Muhammad%20Khalid%20Atthoriq.pdf'

// Instagram, LinkedIn, GitHub, Email, then the CV document — every one a key like the menu, so the
// chin reads as one row of controls rather than a mix of buttons and links.
const META = [
  { label: 'Instagram', href: 'https://instagram.com/ffiinn.yy', icon: faInstagram },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/khalidatthoriq', icon: faLinkedinIn },
  { label: 'GitHub', href: 'https://github.com/khalidfinny', icon: faGithub },
  { label: 'Email', href: 'mailto:katthoriq@gmail.com', icon: faEnvelope },
  { label: 'CV', href: CV_HREF, icon: faFileLines },
]

type HoverHandler = (label: string | null, x: number, topY: number) => void

// One physical key: a slab on the chin face with its icon on the front. Hovering lightens the key,
// pressing sinks it into the chin, and the travel is eased rather than snapped.
function PanelKey({
  x,
  keySize,
  iconSize,
  icon,
  label,
  faceColor,
  hoverColor,
  onActivate,
  onHover,
}: {
  x: number
  keySize: number
  iconSize: number
  icon: Texture | null
  label: string
  faceColor: string
  hoverColor: string
  onActivate: () => void
  onHover: HoverHandler
}) {
  const group = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  const geometries = useMemo(
    () => ({
      key: new RoundedBoxGeometry(keySize, keySize, KEY_DEPTH, 2, 0.0016),
      icon: new PlaneGeometry(iconSize, iconSize),
    }),
    [keySize, iconSize],
  )
  const material = useMemo(
    () => new MeshStandardMaterial({ color: faceColor, roughness: 0.42, metalness: 0.1 }),
    [faceColor],
  )

  useEffect(() => {
    material.color.set(hovered ? hoverColor : faceColor)
  }, [material, hovered, hoverColor, faceColor])

  // Ease the key toward its resting or pressed depth.
  useFrame((_, delta) => {
    const node = group.current
    if (!node) return
    const target = pressed ? -KEY_TRAVEL : 0
    node.position.z += (target - node.position.z) * Math.min(1, delta * 20)
  })

  return (
    <group position={[x, BUTTON_Y, 0]}>
      <group ref={group}>
        <mesh geometry={geometries.key} material={material} position={[0, 0, KEY_Z]} />
        {icon ? (
          <mesh geometry={geometries.icon} position={[0, 0, ICON_Z]}>
            <meshBasicMaterial map={icon} transparent depthWrite={false} />
          </mesh>
        ) : null}
      </group>
      {/* Invisible hit plane, so the whole key is clickable without the raycast depending on the
          rounded slab's faces. */}
      <mesh
        position={[0, 0, KEY_Z]}
        onPointerOver={(event) => {
          event.stopPropagation()
          setHovered(true)
          onHover(label, x, BUTTON_Y + keySize / 2)
        }}
        onPointerOut={() => {
          setHovered(false)
          setPressed(false)
          onHover(null, x, BUTTON_Y)
        }}
        onPointerDown={(event) => {
          event.stopPropagation()
          setPressed(true)
        }}
        onPointerUp={(event) => {
          event.stopPropagation()
          setPressed(false)
          onActivate()
        }}
      >
        <planeGeometry args={[keySize, keySize]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}

// The chin's controls. Nothing here is projected DOM: DOM text on a plane re-rasterises every frame
// while the panel turns, which is what made the old labels and logo shimmer.
export default function PanelChin({
  activeIndex,
  onHover,
}: {
  activeIndex: number
  onHover: HoverHandler
}) {
  const navigate = useNavigate()
  const fontsReady = useFontsReady()
  const logo = useLogoSvgTexture('/icons/logo-navbar.svg')

  const colors = useMemo(
    () => ({
      active: token('--color-brand', '#970B2D'),
      idle: token('--color-graphite', '#736661'),
      face: token('--color-paper', '#FFFDFC'),
      faceHover: token('--color-canvas', '#FBF7F3'),
    }),
    [fontsReady],
  )

  // Textures are built once per state, never per frame.
  const navTextures = useMemo(
    () =>
      NAV_ICONS.map((icon, index) =>
        createIconTexture({
          pathData: String(icon.icon[4]),
          viewBoxWidth: icon.icon[0],
          viewBoxHeight: icon.icon[1],
          color: index === activeIndex ? colors.active : colors.idle,
          sizePx: 96,
        }),
      ),
    [colors, activeIndex, fontsReady],
  )

  const metaTextures = useMemo(
    () =>
      META.map((entry) =>
        createIconTexture({
          pathData: String(entry.icon.icon[4]),
          viewBoxWidth: entry.icon.icon[0],
          viewBoxHeight: entry.icon.icon[1],
          color: colors.idle,
          sizePx: 96,
        }),
      ),
    [colors, fontsReady],
  )

  const logoGeometry = useMemo(() => new PlaneGeometry(LOGO_SIZE, LOGO_SIZE), [])
  const logoHitGeometry = useMemo(
    () => new PlaneGeometry(LOGO_SIZE + 0.008, LOGO_SIZE + 0.008),
    [],
  )

  useEffect(
    () => () => {
      for (const texture of [...navTextures, ...metaTextures]) texture.dispose()
    },
    [navTextures, metaTextures],
  )

  const openLink = (href: string) => {
    window.open(href, href.startsWith('mailto:') ? '_self' : '_blank', 'noopener,noreferrer')
  }

  return (
    <group>
      {navItems.map((item, index) => (
        <PanelKey
          key={item.to}
          x={navX(index)}
          keySize={NAV_KEY}
          iconSize={NAV_SIZE}
          icon={navTextures[index]}
          label={item.label}
          faceColor={colors.face}
          hoverColor={colors.faceHover}
          onActivate={() => void navigate({ to: item.to })}
          onHover={onHover}
        />
      ))}

      {/* The brand mark is a flat mark on the chin, not a raised key: it labels the panel rather
          than being another control. It still takes a click, and only draws once its texture has
          loaded — a map of undefined would render as a solid block of the material colour. */}
      <group position={[LOGO_X, BUTTON_Y, 0]}>
        {logo ? (
          <mesh geometry={logoGeometry} position={[0, 0, ICON_Z]}>
            <meshBasicMaterial map={logo} transparent depthWrite={false} />
          </mesh>
        ) : null}
        <mesh
          geometry={logoHitGeometry}
          position={[0, 0, ICON_Z]}
          onPointerOver={(event) => {
            event.stopPropagation()
            onHover('Khalid Atthoriq', LOGO_X, BUTTON_Y + LOGO_SIZE / 2)
          }}
          onPointerOut={() => onHover(null, LOGO_X, BUTTON_Y)}
          onClick={(event) => {
            event.stopPropagation()
            void navigate({ to: '/' })
          }}
        >
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>

      {META.map((entry, index) => (
        <PanelKey
          key={entry.label}
          x={metaX(index)}
          keySize={META_KEY}
          iconSize={META_SIZE}
          icon={metaTextures[index]}
          label={entry.label}
          faceColor={colors.face}
          hoverColor={colors.faceHover}
          onActivate={() => openLink(entry.href)}
          onHover={onHover}
        />
      ))}
    </group>
  )
}
