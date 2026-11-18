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

/** Outer foot — lime/chartreuse body (heavy blur reads as one band). */
function footOuterStops(strength: number): Peak['stops'] {
  const s = Math.min(1, strength)
  return [
    { offset: '0%', color: '#FAFFDD', opacity: 0.92 * s },
    { offset: '10%', color: '#E8FF72', opacity: 0.88 * s },
    { offset: '22%', color: '#D6FF4B', opacity: 0.78 * s },
    { offset: '40%', color: '#9AE8A8', opacity: 0.52 * s },
    { offset: '62%', color: '#4AD8C0', opacity: 0.32 * s },
    { offset: '100%', color: colors.glowDeep, opacity: 0 }
  ]
}

/** Inner foot — white-yellow blow-out (reference core; light blur, drawn on top). */
function footCoreStops(strength: number): Peak['stops'] {
  const s = Math.min(1, strength)
  return [
    { offset: '0%', color: '#FFFFFF', opacity: 1 },
    { offset: '4%', color: '#FFFFFF', opacity: 1 },
    { offset: '10%', color: '#FFFFF2', opacity: 0.99 * s },
    { offset: '20%', color: '#FBFFAA', opacity: 0.94 * s },
    { offset: '35%', color: '#F0FF88', opacity: 0.72 * s },
    { offset: '55%', color: '#E4FF66', opacity: 0.42 * s },
    { offset: '100%', color: colors.glowDeep, opacity: 0 }
  ]
}

const FOOT_BASE: Peak = {
  cx: '50%',
  cy: '102.8%',
  fx: '50%',
  fy: '104.8%',
  rx: '126%',
  ry: '19%',
  stops: footOuterStops(1)
}

/** Crests — shared floor, varied cy + ry for wavy top (still merges at outer blur). */
const FOOT_WAVES: Peak[] = [
  {
    cx: '10%',
    cy: '101.2%',
    fx: '10%',
    fy: '102.45%',
    rx: '26%',
    ry: '12%',
    stops: footOuterStops(0.9)
  },
  {
    cx: '27%',
    cy: '101.55%',
    fx: '27%',
    fy: '102.85%',
    rx: '28%',
    ry: '21%',
    stops: footOuterStops(0.98)
  },
  {
    cx: '44%',
    cy: '101.1%',
    fx: '44%',
    fy: '102.35%',
    rx: '24%',
    ry: '10%',
    stops: footOuterStops(0.86)
  },
  {
    cx: '52%',
    cy: '101.65%',
    fx: '52%',
    fy: '102.95%',
    rx: '30%',
    ry: '24%',
    stops: footOuterStops(1)
  },
  {
    cx: '68%',
    cy: '101.38%',
    fx: '68%',
    fy: '102.65%',
    rx: '26%',
    ry: '17%',
    stops: footOuterStops(0.94)
  },
  {
    cx: '90%',
    cy: '101.15%',
    fx: '90%',
    fy: '102.4%',
    rx: '25%',
    ry: '11%',
    stops: footOuterStops(0.88)
  }
]

const FOOT_CORE_BAND: Peak = {
  cx: '50%',
  cy: '101.2%',
  fx: '50%',
  fy: '102.4%',
  rx: '104%',
  ry: '11%',
  stops: footCoreStops(0.95)
}

const FOOT_CORE_HOTSPOTS: Peak[] = [
  {
    cx: '27%',
    cy: '101.48%',
    fx: '27%',
    fy: '102.65%',
    rx: '20%',
    ry: '15%',
    stops: footCoreStops(0.94)
  },
  {
    cx: '52%',
    cy: '101.55%',
    fx: '52%',
    fy: '102.75%',
    rx: '26%',
    ry: '17%',
    stops: footCoreStops(1)
  },
  {
    cx: '72%',
    cy: '101.28%',
    fx: '72%',
    fy: '102.45%',
    rx: '19%',
    ry: '12%',
    stops: footCoreStops(0.86)
  }
]

const BACK_BLUR = 11
const CURTAIN_BLUR = 7
const FOOT_OUTER_BLUR = 34
const FOOT_CORE_BLUR = 8

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
        <Filter id="auroraFootOuter" x="-55%" y="-38%" width="210%" height="180%">
          <FeGaussianBlur in="SourceGraphic" stdDeviation={FOOT_OUTER_BLUR} />
        </Filter>
        <Filter id="auroraFootCore" x="-40%" y="-28%" width="180%" height="150%">
          <FeGaussianBlur in="SourceGraphic" stdDeviation={FOOT_CORE_BLUR} />
        </Filter>
        {BACK_WASHES.map((p, i) => (
          <PeakGradient key={`b${i}`} id={`auroraBack${i}`} peak={p} />
        ))}
        {CURTAINS.map((p, i) => (
          <PeakGradient key={`c${i}`} id={`auroraCurtain${i}`} peak={p} />
        ))}
        <PeakGradient id="auroraFootBase" peak={FOOT_BASE} />
        {FOOT_WAVES.map((p, i) => (
          <PeakGradient key={`fw${i}`} id={`auroraFootWave${i}`} peak={p} />
        ))}
        <PeakGradient id="auroraFootCoreBand" peak={FOOT_CORE_BAND} />
        {FOOT_CORE_HOTSPOTS.map((p, i) => (
          <PeakGradient key={`fc${i}`} id={`auroraFootCore${i}`} peak={p} />
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

      <G filter="url(#auroraFootOuter)" opacity={0.97}>
        <Rect width={width} height={height} fill="url(#auroraFootBase)" />
        {FOOT_WAVES.map((_, i) => (
          <Rect
            key={`foot-w-${i}`}
            width={width}
            height={height}
            fill={`url(#auroraFootWave${i})`}
          />
        ))}
      </G>

      <G filter="url(#auroraFootCore)" opacity={0.94}>
        <Rect width={width} height={height} fill="url(#auroraFootCoreBand)" />
        {FOOT_CORE_HOTSPOTS.map((_, i) => (
          <Rect
            key={`foot-c-${i}`}
            width={width}
            height={height}
            fill={`url(#auroraFootCore${i})`}
          />
        ))}
      </G>

      <Rect width={width} height={height} fill="url(#auroraTopFade)" />
    </Svg>
  )
}