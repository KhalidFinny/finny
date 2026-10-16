// The panel: a bare wall-mounted flat panel, no stand. It frames the whole site, so the
// shell is built from primitives rather than an asset — a frame with a real recess, and an
// exact 16:9 screen.
export const SCREEN_W = 0.379
export const SCREEN_H = (SCREEN_W * 9) / 16
export const BEZEL = 0.011
// The chin is the deeper bottom bezel that carries the controls. Kept shallow on purpose: the
// panel's aspect decides how much of the viewport width it can take, and a deeper chin makes the
// panel tall enough that height binds first and it ends up narrow.
export const CHIN = 0.03
export const PANEL_W = SCREEN_W + BEZEL * 2
export const PANEL_H = SCREEN_H + BEZEL + CHIN
export const PANEL_DEPTH = 0.022
// The cavity is exactly the glass: any lip larger than the glass leaves a visible gap ring
// between the bezel and the page. Depth comes from the recess instead, so the glass still sits
// behind the bezel without a gap around it.
export const LIP = 0
export const RECESS = 0.0045
export const OPENING_W = SCREEN_W + LIP * 2
export const OPENING_H = SCREEN_H + LIP * 2
export const CORNER_RADIUS = 0.002
export const FRONT_FACE_Z = PANEL_DEPTH / 2 + 0.0006
// The screen sits above the panel's centre because the chin is deeper than the top bezel.
export const SCREEN_CENTER_Y = (CHIN - BEZEL) / 2

// The glass, just in front of the cavity's back wall.
export const PLANE_Z = PANEL_DEPTH / 2 - RECESS

// The screen's DOM box is the site's design canvas — the size the whole site is authored at —
// so the site lays out exactly as designed, and the plane's scale maps that box onto the 3D
// screen rect. Authoring the box at the rendered size instead reflows the site at a different
// width than it was designed for, which smushes the layout.
export const SCREEN_PX_W = 1760
export const SCREEN_PX_H = 990
export const PX_PER_UNIT = SCREEN_PX_W / SCREEN_W
// The cavity's radius in the screen plane's own pixels, so the DOM glass is rounded to match.
export const SCREEN_PX_RADIUS = Math.round(CORNER_RADIUS * PX_PER_UNIT)

// --- Chin controls ---
//
// Every chin control is a WebGL mesh with a texture, not projected DOM. DOM text on a CSS3D
// plane is re-rasterised each frame while the panel turns, which shimmers; and a DOM plane
// renders at a slightly different size than the mesh behind it, so highlights misaligned and
// hit areas came up short. Meshes with textures have neither problem.
//
// The controls are bare icons with no plate behind them, so the chin reads as engraved marks.
// Clicks land on a transparent hit plane slightly larger than each icon.

const CHIN_CENTER_Y = -(SCREEN_H + BEZEL) / 2
export const BUTTON_H = 0.018
export const BUTTON_DEPTH = 0.004
export const BUTTON_Y = CHIN_CENTER_Y
export const BUTTON_Z = FRONT_FACE_Z + BUTTON_DEPTH / 2
// Each control is a physical key: a rounded slab on the chin face with its icon on the front.
// Pressing it sinks the key into the chin, which is the travel the animation drives.
export const KEY_DEPTH = 0.004
export const KEY_Z = FRONT_FACE_Z + KEY_DEPTH / 2
export const KEY_TRAVEL = 0.0022
// Icon planes sit just proud of the key's front face. Inside one renderer the projection is
// shared, so this stays aligned no matter the angle.
export const ICON_Z = FRONT_FACE_Z + KEY_DEPTH + 0.0003

// Menu icons on the left, brand mark in the middle, socials and CV on the right.
// Icon size and the key it sits on.
export const NAV_SIZE = 0.010
export const NAV_KEY = NAV_SIZE + 0.008
export const NAV_GAP = 0.006
export const NAV_COUNT = 5
const NAV_LEFT = -PANEL_W / 2 + BEZEL + 0.005
export const navX = (index: number) => NAV_LEFT + NAV_KEY / 2 + index * (NAV_KEY + NAV_GAP)

export const LOGO_SIZE = 0.014
export const LOGO_X = 0

export const META_SIZE = 0.009
export const META_KEY = META_SIZE + 0.008
export const META_GAP = 0.005
// Instagram, LinkedIn, GitHub, Email, then the CV document.
export const META_COUNT = 5
const META_RIGHT = PANEL_W / 2 - BEZEL - 0.005
export const metaX = (index: number) =>
  META_RIGHT - META_KEY / 2 - (META_COUNT - 1 - index) * (META_KEY + META_GAP)

export const FOV = 35
// The panel takes this share of the viewport width. The vertical share is a separate, larger
// cap so the width target wins at normal aspect ratios but the panel can never overflow on a
// short window.
export const PANEL_VIEWPORT_FIT_W = 0.85
export const PANEL_VIEWPORT_FIT_H = 0.94
