import type { Tile as TileT } from './game'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { FieldTemplate, TEMPLATE_1 } from './field-template'
import { coordsEqual, Game } from './game'

export function Mahjong() {
  const [tiles, setTiles] = useState<TileT[]>([])
  const [selected, setSelected] = useState<TileT | null>(null)

  const [game, _] = useState(() => {
    const g = Game.random(
      FieldTemplate.decode(TEMPLATE_1),
      (a, b) => a === b,
      ['A', 'B', 'C', 'D'],
    )
    g.onTilesChange = setTiles
    g.onSelectedTileChange = setSelected
    setTiles(g.tiles())
    return g
  })

  return (
    <div className="relative">
      {tiles.map((t, i) => (
        <Tile
          key={i}
          tile={t}
          open={game.isTileOpen(t.coord)}
          selected={selected ? coordsEqual(t.coord, selected.coord) : false}
          onClick={() => game.selectAt(t.coord)}
        />
      ))}
    </div>
  )
}

function Tile({
  tile,
  open,
  selected,
  onClick,
}: {
  tile: TileT
  open: boolean
  selected: boolean
  onClick?: () => void
}) {
  return (
    <div
      className={cn(
        'h-[40px] w-[20px] border bg-gray-300 text-green-900 translate-x-[calc(var(--x)*20px)] translate-y-[calc(var(--y)*20px)] absolute',
        !open && 'bg-slate-500 text-red-900',
        selected && 'bg-blue-500 text-white',
      )}
      style={{
        '--x': tile.coord.x,
        '--y': tile.coord.y,
        'zIndex': tile.coord.z,
      } as React.CSSProperties}
      onClick={(e) => {
        e.preventDefault()
        onClick?.()
      }}
    >
      {tile.kind as string}
    </div>
  )
}
