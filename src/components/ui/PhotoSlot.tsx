import type { Icon } from '@phosphor-icons/react'
import { useState } from 'react'

type Props = {
  src: string
  alt: string
  /** icone e rotulo do espaco reservado, mostrados enquanto o arquivo nao existe */
  icon: Icon
  label: string
  className?: string
  /** dark = espaco reservado sobre fundo azul-marinho */
  tone?: 'light' | 'dark'
  /** eager para fotos que entram com recorte animado (o lazy do navegador so carrega quando o recorte abre) */
  loading?: 'lazy' | 'eager'
}

/**
 * Foto que preenche o pai (que deve ser relative + overflow-hidden).
 * Se o arquivo ainda nao existir, mostra um espaco reservado com icone e rotulo: e so salvar a foto no caminho certo.
 */
export function PhotoSlot({ src, alt, icon: Ico, label, className = '', tone = 'light', loading = 'lazy' }: Props) {
  const [missing, setMissing] = useState(false)
  if (missing) {
    const dark = tone === 'dark'
    return (
      <div
        className={`absolute inset-0 grid place-items-center ${
          dark ? 'bg-gradient-to-br from-navy-600/70 via-navy-800 to-navy-900' : 'bg-gradient-to-br from-navy-50 via-white to-[#f6eee2]'
        }`}
      >
        <div className={`flex flex-col items-center gap-3 ${dark ? 'text-white/30' : 'text-navy/30'}`}>
          <Ico size={46} weight="duotone" />
          <span className="text-[11px] font-semibold tracking-[0.16em] uppercase">{label}</span>
        </div>
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      onError={() => setMissing(true)}
      className={`absolute inset-0 size-full object-cover ${className}`}
    />
  )
}
