import type { ExpoWebGLRenderingContext } from 'expo-gl'
import { AccessibilityInfo } from 'react-native'
import { buildPalette, clamp } from './colors'
import { linkAuroraProgram, setupAuroraMesh } from './program'

export type AuroraSettings = {
  colors: string[]
  intensity: number
  amplitude: number
  scale: number
  speed: number
  layers: number
  height: number
  rays: number
  blend: number
}

const INTRO_SECONDS = 1.2

export class AuroraEngine {
  private gl: ExpoWebGLRenderingContext
  private program: WebGLProgram
  private uniforms: Record<string, WebGLUniformLocation | null>
  private vao: WebGLVertexArrayObject | null
  private palette = new Float32Array(5 * 3)
  private view = { w: 1, h: 1 }
  private clock = 0
  private reveal = 0.35
  private reduceMotion = false
  private drift = 0
  private last = 0
  private raf = 0
  private alive = true
  private quality: number

  constructor(gl: ExpoWebGLRenderingContext, private settings: AuroraSettings, quality = 0.85) {
    this.gl = gl
    this.quality = quality
    const linked = linkAuroraProgram(gl)
    if (!linked) throw new Error('Aurora shader failed to link')
    this.program = linked.program
    this.uniforms = linked.uniforms
    this.vao = setupAuroraMesh(gl).vao

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    AccessibilityInfo.isReduceMotionEnabled().then(v => {
      this.reduceMotion = v
      if (v) this.reveal = 1
    })
  }

  setSettings(settings: AuroraSettings) {
    this.settings = settings
  }

  setDrift(value: number) {
    this.drift = value
  }

  resize(width: number, height: number) {
    const dpr = Math.min(2, this.quality)
    this.view.w = Math.max(1, Math.round(width * dpr))
    this.view.h = Math.max(1, Math.round(height * dpr))
    this.gl.viewport(0, 0, this.view.w, this.view.h)
  }

  start() {
    this.draw()
    this.loop(0)
  }

  stop() {
    this.alive = false
    cancelAnimationFrame(this.raf)
  }

  private loop = (now: number) => {
    if (!this.alive) return
    const dt = this.last ? clamp((now - this.last) / 1000, 0.0005, 0.05) : 1 / 60
    this.last = now
    const motion = this.reduceMotion ? 0 : 1
    this.clock += dt * this.settings.speed * motion
    if (this.reveal < 1) this.reveal = Math.min(1, this.reveal + dt / INTRO_SECONDS)
    this.draw()
    this.raf = requestAnimationFrame(this.loop)
  }

  private draw() {
    const gl = this.gl
    const s = this.settings
    const u = this.uniforms
    const stops = s.colors.length >= 2 ? s.colors : ['#22e584', '#19d3c5', '#4f7dff', '#a05cff']

    this.palette.set(buildPalette(stops, 5))

    gl.useProgram(this.program)
    gl.bindVertexArray(this.vao)
    gl.uniform2f(u.uResolution!, this.view.w, this.view.h)
    gl.uniform1f(u.uTime!, this.clock)
    gl.uniform3fv(u.uStops!, this.palette)
    gl.uniform1i(u.uStopCount!, stops.length)
    gl.uniform1f(u.uAmplitude!, s.amplitude)
    gl.uniform1f(u.uBlend!, s.blend)
    gl.uniform1f(u.uHeight!, s.height)
    gl.uniform1f(u.uScale!, s.scale)
    gl.uniform1f(u.uGlow!, s.rays)
    gl.uniform1f(u.uBrightness!, s.intensity)
    gl.uniform1i(u.uLayers!, clamp(Math.round(s.layers), 1, 3))
    gl.uniform1f(u.uFlip!, 0)
    gl.uniform3f(u.uPointer!, this.drift * 0.22, 0.5, 0)
    gl.uniform1f(u.uReveal!, 1 - Math.pow(1 - this.reveal, 3))
    gl.uniform1f(u.uOpacity!, 1)
    gl.uniform1f(u.uLightMode!, 0)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    gl.endFrameEXP()
  }
}