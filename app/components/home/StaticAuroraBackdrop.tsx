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

/** Deep back field — cooler teal/blue pillars (lime only in the wash). */
const BACK_PEAKS: PeakSpec[] = [
  {
    cx: '14%',
    rx: '36%',
    ry: '50%',
    stops: [
      { offset: '0%', color: '#1A8F7A', opacity: 0.5 },
      { offset: '22%', color: colors.glowTeal, opacity: 0.38 },
      { offset: '55%', color: '#2F5BD4', opacity: 0.22 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '30%',
    rx: '32%',
    ry: '56%',
    stops: [
      { offset: '0%', color: '#178272', opacity: 0.55 },
      { offset: '25%', color: colors.glowCyan, opacity: 0.4 },
      { offset: '50%', color: '#2A4DB8', opacity: 0.28 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '50%',
    rx: '44%',
    ry: '76%',
    stops: [
      { offset: '0%', color: '#1E9A88', opacity: 0.52 },
      { offset: '18%', color: colors.glowTeal, opacity: 0.45 },
      { offset: '38%', color: '#2F5BD4', opacity: 0.38 },
      { offset: '62%', color: '#1E3A8A', opacity: 0.28 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '70%',
    rx: '34%',
    ry: '54%',
    stops: [
      { offset: '0%', color: '#1A7F9E', opacity: 0.48 },
      { offset: '28%', color: '#3D6DFF', opacity: 0.35 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '86%',
    rx: '30%',
    ry: '46%',
    stops: [
      { offset: '0%', color: '#15607A', opacity: 0.52 },
      { offset: '35%', color: '#3D6DFF', opacity: 0.32 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  }
]

/** Wide cool floor — separates black from the pillar field. */
const BACK_FLOOR: PeakSpec = {
  cx: '50%',
  rx: '96%',
  ry: '34%',
  stops: [
    { offset: '0%', color: '#2A9A82', opacity: 0.55 },
    { offset: '28%', color: colors.glowCyan, opacity: 0.32 },
    { offset: '55%', color: '#1A3D7A', opacity: 0.18 },
    { offset: '100%', color: colors.glowDeep, opacity: 0 }
  ]
}

/** Blown-out base — white / chartreuse (reference bottom edge). */
const BOTTOM_BLOOM: PeakSpec = {
  cx: '50%',
  rx: '100%',
  ry: '24%',
  stops: [
    { offset: '0%', color: '#FFFFFF', opacity: 1 },
    { offset: '14%', color: '#F0FFAA', opacity: 0.95 },
    { offset: '32%', color: colors.glowLime, opacity: 0.72 },
    { offset: '65%', color: colors.glowDeep, opacity: 0 }
  ]
}

/** Front curtains — offset from back cx, hot lime/white at the base. */
const FRONT_PEAKS: PeakSpec[] = [
  {
    cx: '8%',
    rx: '28%',
    ry: '44%',
    stops: [
      { offset: '0%', color: '#F8FFD8', opacity: 0.98 },
      { offset: '16%', color: '#D6FF4B', opacity: 0.85 },
      { offset: '38%', color: colors.glowCyan, opacity: 0.42 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '25%',
    rx: '30%',
    ry: '72%',
    stops: [
      { offset: '0%', color: '#FFFFFF', opacity: 0.92 },
      { offset: '14%', color: '#E2FF8C', opacity: 0.9 },
      { offset: '28%', color: colors.glowLime, opacity: 0.7 },
      { offset: '50%', color: colors.glowTeal, opacity: 0.35 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '40%',
    rx: '26%',
    ry: '50%',
    stops: [
      { offset: '0%', color: '#F0FFBE', opacity: 0.94 },
      { offset: '22%', color: colors.glowLime, opacity: 0.78 },
      { offset: '48%', color: '#1E9E8F', opacity: 0.36 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '54%',
    rx: '40%',
    ry: '90%',
    stops: [
      { offset: '0%', color: '#FFFFFF', opacity: 0.95 },
      { offset: '10%', color: '#EEFF9E', opacity: 0.92 },
      { offset: '22%', color: colors.glowLime, opacity: 0.82 },
      { offset: '40%', color: colors.glowCyan, opacity: 0.52 },
      { offset: '58%', color: '#3568E8', opacity: 0.4 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '68%',
    rx: '32%',
    ry: '64%',
    stops: [
      { offset: '0%', color: '#F2FFCC', opacity: 0.96 },
      { offset: '18%', color: '#B8E83A', opacity: 0.8 },
      { offset: '38%', color: '#2DE2C5', opacity: 0.48 },
      { offset: '58%', color: '#3D6DFF', opacity: 0.38 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '86%',
    rx: '28%',
    ry: '48%',
    stops: [
      { offset: '0%', color: '#F5FFD0', opacity: 0.93 },
      { offset: '20%', color: colors.glowCyan, opacity: 0.68 },
      { offset: '45%', color: '#4D7CFF', opacity: 0.34 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  }
]

const BACK_BLUR = 11
const FRONT_BLUR = 6
const BLOOM_BLUR = 3

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

  const backLayers = [BACK_FLOOR, ...BACK_PEAKS]

  return (
    <Svg width={width} height={height}>
      <Defs>
        <Filter id="auroraBack" x="-35%" y="-35%" width="170%" height="170%">
          <FeGaussianBlur in="SourceGraphic" stdDeviation={BACK_BLUR} />
        </Filter>
        <Filter id="auroraFront" x="-28%" y="-28%" width="155%" height="155%">
          <FeGaussianBlur in="SourceGraphic" stdDeviation={FRONT_BLUR} />
        </Filter>
        <Filter id="auroraBloom" x="-20%" y="-20%" width="140%" height="140%">
          <FeGaussianBlur in="SourceGraphic" stdDeviation={BLOOM_BLUR} />
        </Filter>
        <RadialGradient id="auroraTopWash" cx="50%" cy="0%" rx="100%" ry="55%">
          <Stop offset="0%" stopColor="#0A1628" stopOpacity="0.85" />
          <Stop offset="38%" stopColor={colors.black} stopOpacity="0.35" />
          <Stop offset="100%" stopColor={colors.black} stopOpacity="0" />
        </RadialGradient>
        <RadialGradient
          id="auroraBottomBloom"
          cx={BOTTOM_BLOOM.cx}
          cy="100%"
          rx={BOTTOM_BLOOM.rx}
          ry={BOTTOM_BLOOM.ry}
        >
          {BOTTOM_BLOOM.stops.map((stop, i) => (
            <Stop
              key={i}
              offset={stop.offset}
              stopColor={stop.color}
              stopOpacity={stop.opacity}
            />
          ))}
        </RadialGradient>
        {backLayers.map((peak, index) => (
          <RadialGradient
            key={`back-${index}`}
            id={`auroraBackPeak${index}`}
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
        {peakDefs(FRONT_PEAKS, 'auroraFrontPeak', 'front-def')}
      </Defs>

      <G filter="url(#auroraBack)" opacity={0.88}>
        {backLayers.map((_, index) => (
          <Rect
            key={`back-${index}`}
            width={width}
            height={height}
            fill={`url(#auroraBackPeak${index})`}
          />
        ))}
      </G>

      <G filter="url(#auroraFront)" opacity={0.72}>
        {FRONT_PEAKS.map((_, index) => (
          <Rect
            key={`front-${index}`}
            width={width}
            height={height}
            fill={`url(#auroraFrontPeak${index})`}
          />
        ))}
      </G>

      <G filter="url(#auroraBloom)" opacity={0.98}>
        <Rect width={width} height={height} fill="url(#auroraBottomBloom)" />
      </G>

      <Rect width={width} height={height} fill="url(#auroraTopWash)" />
    </Svg>
  )
}