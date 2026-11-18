import { useMemo } from 'react'
import Svg, {
  Defs,
  FeGaussianBlur,
  Filter,
  G,
  LinearGradient,
  Rect,
  Stop
} from 'react-native-svg'
import {
  columnStops,
  DEFAULT_CURTAIN_OPTIONS,
  type CurtainFieldOptions
} from '../../lib/aurora/curtainField'

type Props = {
  width: number
  height: number
  time?: number
}

/** Render width in px — upscaled in `AuroraGlow` (uibrik CSS fallback). */
export const AURORA_TEX_COLUMNS = 52

/** Target height for texture; clamp so columns stay visible after upscale. */
export function auroraTextureHeight(panelW: number, panelH: number) {
  return Math.max(64, Math.min(120, Math.round(AURORA_TEX_COLUMNS * (panelH / panelW))))
}

/** Very light touch — heavy σ at panel size collapses peaks to one slab. */
const SOFTEN_BLUR = 1.8

function buildColumns(
  texW: number,
  texH: number,
  base: CurtainFieldOptions
) {
  const aspect = texW / texH
  const colW = texW / AURORA_TEX_COLUMNS
  const count = AURORA_TEX_COLUMNS

  return Array.from({ length: count }, (_, i) => {
    const stops = columnStops(i, count, aspect, base)
    const id = `auroraCol${i}`
    return { id, x: i * colW, w: colW + 0.25, stops }
  })
}

export function StaticAuroraBackdrop({ width, height, time }: Props) {
  const o = useMemo(
    (): CurtainFieldOptions => ({
      ...DEFAULT_CURTAIN_OPTIONS,
      time: time ?? DEFAULT_CURTAIN_OPTIONS.time
    }),
    [time]
  )

  const cols = useMemo(
    () => (width > 0 && height > 0 ? buildColumns(width, height, o) : []),
    [width, height, o]
  )

  if (width <= 0 || height <= 0) return null

  return (
    <Svg width={width} height={height}>
      <Defs>
        <Filter id="auroraSoft" x="-8%" y="-6%" width="116%" height="112%">
          <FeGaussianBlur in="SourceGraphic" stdDeviation={SOFTEN_BLUR} />
        </Filter>
        {cols.map(col => (
          <LinearGradient
            key={col.id}
            id={col.id}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            {col.stops.map((stop, i) => (
              <Stop
                key={i}
                offset={stop.offset}
                stopColor={stop.color}
                stopOpacity={1}
              />
            ))}
          </LinearGradient>
        ))}
      </Defs>

      <G filter="url(#auroraSoft)">
        {cols.map(col => (
          <Rect
            key={col.id}
            x={col.x}
            y={0}
            width={col.w}
            height={height}
            fill={`url(#${col.id})`}
          />
        ))}
      </G>
    </Svg>
  )
}