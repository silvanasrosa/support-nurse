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

/**
 * O orbe 3D (three.js) so entra no computador e so depois da primeira interacao (mexer o mouse, rolar,
 * teclar): compilar os materiais e gerar a iluminacao trava a pagina por segundos em aparelhos fracos.
 * Ate la (e sempre no celular/tablet, onde nao ha mouse para inclinar o orbe) fica a versao estatica.
 */
export function wants3D() {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches && canUseWebGL()
}

export function onFirstInteraction(cb: () => void) {
  const events = ['pointermove', 'pointerdown', 'wheel', 'scroll', 'keydown', 'touchstart'] as const
  let done = false
  const run = () => {
    if (done) return
    done = true
    off()
    cb()
  }
  const off = () => events.forEach((e) => window.removeEventListener(e, run))
  events.forEach((e) => window.addEventListener(e, run, { passive: true }))
  return off
}
