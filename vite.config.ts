import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

const page = (path: string) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  // duas paginas: a inicial e "Quem somos" (/quem-somos/)
  build: {
    rollupOptions: {
      input: {
        main: page('./index.html'),
        quemSomos: page('./quem-somos/index.html'),
      },
    },
  },
})
