import Svg, {
  Defs,
  FeGaussianBlur,
  Filter,
  G,
  RadialGradient,
  Rect,
  Stop
} from 'react-native-svg'
import { colors } from '../../theme/colors'

type Props = {
  width: number
  height: number
}

type PeakSpec = {
  cx: string
  rx: string
  ry: string
  stops: readonly { offset: string; color: string; opacity: number }[]
}

/** Bottom-anchored peaks (reference Agentix layout). */
const PEAKS: PeakSpec[] = [
  {
    cx: '12%',
    rx: '38%',
    ry: '52%',
    stops: [
      { offset: '0%', color: colors.glowLime, opacity: 0.55 },
      { offset: '22%', color: colors.glowCyan, opacity: 0.42 },
      { offset: '55%', color: colors.glowTeal, opacity: 0.2 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '28%',
    rx: '34%',
    ry: '58%',
    stops: [
      { offset: '0%', color: '#C8F543', opacity: 0.72 },
      { offset: '18%', color: colors.glowCyan, opacity: 0.5 },
      { offset: '48%', color: '#0E8A7A', opacity: 0.26 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '50%',
    rx: '46%',
    ry: '78%',
    stops: [
      { offset: '0%', color: colors.glowLime, opacity: 0.88 },
      { offset: '14%', color: colors.glowCyan, opacity: 0.62 },
      { offset: '32%', color: colors.glowTeal, opacity: 0.44 },
      { offset: '58%', color: '#2F5BD4', opacity: 0.32 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '71%',
    rx: '36%',
    ry: '56%',
    stops: [
      { offset: '0%', color: '#B8E83A', opacity: 0.65 },
      { offset: '25%', color: '#2DE2C5', opacity: 0.4 },
      { offset: '52%', color: '#3D6DFF', opacity: 0.3 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '88%',
    rx: '32%',
    ry: '48%',
    stops: [
      { offset: '0%', color: colors.glowCyan, opacity: 0.58 },
      { offset: '30%', color: '#1A6F8F', opacity: 0.35 },
      { offset: '62%', color: '#3D6DFF', opacity: 0.28 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  }
]

const FLOOR: PeakSpec = {
  cx: '50%',
  rx: '95%',
  ry: '38%',
  stops: [
    { offset: '0%', color: colors.glowLime, opacity: 0.95 },
    { offset: '35%', color: colors.glowCyan, opacity: 0.35 },
    { offset: '100%', color: colors.glowDeep, opacity: 0 }
  ]
}

/** Brighter front pass — 6 curtains with strong height spread. */
const FRONT_PEAKS: PeakSpec[] = [
  {
    cx: '9%',
    rx: '30%',
    ry: '42%',
    stops: [
      { offset: '0%', color: '#D6FF4B', opacity: 0.78 },
      { offset: '28%', color: colors.glowCyan, opacity: 0.45 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '23%',
    rx: '32%',
    ry: '74%',
    stops: [
      { offset: '0%', color: '#C8F543', opacity: 0.82 },
      { offset: '20%', color: colors.glowCyan, opacity: 0.55 },
      { offset: '45%', color: colors.glowTeal, opacity: 0.32 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '37%',
    rx: '28%',
    ry: '48%',
    stops: [
      { offset: '0%', color: colors.glowLime, opacity: 0.7 },
      { offset: '35%', color: '#1E9E8F', opacity: 0.38 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '52%',
    rx: '42%',
    ry: '88%',
    stops: [
      { offset: '0%', color: colors.glowLime, opacity: 0.9 },
      { offset: '12%', color: colors.glowCyan, opacity: 0.68 },
      { offset: '30%', color: colors.glowTeal, opacity: 0.5 },
      { offset: '55%', color: '#3568E8', opacity: 0.38 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '66%',
    rx: '34%',
    ry: '66%',
    stops: [
      { offset: '0%', color: '#B8E83A', opacity: 0.76 },
      { offset: '22%', color: '#2DE2C5', opacity: 0.48 },
      { offset: '50%', color: '#3D6DFF', opacity: 0.34 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '84%',
    rx: '30%',
    ry: '46%',
    stops: [
      { offset: '0%', color: colors.glowCyan, opacity: 0.72 },
      { offset: '32%', color: '#1A6F8F', opacity: 0.4 },
      { offset: '58%', color: '#4D7CFF', opacity: 0.32 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  }
]

function baseBlobStops(strength: number): PeakSpec['stops'] {
  return [
    { offset: '0%', color: '#FFFFFF', opacity: 0.98 * strength },
    { offset: '18%', color: '#F0FFAA', opacity: 0.82 },
    { offset: '42%', color: colors.glowLime, opacity: 0.42 },
    { offset: '100%', color: colors.glowDeep, opacity: 0 }
  ]
}

/** Soft rounded caps where each front curtain meets the bottom edge. */
const FRONT_BASE_BLOBS: PeakSpec[] = [
  { cx: '9%', rx: '22%', ry: '24%', stops: baseBlobStops(0.9) },
  { cx: '23%', rx: '24%', ry: '26%', stops: baseBlobStops(0.95) },
  { cx: '37%', rx: '21%', ry: '23%', stops: baseBlobStops(0.92) },
  { cx: '52%', rx: '26%', ry: '28%', stops: baseBlobStops(1) },
  { cx: '66%', rx: '23%', ry: '25%', stops: baseBlobStops(0.94) },
  { cx: '84%', rx: '22%', ry: '24%', stops: baseBlobStops(0.9) }
]

const BACK_BLUR = 10
/** Front blur is 30% softer than back (smaller stdDeviation). */
const FRONT_BLUR = 7
/** Extra-heavy blur merges the bottom caps into one contiguous glow. */
const FRONT_BASE_BLUR = 15

export function StaticAuroraBackdrop({ width, height }: Props) {
  if (width <= 0 || height <= 0) return null

  const layers = [FLOOR, ...PEAKS]

  return (
    <Svg width={width} height={height}>
      <Defs>
        <Filter id="auroraBack" x="-35%" y="-35%" width="170%" height="170%">
          <FeGaussianBlur in="SourceGraphic" stdDeviation={BACK_BLUR} />
        </Filter>
        <Filter id="auroraFront" x="-30%" y="-30%" width="160%" height="160%">
          <FeGaussianBlur in="SourceGraphic" stdDeviation={FRONT_BLUR} />
        </Filter>
        <Filter id="auroraFrontBase" x="-40%" y="-20%" width="180%" height="160%">
          <FeGaussianBlur in="SourceGraphic" stdDeviation={FRONT_BASE_BLUR} />
        </Filter>
        <RadialGradient id="auroraCenterShade" cx="50%" cy="38%" rx="58%" ry="52%">
          <Stop offset="0%" stopColor={colors.black} stopOpacity="0.72" />
          <Stop offset="55%" stopColor={colors.black} stopOpacity="0.35" />
          <Stop offset="100%" stopColor={colors.black} stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="auroraTopWash" cx="50%" cy="8%" rx="92%" ry="48%">
          <Stop offset="0%" stopColor="#1A4A62" stopOpacity="0.18" />
          <Stop offset="100%" stopColor={colors.black} stopOpacity="0" />
        </RadialGradient>
        {layers.map((peak, index) => (
          <RadialGradient
            key={`peak-${index}`}
            id={`auroraPeak${index}`}
            cx={peak.cx}
            cy="100%"
            rx={peak.rx}
            ry={peak.ry}
          >
            {peak.stops.map((stop, i) => (
              <Stop
                key={i}
                offset={stop.offset}
                stopColor={stop.color}
                stopOpacity={stop.opacity}
              />
            ))}
          </RadialGradient>
        ))}
        {FRONT_PEAKS.map((peak, index) => (
          <RadialGradient
            key={`front-peak-${index}`}
            id={`auroraFrontPeak${index}`}
            cx={peak.cx}
            cy="100%"
            rx={peak.rx}
            ry={peak.ry}
          >
            {peak.stops.map((stop, i) => (
              <Stop
                key={i}
                offset={stop.offset}
                stopColor={stop.color}
                stopOpacity={stop.opacity}
              />
            ))}
          </RadialGradient>
        ))}
        {FRONT_BASE_BLOBS.map((peak, index) => (
          <RadialGradient
            key={`front-base-${index}`}
            id={`auroraFrontBase${index}`}
            cx={peak.cx}
            cy="100%"
            rx={peak.rx}
            ry={peak.ry}
          >
            {peak.stops.map((stop, i) => (
              <Stop
                key={i}
                offset={stop.offset}
                stopColor={stop.color}
                stopOpacity={stop.opacity}
              />
            ))}
          </RadialGradient>
        ))}
      </Defs>

      <G filter="url(#auroraBack)" opacity={0.96}>
        {layers.map((_, index) => (
          <Rect
            key={`back-${index}`}
            width={width}
            height={height}
            fill={`url(#auroraPeak${index})`}
          />
        ))}
      </G>

      <G filter="url(#auroraFront)" opacity={0.58}>
        {FRONT_PEAKS.map((_, index) => (
          <Rect
            key={`front-${index}`}
            width={width}
            height={height}
            fill={`url(#auroraFrontPeak${index})`}
          />
        ))}
      </G>

      <G filter="url(#auroraFrontBase)" opacity={0.88}>
        {FRONT_BASE_BLOBS.map((_, index) => (
          <Rect
            key={`front-base-${index}`}
            width={width}
            height={height}
            fill={`url(#auroraFrontBase${index})`}
          />
        ))}
      </G>

      <Rect width={width} height={height} fill="url(#auroraTopWash)" />
      <Rect width={width} height={height} fill="url(#auroraCenterShade)" />
    </Svg>
  )
}