import Svg, {
  Defs,
  FeGaussianBlur,
  Filter,
  G,
  LinearGradient,
  RadialGradient,
  Rect,
  Stop
} from 'react-native-svg'
import { colors } from '../../theme/colors'

type Props = {
  width: number
  height: number
}

type Peak = {
  cx: string
  cy?: string
  rx: string
  ry: string
  fx?: string
  fy?: string
  stops: { offset: string; color: string; opacity: number }[]
}

/** Indigo undertone — bottom only, behind curtains (not a full-height blue wash). */
const BACK_WASHES: Peak[] = [
  {
    cx: '22%',
    cy: '97%',
    rx: '48%',
    ry: '34%',
    stops: [
      { offset: '0%', color: '#1A2A5C', opacity: 0.42 },
      { offset: '40%', color: '#1E3D8A', opacity: 0.16 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '52%',
    cy: '96%',
    rx: '58%',
    ry: '36%',
    stops: [
      { offset: '0%', color: '#243B8F', opacity: 0.36 },
      { offset: '38%', color: '#2A4FB5', opacity: 0.14 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '80%',
    cy: '97%',
    rx: '46%',
    ry: '32%',
    stops: [
      { offset: '0%', color: '#142848', opacity: 0.38 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  }
]

/** Bottom-anchored teal columns — median ~52%, spread ±20% (≈41–62%). */
const CURTAINS: Peak[] = [
  {
    cx: '10%',
    rx: '15%',
    ry: '41%',
    stops: [
      { offset: '0%', color: '#3BE8D8', opacity: 0.88 },
      { offset: '18%', color: '#2DE2C5', opacity: 0.68 },
      { offset: '42%', color: '#1A8FC4', opacity: 0.22 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '27%',
    rx: '17%',
    ry: '60%',
    stops: [
      { offset: '0%', color: '#4AF0E4', opacity: 0.92 },
      { offset: '12%', color: '#2DE2C5', opacity: 0.78 },
      { offset: '38%', color: '#2288CC', opacity: 0.3 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '44%',
    rx: '14%',
    ry: '44%',
    stops: [
      { offset: '0%', color: '#2DE2C5', opacity: 0.82 },
      { offset: '35%', color: '#1A6FA8', opacity: 0.24 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '52%',
    rx: '22%',
    ry: '62%',
    stops: [
      { offset: '0%', color: '#56F4EA', opacity: 1 },
      { offset: '10%', color: '#2DE2C5', opacity: 0.86 },
      { offset: '28%', color: '#28B0E8', opacity: 0.52 },
      { offset: '48%', color: '#1A5090', opacity: 0.18 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '68%',
    rx: '16%',
    ry: '57%',
    stops: [
      { offset: '0%', color: '#36E8DC', opacity: 0.9 },
      { offset: '22%', color: '#22C8E8', opacity: 0.48 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '90%',
    rx: '17%',
    ry: '42%',
    stops: [
      { offset: '0%', color: '#2DE2C5', opacity: 0.84 },
      { offset: '28%', color: '#1A88BE', opacity: 0.32 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  }
]

function footStops(hot: number): Peak['stops'] {
  const h = Math.min(1, hot)
  return [
    { offset: '0%', color: '#FFFFFF', opacity: 1 },
    { offset: '3%', color: '#FFFFFF', opacity: 0.99 * h },
    { offset: '8%', color: '#FFFFEE', opacity: 0.97 * h },
    { offset: '16%', color: '#F6FF99', opacity: 0.92 * h },
    { offset: '28%', color: '#E8FF5A', opacity: 0.82 * h },
    { offset: '45%', color: '#D6FF4B', opacity: 0.62 * h },
    { offset: '68%', color: '#6AE8B8', opacity: 0.28 },
    { offset: '100%', color: colors.glowDeep, opacity: 0 }
  ]
}

/** Full-width tray — merges caps into one contiguous lime band when blurred. */
const FOOT_BASE: Peak = {
  cx: '50%',
  cy: '103%',
  fx: '50%',
  fy: '105.5%',
  rx: '124%',
  ry: '22%',
  stops: footStops(1)
}

/** Wavy foot — different vertical reach per column (height variation along width). */
const FOOT_CAPS: Peak[] = [
  {
    cx: '10%',
    cy: '101.2%',
    fx: '10%',
    fy: '103.2%',
    rx: '24%',
    ry: '13%',
    stops: footStops(0.9)
  },
  {
    cx: '27%',
    cy: '101.9%',
    fx: '27%',
    fy: '103.8%',
    rx: '26%',
    ry: '20%',
    stops: footStops(0.96)
  },
  {
    cx: '44%',
    cy: '101%',
    fx: '44%',
    fy: '102.8%',
    rx: '22%',
    ry: '11%',
    stops: footStops(0.88)
  },
  {
    cx: '52%',
    cy: '101.7%',
    fx: '52%',
    fy: '104%',
    rx: '28%',
    ry: '24%',
    stops: footStops(1)
  },
  {
    cx: '68%',
    cy: '101.4%',
    fx: '68%',
    fy: '103.5%',
    rx: '25%',
    ry: '17%',
    stops: footStops(0.94)
  },
  {
    cx: '90%',
    cy: '101.1%',
    fx: '90%',
    fy: '103%',
    rx: '23%',
    ry: '12%',
    stops: footStops(0.89)
  }
]

const BACK_BLUR = 11
const CURTAIN_BLUR = 7
const FOOT_BLUR = 28

function PeakGradient({ id, peak }: { id: string; peak: Peak }) {
  return (
    <RadialGradient
      id={id}
      cx={peak.cx}
      cy={peak.cy ?? '100%'}
      fx={peak.fx ?? peak.cx}
      fy={peak.fy ?? peak.cy ?? '100%'}
      rx={peak.rx}
      ry={peak.ry}
    >
      {peak.stops.map((s, i) => (
        <Stop
          key={i}
          offset={s.offset}
          stopColor={s.color}
          stopOpacity={s.opacity}
        />
      ))}
    </RadialGradient>
  )
}

export function StaticAuroraBackdrop({ width, height }: Props) {
  if (width <= 0 || height <= 0) return null

  return (
    <Svg width={width} height={height}>
      <Defs>
        <Filter id="auroraBack" x="-45%" y="-30%" width="190%" height="160%">
          <FeGaussianBlur in="SourceGraphic" stdDeviation={BACK_BLUR} />
        </Filter>
        <Filter id="auroraCurtain" x="-45%" y="-32%" width="190%" height="165%">
          <FeGaussianBlur in="SourceGraphic" stdDeviation={CURTAIN_BLUR} />
        </Filter>
        <Filter id="auroraFoot" x="-55%" y="-35%" width="210%" height="175%">
          <FeGaussianBlur in="SourceGraphic" stdDeviation={FOOT_BLUR} />
        </Filter>
        {BACK_WASHES.map((p, i) => (
          <PeakGradient key={`b${i}`} id={`auroraBack${i}`} peak={p} />
        ))}
        {CURTAINS.map((p, i) => (
          <PeakGradient key={`c${i}`} id={`auroraCurtain${i}`} peak={p} />
        ))}
        <PeakGradient id="auroraFootBase" peak={FOOT_BASE} />
        {FOOT_CAPS.map((p, i) => (
          <PeakGradient key={`f${i}`} id={`auroraFootCap${i}`} peak={p} />
        ))}
        <LinearGradient id="auroraTopFade" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={colors.black} stopOpacity="0.95" />
          <Stop offset="36%" stopColor={colors.black} stopOpacity="0.72" />
          <Stop offset="52%" stopColor={colors.black} stopOpacity="0" />
        </LinearGradient>
      </Defs>

      <G filter="url(#auroraBack)" opacity={0.68}>
        {BACK_WASHES.map((_, i) => (
          <Rect
            key={`br${i}`}
            width={width}
            height={height}
            fill={`url(#auroraBack${i})`}
          />
        ))}
      </G>

      <G filter="url(#auroraCurtain)" opacity={0.88}>
        {CURTAINS.map((_, i) => (
          <Rect
            key={`cr${i}`}
            width={width}
            height={height}
            fill={`url(#auroraCurtain${i})`}
          />
        ))}
      </G>

      <G filter="url(#auroraFoot)" opacity={0.98}>
        <Rect width={width} height={height} fill="url(#auroraFootBase)" />
        {FOOT_CAPS.map((_, i) => (
          <Rect
            key={`foot-${i}`}
            width={width}
            height={height}
            fill={`url(#auroraFootCap${i})`}
          />
        ))}
      </G>

      <Rect width={width} height={height} fill="url(#auroraTopFade)" />
    </Svg>
  )
}