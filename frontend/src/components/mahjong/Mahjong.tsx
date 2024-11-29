import type { Tile as TileT } from './game'
import { useState } from 'react'
import { FieldTemplate, TEMPLATE_1 } from './field-template'
import { Game } from './game'
import { Tile } from './Tile'

export function Mahjong() {
  const [tiles, setTiles] = useState<TileT<string>[]>([])
  const [selected, setSelected] = useState<TileT<string> | null>(null)

  const [game, _] = useState(() => {
    const g = Game.random<string>(
      FieldTemplate.decode(TEMPLATE_1),
      (a, b) => a === b,
      ['atom', 'bentley', 'tesla'],
    )
    g.onTilesChange = setTiles
    g.onSelectedTileChange = setSelected
    setTiles(g.tiles())
    return g
  })

  return (
    <div className="relative mt-8">
      {tiles.map((t, i) => (
        <Tile
          key={i}
          brand={t.kind}
          closed={!game.isTileOpen(t.coord)}
          onClick={() => game.selectAt(t.coord)}
          coord={t.coord}
        />
      ))}
    </div>
  )
}

// function Tile({
//   tile,
//   open,
//   selected,
//   onClick,
// }: {
//   tile: TileT
//   open: boolean
//   selected: boolean
//   onClick?: () => void
// }) {
//   return (
//     <div
//       className={cn(
//         'h-[40px] w-[20px] border bg-gray-300 text-green-900 translate-x-[calc(var(--x)*20px)] translate-y-[calc(var(--y)*20px)] absolute',
//         !open && 'bg-slate-500 text-red-900',
//         selected && 'bg-blue-500 text-white',
//       )}
//       style={{
//         '--x': tile.coord.x,
//         '--y': tile.coord.y,
//         'zIndex': tile.coord.z,
//       } as React.CSSProperties}
//       onClick={(e) => {
//         e.preventDefault()
//         onClick?.()
//       }}
//     >
//       {tile.kind as string}
//     </div>
//   )
// }
