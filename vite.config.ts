import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'

const page = (path: string) => fileURLToPath(new URL(path, import.meta.url))

/**
 * Coloca o CSS do build dentro do HTML (<style>) em vez de um <link>: o navegador desenha a primeira tela
 * sem esperar mais um arquivo (o PageSpeed apontava o CSS como "bloqueio de renderizacao" no celular).
 */
function inlineCss(): Plugin {
  return {
    name: 'inline-css',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      const css = Object.values(bundle).filter((f) => f.type === 'asset' && f.fileName.endsWith('.css'))
      for (const file of Object.values(bundle)) {
        if (file.type !== 'asset' || !file.fileName.endsWith('.html')) continue
        let html = String(file.source)
        for (const c of css) {
          if (c.type !== 'asset') continue
          const at = html.indexOf(`href="/${c.fileName}"`)
          if (at < 0) continue
          const start = html.lastIndexOf('<link', at)
          const end = html.indexOf('>', at) + 1
          html = html.slice(0, start) + `<style>${String(c.source)}</style>` + html.slice(end)
        }
        file.source = html
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), inlineCss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  // duas paginas: a inicial e "Quem somos" (/quem-somos/)
  build: {
    // o CSS ja vai dentro do HTML (inlineCss): os pacotes carregados depois nao precisam baixa-lo de novo
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        main: page('./index.html'),
        quemSomos: page('./quem-somos/index.html'),
      },
    },
  },
})
