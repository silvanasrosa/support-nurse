/**
 * Suporte a WebGL, testado uma vez so por carregamento (cada teste cria um contexto, que e caro).
 * Renderizador por software (SwiftShader, llvmpipe: sem placa de video, como no PageSpeed) desenha o 3D
 * na CPU e trava a pagina; nesse caso usamos o fallback em CSS, que tem o mesmo desenho.
 */
let usable: boolean | null = null

export function canUseWebGL() {
  if (usable !== null) return usable
  usable = false
  try {
    const c = document.createElement('canvas')
    const gl = (c.getContext('webgl2') || c.getContext('webgl')) as WebGLRenderingContext | null
    if (!gl) return usable
    const info = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : ''
    usable = !/swiftshader|llvmpipe|softpipe|software/i.test(renderer)
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    usable = false
  }
  return usable
}
