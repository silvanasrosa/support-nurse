import { useEffect, useState } from 'react'

const format = () => new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date())

/** Hora local de quem esta vendo (HH:mm), atualizada a cada 15s. */
export function useClock() {
  const [now, setNow] = useState(format)
  useEffect(() => {
    const id = window.setInterval(() => setNow(format()), 15000)
    return () => window.clearInterval(id)
  }, [])
  return now
}
