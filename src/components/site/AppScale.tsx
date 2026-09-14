// The "app window" scale-to-fit frame. Author the app at a fixed design size
// (BASE_W x BASE_H, 16:9) and scale the whole composition to fit the viewport,
// centered on the wallpaper. This makes the app look identical on any screen /
// aspect ratio / zoom level — including a laptop in a small framed browser.
//
// The scale value is exposed via context so interactive children that read raw
// pointer coordinates (e.g. the draggable canvas) can divide by it.
import { createContext, useContext, type ReactNode } from 'react'
import { useScaleToFit } from '@/lib/useScaleToFit'

export const BASE_W = 1760
export const BASE_H = 990

const ScaleContext = createContext(1)
export const useAppScale = () => useContext(ScaleContext)

export default function AppScale({ children }: { children: ReactNode }) {
  const scale = useScaleToFit(BASE_W, BASE_H)

  return (
    <ScaleContext.Provider value={scale}>
      <div className="relative h-dvh w-full overflow-hidden bg-wall">
        <div
          className="absolute"
          style={{
            left: '50%',
            top: '50%',
            width: BASE_W,
            height: BASE_H,
            marginLeft: -BASE_W / 2,
            marginTop: -BASE_H / 2,
            transform: `scale(${scale})`,
            transformOrigin: '50% 50%',
          }}
        >
          {children}
        </div>
      </div>
    </ScaleContext.Provider>
  )
}
