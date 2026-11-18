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
  /** Default bottom anchor `100%`. */
  cy?: string
  rx: string
  ry: string
  stops: readonly { offset: string; color: string; opacity: number }[]
}

type FocalPeakSpec = PeakSpec & {
  fx: string
  fy: string
}

/** Soft indigo / royal washes — must stay translucent so it is not one flat blue. */
const BACK_ATMOSPHERE: PeakSpec[] = [
  {
    cx: '18%',
    cy: '72%',
    rx: '52%',
    ry: '58%',
    stops: [
      { offset: '0%', color: '#121A3D', opacity: 0.55 },
      { offset: '40%', color: '#1A2F6E', opacity: 0.28 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '48%',
    cy: '58%',
    rx: '62%',
    ry: '68%',
    stops: [
      { offset: '0%', color: '#1C3D8F', opacity: 0.42 },
      { offset: '35%', color: '#244FB8', opacity: 0.22 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '76%',
    cy: '68%',
    rx: '48%',
    ry: '54%',
    stops: [
      { offset: '0%', color: '#0F2848', opacity: 0.5 },
      { offset: '38%', color: '#1A4A7A', opacity: 0.26 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '92%',
    cy: '78%',
    rx: '44%',
    ry: '42%',
    stops: [
      { offset: '0%', color: '#152A52', opacity: 0.38 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  }
]

/** Deeper bottom glow — teal undertone, low peak opacity so layers do not stack flat. */
const BACK_PEAKS: PeakSpec[] = [
  {
    cx: '10%',
    rx: '34%',
    ry: '58%',
    stops: [
      { offset: '0%', color: '#1A6F8F', opacity: 0.32 },
      { offset: '45%', color: '#1E3A7A', opacity: 0.18 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '30%',
    rx: '32%',
    ry: '62%',
    stops: [
      { offset: '0%', color: '#2288AA', opacity: 0.28 },
      { offset: '42%', color: '#243B7A', opacity: 0.16 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '50%',
    rx: '36%',
    ry: '68%',
    stops: [
      { offset: '0%', color: '#2A5ECC', opacity: 0.3 },
      { offset: '38%', color: '#1A3D8F', opacity: 0.14 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '70%',
    rx: '30%',
    ry: '56%',
    stops: [
      { offset: '0%', color: '#1A6F8F', opacity: 0.26 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '90%',
    rx: '34%',
    ry: '52%',
    stops: [
      { offset: '0%', color: '#1E4A8A', opacity: 0.28 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  }
]

/** Dark gutters between curtains — pushes peak contrast without a flat back fill. */
const VALLEY_SHADES: PeakSpec[] = [
  {
    cx: '17%',
    rx: '11%',
    ry: '78%',
    stops: [
      { offset: '0%', color: colors.black, opacity: 0.62 },
      { offset: '35%', color: colors.black, opacity: 0.28 },
      { offset: '100%', color: colors.black, opacity: 0 }
    ]
  },
  {
    cx: '32%',
    rx: '10%',
    ry: '82%',
    stops: [
      { offset: '0%', color: colors.black, opacity: 0.58 },
      { offset: '100%', color: colors.black, opacity: 0 }
    ]
  },
  {
    cx: '43%',
    rx: '9%',
    ry: '80%',
    stops: [
      { offset: '0%', color: colors.black, opacity: 0.55 },
      { offset: '100%', color: colors.black, opacity: 0 }
    ]
  },
  {
    cx: '58%',
    rx: '11%',
    ry: '84%',
    stops: [
      { offset: '0%', color: colors.black, opacity: 0.6 },
      { offset: '100%', color: colors.black, opacity: 0 }
    ]
  },
  {
    cx: '74%',
    rx: '10%',
    ry: '76%',
    stops: [
      { offset: '0%', color: colors.black, opacity: 0.52 },
      { offset: '100%', color: colors.black, opacity: 0 }
    ]
  },
  {
    cx: '86%',
    rx: '11%',
    ry: '74%',
    stops: [
      { offset: '0%', color: colors.black, opacity: 0.5 },
      { offset: '100%', color: colors.black, opacity: 0 }
    ]
  }
]

/** Narrow tapered teal / cyan columns (middle layer). */
const CURTAIN_PEAKS: PeakSpec[] = [
  {
    cx: '9%',
    rx: '16%',
    ry: '96%',
    stops: [
      { offset: '0%', color: '#3FE8D8', opacity: 0.95 },
      { offset: '10%', color: '#2DE2C5', opacity: 0.88 },
      { offset: '22%', color: '#1BA8D4', opacity: 0.62 },
      { offset: '38%', color: '#1A6FA8', opacity: 0.32 },
      { offset: '58%', color: '#143D6E', opacity: 0.12 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '24%',
    rx: '18%',
    ry: '102%',
    stops: [
      { offset: '0%', color: '#4AF0E0', opacity: 1 },
      { offset: '8%', color: '#2DE2C5', opacity: 0.92 },
      { offset: '20%', color: '#22C5E8', opacity: 0.72 },
      { offset: '36%', color: '#1A7FBA', opacity: 0.38 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '39%',
    rx: '15%',
    ry: '88%',
    stops: [
      { offset: '0%', color: '#2DE2C5', opacity: 0.9 },
      { offset: '18%', color: '#1EC4E0', opacity: 0.65 },
      { offset: '42%', color: '#1A5A94', opacity: 0.28 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '52%',
    rx: '20%',
    ry: '108%',
    stops: [
      { offset: '0%', color: '#56F2E6', opacity: 1 },
      { offset: '6%', color: '#2DE2C5', opacity: 0.94 },
      { offset: '16%', color: '#28B8EA', opacity: 0.78 },
      { offset: '32%', color: '#2088CC', opacity: 0.48 },
      { offset: '52%', color: '#1A5090', opacity: 0.22 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '66%',
    rx: '17%',
    ry: '94%',
    stops: [
      { offset: '0%', color: '#3AE8DC', opacity: 0.96 },
      { offset: '14%', color: '#22CFE8', opacity: 0.7 },
      { offset: '40%', color: '#1A6CB0', opacity: 0.3 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '88%',
    rx: '18%',
    ry: '90%',
    stops: [
      { offset: '0%', color: '#2DE2C5', opacity: 0.88 },
      { offset: '20%', color: '#1A9FD4', opacity: 0.55 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '96%',
    rx: '16%',
    ry: '82%',
    stops: [
      { offset: '0%', color: '#28D8C8', opacity: 0.82 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  }
]

/** One wide shallow band — blurs into a single lime foot across the full width. */
const FOOT_TRAY: FocalPeakSpec = {
  cx: '50%',
  cy: '102%',
  fx: '50%',
  fy: '104.5%',
  rx: '118%',
  ry: '17%',
  stops: [
    { offset: '0%', color: '#FFFFFF', opacity: 1 },
    { offset: '5%', color: '#FFFFEE', opacity: 0.98 },
    { offset: '12%', color: '#F4FFAA', opacity: 0.94 },
    { offset: '24%', color: '#D6FF4B', opacity: 0.88 },
    { offset: '42%', color: '#B8E83A', opacity: 0.62 },
    { offset: '68%', color: '#4AD4B0', opacity: 0.28 },
    { offset: '100%', color: colors.glowDeep, opacity: 0 }
  ]
}

const BACK_BLUR = 12
const VALLEY_BLUR = 4
const CURTAIN_BLUR = 5
const FOOT_BLUR = 22

function peakGradientId(prefix: string, index: number) {
  return `${prefix}${index}`
}

function renderGradientDefs(peaks: PeakSpec[], prefix: string) {
  return peaks.map((peak, index) => (
    <RadialGradient
      key={`${prefix}-${index}`}
      id={peakGradientId(prefix, index)}
      cx={peak.cx}
      cy={peak.cy ?? '100%'}
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

function renderPeakGroup(
  peaks: PeakSpec[],
  prefix: string,
  w: number,
  h: number
) {
  return peaks.map((_, index) => (
    <Rect
      key={`${prefix}-rect-${index}`}
      width={w}
      height={h}
      fill={`url(#${peakGradientId(prefix, index)})`}
    />
  ))
}

export function StaticAuroraBackdrop({ width, height }: Props) {
  if (width <= 0 || height <= 0) return null

  return (
    <Svg width={width} height={height}>
      <Defs>
        <Filter id="auroraBack" x="-50%" y="-35%" width="200%" height="170%">
          <FeGaussianBlur in="SourceGraphic" stdDeviation={BACK_BLUR} />
        </Filter>
        <Filter id="auroraValley" x="-40%" y="-25%" width="180%" height="150%">
          <FeGaussianBlur in="SourceGraphic" stdDeviation={VALLEY_BLUR} />
        </Filter>
        <Filter id="auroraCurtain" x="-50%" y="-35%" width="200%" height="175%">
          <FeGaussianBlur in="SourceGraphic" stdDeviation={CURTAIN_BLUR} />
        </Filter>
        <Filter id="auroraFoot" x="-55%" y="-30%" width="210%" height="160%">
          <FeGaussianBlur in="SourceGraphic" stdDeviation={FOOT_BLUR} />
        </Filter>
        <RadialGradient id="auroraTopWash" cx="50%" cy="8%" rx="92%" ry="48%">
          <Stop offset="0%" stopColor="#1A4A62" stopOpacity="0.14" />
          <Stop offset="100%" stopColor={colors.black} stopOpacity="0" />
        </RadialGradient>
        {renderGradientDefs(BACK_ATMOSPHERE, 'auroraAtmo')}
        {renderGradientDefs(BACK_PEAKS, 'auroraBackPeak')}
        {renderGradientDefs(VALLEY_SHADES, 'auroraValley')}
        {renderGradientDefs(CURTAIN_PEAKS, 'auroraCurtain')}
        <RadialGradient
          id="auroraFoot"
          cx={FOOT_TRAY.cx}
          cy={FOOT_TRAY.cy}
          fx={FOOT_TRAY.fx}
          fy={FOOT_TRAY.fy}
          rx={FOOT_TRAY.rx}
          ry={FOOT_TRAY.ry}
        >
          {FOOT_TRAY.stops.map((stop, i) => (
            <Stop
              key={i}
              offset={stop.offset}
              stopColor={stop.color}
              stopOpacity={stop.opacity}
            />
          ))}
        </RadialGradient>
      </Defs>

      <G filter="url(#auroraBack)" opacity={0.88}>
        {renderPeakGroup(BACK_ATMOSPHERE, 'auroraAtmo', width, height)}
        {renderPeakGroup(BACK_PEAKS, 'auroraBackPeak', width, height)}
      </G>

      <G filter="url(#auroraValley)" opacity={0.85}>
        {renderPeakGroup(VALLEY_SHADES, 'auroraValley', width, height)}
      </G>

      <G filter="url(#auroraCurtain)" opacity={0.92}>
        {renderPeakGroup(CURTAIN_PEAKS, 'auroraCurtain', width, height)}
      </G>

      <G filter="url(#auroraFoot)" opacity={0.97}>
        <Rect width={width} height={height} fill="url(#auroraFoot)" />
      </G>

      <Rect width={width} height={height} fill="url(#auroraTopWash)" />
    </Svg>
  )
}