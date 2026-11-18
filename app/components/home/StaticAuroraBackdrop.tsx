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
  /** Shader phase (uibrik clock); slow drift optional. */
  time?: number
}

const COLUMN_COUNT = 56
const MERGE_BLUR = 42
const GLOW_BLUR = 26

function buildColumns(
  width: number,
  height: number,
  base: CurtainFieldOptions,
  intensityScale: number
) {
  const aspect = width / height
  const colW = width / COLUMN_COUNT
  const opts = { ...base, intensity: base.intensity * intensityScale }

  return Array.from({ length: COLUMN_COUNT }, (_, i) => {
    const stops = columnStops(i, COLUMN_COUNT, aspect, opts)
    const id = `auroraCol${intensityScale > 1 ? 'Glow' : 'Main'}${i}`
    return {
      id,
      x: i * colW,
      w: colW + 1.5,
      stops
    }
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

  const mainCols = useMemo(
    () => (width > 0 && height > 0 ? buildColumns(width, height, o, 1) : []),
    [width, height, o]
  )

  const glowCols = useMemo(
    () => (width > 0 && height > 0 ? buildColumns(width, height, o, 1.35) : []),
    [width, height, o]
  )

  if (width <= 0 || height <= 0) return null

  return (
    <Svg width={width} height={height}>
      <Defs>
        <Filter id="auroraMerge" x="-20%" y="-15%" width="140%" height="135%">
          <FeGaussianBlur in="SourceGraphic" stdDeviation={MERGE_BLUR} />
        </Filter>
        <Filter id="auroraGlowPass" x="-25%" y="-20%" width="150%" height="140%">
          <FeGaussianBlur in="SourceGraphic" stdDeviation={GLOW_BLUR} />
        </Filter>
        {mainCols.map(col => (
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
        {glowCols.map(col => (
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

      <G filter="url(#auroraMerge)" opacity={1}>
        {mainCols.map(col => (
          <Rect
            key={`r-${col.id}`}
            x={col.x}
            y={0}
            width={col.w}
            height={height}
            fill={`url(#${col.id})`}
          />
        ))}
      </G>

      <G filter="url(#auroraGlowPass)" opacity={0.52}>
        {glowCols.map(col => (
          <Rect
            key={`g-${col.id}`}
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