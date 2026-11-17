import { type ExpoWebGLRenderingContext } from 'expo-gl'
import { AURORA_FRAGMENT, AURORA_VERTEX } from './shaders'

export type AuroraUniforms = Record<string, WebGLUniformLocation | null>

function shaderLog(gl: ExpoWebGLRenderingContext, shader: WebGLShader) {
  if (__DEV__ && !gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('[Aurora]', gl.getShaderInfoLog(shader))
  }
}

export function compileShader(gl: ExpoWebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    shaderLog(gl, shader)
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export function linkAuroraProgram(gl: ExpoWebGLRenderingContext) {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, AURORA_VERTEX)
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, AURORA_FRAGMENT)
  const program = gl.createProgram()
  if (!vertex || !fragment || !program) return null

  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.bindAttribLocation(program, 0, 'aPosition')
  gl.linkProgram(program)
  gl.deleteShader(vertex)
  gl.deleteShader(fragment)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    if (__DEV__) console.warn('[Aurora]', gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
    return null
  }

  const uniforms: AuroraUniforms = {}
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(program, i)
    if (info) uniforms[info.name.replace('[0]', '')] = gl.getUniformLocation(program, info.name)
  }

  return { program, uniforms }
}

export function setupAuroraMesh(gl: ExpoWebGLRenderingContext) {
  const buffer = gl.createBuffer()
  const vao = gl.createVertexArray()
  gl.bindVertexArray(vao)
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
  return { vao, buffer }
}