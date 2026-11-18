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

function frontFoot(strength = 1): PeakSpec['stops'] {
  return [
    { offset: '0%', color: '#FFFFFF', opacity: 0.98 * strength },
    { offset: '7%', color: '#F0FFAA', opacity: 0.9 },
    { offset: '16%', color: colors.glowLime, opacity: 0.78 },
    { offset: '32%', color: colors.glowCyan, opacity: 0.48 },
    { offset: '55%', color: colors.glowTeal, opacity: 0.28 },
    { offset: '100%', color: colors.glowDeep, opacity: 0 }
  ]
}

const backFoot: PeakSpec['stops'] = [
  { offset: '0%', color: '#2A9A82', opacity: 0.62 },
  { offset: '12%', color: colors.glowCyan, opacity: 0.45 },
  { offset: '30%', color: colors.glowTeal, opacity: 0.32 },
  { offset: '58%', color: '#2F5BD4', opacity: 0.22 },
  { offset: '100%', color: colors.glowDeep, opacity: 0 }
]

/** Six evenly spaced pillars — tight rx keeps light in vertical curtains. */
const BACK_PEAKS: PeakSpec[] = [
  { cx: '8%', rx: '24%', ry: '44%', stops: backFoot },
  { cx: '22%', rx: '22%', ry: '56%', stops: backFoot },
  { cx: '36%', rx: '23%', ry: '50%', stops: backFoot },
  {
    cx: '50%',
    rx: '26%',
    ry: '70%',
    stops: [
      { offset: '0%', color: '#1E9A88', opacity: 0.66 },
      { offset: '14%', color: colors.glowTeal, opacity: 0.48 },
      { offset: '32%', color: '#2F5BD4', opacity: 0.4 },
      { offset: '58%', color: '#1E3A8A', opacity: 0.26 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  { cx: '64%', rx: '22%', ry: '54%', stops: backFoot },
  { cx: '78%', rx: '24%', ry: '46%', stops: backFoot }
]

const FRONT_PEAKS: PeakSpec[] = [
  { cx: '8%', rx: '22%', ry: '46%', stops: frontFoot(0.92) },
  { cx: '22%', rx: '21%', ry: '62%', stops: frontFoot(0.96) },
  { cx: '36%', rx: '22%', ry: '52%', stops: frontFoot(0.94) },
  {
    cx: '50%',
    rx: '24%',
    ry: '74%',
    stops: [
      { offset: '0%', color: '#FFFFFF', opacity: 0.98 },
      { offset: '7%', color: '#F0FFAA', opacity: 0.92 },
      { offset: '16%', color: colors.glowLime, opacity: 0.82 },
      { offset: '30%', color: colors.glowCyan, opacity: 0.55 },
      { offset: '48%', color: '#3568E8', opacity: 0.38 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  { cx: '64%', rx: '21%', ry: '58%', stops: frontFoot(0.95) },
  { cx: '78%', rx: '22%', ry: '48%', stops: frontFoot(0.93) }
]

const BACK_BLUR = 10
const FRONT_BLUR = 6

function peakDefs(
  peaks: PeakSpec[],
  idPrefix: string,
  keyPrefix: string
) {
  return peaks.map((peak, index) => (
    <RadialGradient
      key={`${keyPrefix}-${index}`}
      id={`${idPrefix}${index}`}
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
  ))
}

export function StaticAuroraBackdrop({ width, height }: Props) {
  if (width <= 0 || height <= 0) return null

  return (
    <Svg width={width} height={height}>
      <Defs>
        <Filter id="auroraBack" x="-35%" y="-35%" width="170%" height="170%">
          <FeGaussianBlur in="SourceGraphic" stdDeviation={BACK_BLUR} />
        </Filter>
        <Filter id="auroraFront" x="-28%" y="-28%" width="155%" height="155%">
          <FeGaussianBlur in="SourceGraphic" stdDeviation={FRONT_BLUR} />
        </Filter>
        <RadialGradient id="auroraTopWash" cx="50%" cy="0%" rx="100%" ry="50%">
          <Stop offset="0%" stopColor="#0A1628" stopOpacity="0.82" />
          <Stop offset="36%" stopColor={colors.black} stopOpacity="0.3" />
          <Stop offset="100%" stopColor={colors.black} stopOpacity="0" />
        </RadialGradient>
        {peakDefs(BACK_PEAKS, 'auroraBackPeak', 'back-def')}
        {peakDefs(FRONT_PEAKS, 'auroraFrontPeak', 'front-def')}
      </Defs>

      <G filter="url(#auroraBack)" opacity={0.86}>
        {BACK_PEAKS.map((_, index) => (
          <Rect
            key={`back-${index}`}
            width={width}
            height={height}
            fill={`url(#auroraBackPeak${index})`}
          />
        ))}
      </G>

      <G filter="url(#auroraFront)" opacity={0.7}>
        {FRONT_PEAKS.map((_, index) => (
          <Rect
            key={`front-${index}`}
            width={width}
            height={height}
            fill={`url(#auroraFrontPeak${index})`}
          />
        ))}
      </G>

      <Rect width={width} height={height} fill="url(#auroraTopWash)" />
    </Svg>
  )
}