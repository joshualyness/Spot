import { memo, useEffect, useMemo } from 'react'
import { View } from 'react-native'
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue
} from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'
import { pointOnCircle, seededUnit } from '../../lib/polar'

const DOT_COUNT = 52
const DOT_SIZE = 5
const SCATTER_EXTRA = 76
const LAND_WINDOW = 2.8

export type DotSpec = {
  id: number
  from: { x: number; y: number }
  to: { x: number; y: number }
}

type Props = {
  size: number
  radius: number
  onSettled?: () => void
}

const ScoreDot = memo(function ScoreDot({
  spec,
  clock
}: {
  spec: DotSpec
  clock: SharedValue<number>
}) {
  const style = useAnimatedStyle(() => {
    const landing = Math.min(1, Math.max(0, (clock.value - spec.id) / LAND_WINDOW))
    const eased = 1 - Math.pow(1 - landing, 3)
    const smash = landing < 1 ? 1 + (1 - landing) * 0.32 : 1
    const x = spec.from.x + (spec.to.x - spec.from.x) * eased
    const y = spec.from.y + (spec.to.y - spec.from.y) * eased
    return {
      opacity: 0.28 + eased * 0.72,
      transform: [
        { translateX: x - DOT_SIZE / 2 },
        { translateY: y - DOT_SIZE / 2 },
        { scale: smash }
      ]
    }
  })

  return <Animated.View style={[styles.dot, style]} />
})

export function CircleScoreRing({ size, radius, onSettled }: Props) {
  const center = useMemo(() => ({ x: size / 2, y: size / 2 }), [size])

  const dots = useMemo<DotSpec[]>(() => {
    return Array.from({ length: DOT_COUNT }, (_, id) => {
      const to = pointOnCircle(center, radius, id, DOT_COUNT)
      const spread = SCATTER_EXTRA + seededUnit(id, 1) * 52
      const angle = seededUnit(id, 2) * Math.PI * 2
      return {
        id,
        to,
        from: {
          x: center.x + Math.cos(angle) * spread,
          y: center.y + Math.sin(angle) * spread
        }
      }
    })
  }, [center, radius])

  const clock = useSharedValue(0)

  useEffect(() => {
    clock.value = 0
    clock.value = withTiming(
      DOT_COUNT + LAND_WINDOW,
      { duration: 2400, easing: Easing.out(Easing.cubic) },
      finished => {
        if (finished && onSettled) {
          runOnJS(onSettled)()
        }
      }
    )
  }, [clock, onSettled])

  return (
    <View style={[styles.ring, { width: size, height: size }]}>
      {dots.map(spec => (
        <ScoreDot key={spec.id} spec={spec} clock={clock} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create(theme => ({
  ring: {
    position: 'absolute'
  },
  dot: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: theme.colors.white
  }
}))