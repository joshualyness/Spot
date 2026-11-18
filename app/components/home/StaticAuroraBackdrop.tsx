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

type Peak = {
  cx: string
  cy?: string
  rx: string
  ry: string
  fx?: string
  fy?: string
  stops: { offset: string; color: string; opacity: number }[]
}

/** Deep indigo pools — low opacity, wide, high on the panel. */
const BACK_WASHES: Peak[] = [
  {
    cx: '22%',
    cy: '48%',
    rx: '58%',
    ry: '52%',
    stops: [
      { offset: '0%', color: '#1A2A5C', opacity: 0.5 },
      { offset: '45%', color: '#1E3D8A', opacity: 0.22 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '55%',
    cy: '42%',
    rx: '68%',
    ry: '58%',
    stops: [
      { offset: '0%', color: '#243B8F', opacity: 0.38 },
      { offset: '40%', color: '#2A4FB5', opacity: 0.18 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '82%',
    cy: '52%',
    rx: '52%',
    ry: '48%',
    stops: [
      { offset: '0%', color: '#142848', opacity: 0.45 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  }
]

/** Bottom-anchored teal columns — reach ~40% up the panel (60% from top). */
const CURTAINS: Peak[] = [
  {
    cx: '10%',
    rx: '15%',
    ry: '32%',
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
    ry: '36%',
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
    ry: '30%',
    stops: [
      { offset: '0%', color: '#2DE2C5', opacity: 0.82 },
      { offset: '35%', color: '#1A6FA8', opacity: 0.24 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '52%',
    rx: '22%',
    ry: '40%',
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
    ry: '34%',
    stops: [
      { offset: '0%', color: '#36E8DC', opacity: 0.9 },
      { offset: '22%', color: '#22C8E8', opacity: 0.48 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  },
  {
    cx: '90%',
    rx: '17%',
    ry: '31%',
    stops: [
      { offset: '0%', color: '#2DE2C5', opacity: 0.84 },
      { offset: '28%', color: '#1A88BE', opacity: 0.32 },
      { offset: '100%', color: colors.glowDeep, opacity: 0 }
    ]
  }
]

const FOOT: Peak = {
  cx: '50%',
  cy: '102%',
  fx: '50%',
  fy: '104%',
  rx: '116%',
  ry: '15%',
  stops: [
    { offset: '0%', color: '#FFFFFF', opacity: 1 },
    { offset: '7%', color: '#FAFFCC', opacity: 0.96 },
    { offset: '18%', color: '#E8FF5A', opacity: 0.9 },
    { offset: '35%', color: '#D6FF4B', opacity: 0.78 },
    { offset: '55%', color: '#8AE8C8', opacity: 0.4 },
    { offset: '100%', color: colors.glowDeep, opacity: 0 }
  ]
}

const BACK_BLUR = 11
const CURTAIN_BLUR = 7
const FOOT_BLUR = 18

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
        <Filter id="auroraFoot" x="-50%" y="-25%" width="200%" height="150%">
          <FeGaussianBlur in="SourceGraphic" stdDeviation={FOOT_BLUR} />
        </Filter>
        {BACK_WASHES.map((p, i) => (
          <PeakGradient key={`b${i}`} id={`auroraBack${i}`} peak={p} />
        ))}
        {CURTAINS.map((p, i) => (
          <PeakGradient key={`c${i}`} id={`auroraCurtain${i}`} peak={p} />
        ))}
        <PeakGradient id="auroraFoot" peak={FOOT} />
      </Defs>

      <G filter="url(#auroraBack)" opacity={0.82}>
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

      <G filter="url(#auroraFoot)" opacity={0.96}>
        <Rect width={width} height={height} fill="url(#auroraFoot)" />
      </G>
    </Svg>
  )
}