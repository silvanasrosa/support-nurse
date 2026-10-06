import { useMemo } from 'react'
import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import { SYMBOL_SVG, SYMBOL_VIEWBOX } from './symbolPath'

/** Geometria extrudada do simbolo da marca (losango com "S" vazado). `size` = largura em unidades da cena. */
export function useSymbolGeometry(size = 2.55, depth = 70, bevel: { thickness: number; size: number; segments: number } | null = { thickness: 26, size: 20, segments: 10 }) {
  const bt = bevel?.thickness ?? 0
  const bs = bevel?.size ?? 0
  const bg = bevel?.segments ?? 1
  const hasBevel = !!bevel
  return useMemo(() => {
    const data = new SVGLoader().parse(SYMBOL_SVG)
    const all = data.paths.flatMap((p) => p.toShapes())
    // O "S" vem como contorno separado: o maior vira o losango e os demais viram furos.
    const area = (sh: THREE.Shape) => Math.abs(THREE.ShapeUtils.area(sh.getPoints()))
    all.sort((a, b) => area(b) - area(a))
    const [body, ...cuts] = all
    body.holes.push(...cuts)
    const geo = new THREE.ExtrudeGeometry(body, {
      depth,
      bevelEnabled: hasBevel,
      bevelThickness: bt,
      bevelSize: bs,
      bevelSegments: bg,
      curveSegments: 48,
    })
    geo.computeBoundingBox()
    const center = new THREE.Vector3()
    geo.boundingBox!.getCenter(center)
    geo.translate(-center.x, -center.y, -center.z)
    const scale = size / Math.max(SYMBOL_VIEWBOX.w, SYMBOL_VIEWBOX.h)
    geo.scale(scale, scale, scale) // o SVG tem Y invertido: a malha deve ser girada em PI no eixo X (sem espelhar, preserva o culling)
    geo.computeVertexNormals()
    return geo
  }, [size, depth, hasBevel, bt, bs, bg])
}
