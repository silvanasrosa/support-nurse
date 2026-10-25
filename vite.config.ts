import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import { allCities, areas, regions, type Region } from './src/content/areas.ts'

type QA = { q: string; a: string }
type Item = { title: string; text: string }

const page = (path: string) => fileURLToPath(new URL(path, import.meta.url))


const SITE = 'https://supportnurse.com.br'
const NL = String.fromCharCode(10)
const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * Pagina "Areas atendidas": escreve no HTML, ja no build, o texto da pagina e os dados estruturados
 * (FAQ, servico por cidade, breadcrumb), a partir de src/content/areas.ts. Buscadores e IAs que nao rodam
 * JavaScript leem tudo; o React substitui esse conteudo ao abrir a pagina.
 */
function areasSeo(): Plugin {
  const jsonld = [
    {
      '@type': 'CollectionPage',
      '@id': `${SITE}/areas-atendidas/#pagina`,
      url: `${SITE}/areas-atendidas/`,
      name: 'Áreas atendidas | Support Nurse',
      description: areas.text,
      isPartOf: { '@id': `${SITE}/#site` },
      about: { '@id': `${SITE}/#empresa` },
      inLanguage: 'pt-BR',
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Áreas atendidas', item: `${SITE}/areas-atendidas/` },
        ],
      },
    },
    {
      '@type': 'Service',
      '@id': `${SITE}/areas-atendidas/#servico`,
      name: 'Home care e enfermagem domiciliar na Grande São Paulo',
      serviceType: 'Home care (assistência domiciliar de enfermagem e equipe multidisciplinar)',
      provider: { '@id': `${SITE}/#empresa` },
      areaServed: [
        { '@type': 'AdministrativeArea', name: 'Região Metropolitana de São Paulo (Grande São Paulo)' },
        ...allCities.map((name: string) => ({ '@type': 'City', name })),
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE}/areas-atendidas/#faq`,
      mainEntity: areas.faq.items.map((i: QA) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
    },
  ]
    .map((o) => JSON.stringify(o))
    .join(', ')

  const html = `<div style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">
<main>
<h1>${esc(areas.title)} ${esc(areas.titleAccent)}</h1>
<p>${esc(areas.text)}</p>
<h2>${esc(areas.list.title)} ${esc(areas.list.titleAccent)}</h2>
<p>${esc(areas.list.intro)}</p>
${regions.map((r: Region) => `<h3>${esc(r.name)}</h3><ul>${r.cities.map((c: string) => `<li>Home care em ${esc(c)}</li>`).join('')}</ul>`).join(NL)}
<h2>${esc(areas.same.title)} ${esc(areas.same.titleAccent)}</h2>
${areas.same.items.map((i: Item) => `<h3>${esc(i.title)}</h3><p>${esc(i.text)}</p>`).join(NL)}
<h2>${esc(areas.faq.title)} ${esc(areas.faq.titleAccent)}</h2>
${areas.faq.items.map((i: QA) => `<h3>${esc(i.q)}</h3><p>${esc(i.a)}</p>`).join(NL)}
<p>Central 24h: (11) 3132-4161 · WhatsApp: (11) 97563-8606 · contato@supportnurse.com.br · R. Augusta, 101, 15º andar, sala 1507, Consolação, São Paulo/SP</p>
</main>
</div>`

  return {
    name: 'areas-seo',
    transformIndexHtml(source) {
      if (!source.includes('<!--areas-')) return source
      return source.replace('<!--areas-jsonld-->', jsonld).replace('<!--areas-prerender-->', html)
    },
  }
}

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
  plugins: [react(), tailwindcss(), areasSeo(), inlineCss()],
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
        areas: page('./areas-atendidas/index.html'),
      },
    },
  },
})
