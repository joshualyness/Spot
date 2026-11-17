import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { colors } from '../theme/colors'

type Props = {
  score?: number
  label?: string
}

const SIZE = 268
const STROKE = 1.25
const RADIUS = (SIZE - STROKE) / 2

export function FitnessScoreGlyph({ score = 82, label = 'Fitness score' }: Props) {
  const appear = useRef(new Animated.Value(0)).current
  const pulse = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(appear, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true
    }).start()

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2400,
          useNativeDriver: true
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 2400,
          useNativeDriver: true
        })
      ])
    ).start()
  }, [appear, pulse])

  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.015]
  })

  return (
    <Animated.View
      style={[
        styles.wrap,
        {
          opacity: appear,
          transform: [
            {
              translateY: appear.interpolate({
                inputRange: [0, 1],
                outputRange: [18, 0]
              })
            },
            { scale }
          ]
        }
      ]}
    >
      <Svg width={SIZE} height={SIZE} style={styles.ring}>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke="rgba(255,255,255,0.55)"
          strokeWidth={STROKE}
          strokeDasharray="3.5 7"
          fill="none"
        />
      </Svg>
      <View style={styles.copy}>
        <Text style={styles.score}>{score}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ring: {
    position: 'absolute'
  },
  copy: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8
  },
  score: {
    fontFamily: 'InstrumentSerif_400Regular',
    fontSize: 92,
    lineHeight: 96,
    color: colors.white,
    letterSpacing: -2
  },
  label: {
    marginTop: 4,
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    color: colors.mutedStrong,
    letterSpacing: 0.2
  }
})
