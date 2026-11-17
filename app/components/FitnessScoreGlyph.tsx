import { useCallback, useEffect, useRef, useState } from 'react'
import { Text, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'
import { CircleScoreRing } from './home/CircleScoreRing'

type Props = {
  score?: number
  label?: string
}

const SIZE = 268
const RADIUS = (SIZE - 8) / 2

export function FitnessScoreGlyph({ score = 82, label = 'Fitness score' }: Props) {
  const [displayScore, setDisplayScore] = useState(0)
  const counted = useRef(false)

  const breathe = useSharedValue(0)
  const reveal = useSharedValue(0)

  useEffect(() => {
    reveal.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) })
    breathe.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2600, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    )
  }, [breathe, reveal])

  const onRingSettled = useCallback(() => {
    if (counted.current) return
    counted.current = true
    const start = Date.now()
    const duration = 900
    const tick = () => {
      const t = Math.min(1, (Date.now() - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplayScore(Math.round(score * eased))
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [score])

  const wrapStyle = useAnimatedStyle(() => ({
    opacity: reveal.value,
    transform: [
      { translateY: (1 - reveal.value) * 22 },
      { scale: 1 + breathe.value * 0.012 }
    ]
  }))

  return (
    <Animated.View style={[styles.wrap, wrapStyle]}>
      <CircleScoreRing size={SIZE} radius={RADIUS} onSettled={onRingSettled} />
      <View style={styles.copy}>
        <Text style={styles.score}>{displayScore}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create(theme => ({
  wrap: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center'
  },
  copy: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8
  },
  score: {
    fontFamily: theme.fonts.serif,
    fontSize: 92,
    lineHeight: 96,
    color: theme.colors.white,
    letterSpacing: -2
  },
  label: {
    marginTop: 4,
    fontFamily: theme.fonts.sans,
    fontSize: 15,
    color: theme.colors.mutedStrong,
    letterSpacing: 0.2
  }
}))