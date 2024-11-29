import type { Tile as TileT } from './game'
import { useState } from 'react'
import { FieldTemplate, TEMPLATE_2 } from './field-template'
import { Game } from './game'
import { Tile } from './Tile'

export function Mahjong() {
  const [tiles, setTiles] = useState<TileT[]>([])
  const [selected, setSelected] = useState<TileT | null>(null)

  const [game, _] = useState(() => {
    const g = Game.random(
      FieldTemplate.decode(TEMPLATE_2),
      (a, b) => a === b,
      [
        'alfa-romeo',
        'aston-martin',
        'atom',
        'audi',
        'bentley',
        'bmw',
        'bugatti',
        'byd',
        'chevrolet',
        'ferrari',
        'fiat',
        'ford',
        'honda',
        'hyundai',
        'jeep',
        'kia',
        'lamborghini',
        'land-rover',
        'lexus',
        'lucid-motors',
        'mclaren',
        'mercedes-benz',
        'mini',
        'morgan-motor-company',
        'nio',
        'porsche',
        'rivian',
        'rolls-royce',
        'subaru',
        'tesla',
        'toyota',
        'volkswagen',
        'volvo',
      ],
    )
    g.onTilesChange = setTiles
    g.onSelectedTileChange = setSelected
    setTiles(g.tiles())
    return g
  })

  const handleUndo = () => {
    game.undoLastMove()
  }

  // sort tiles by z, then by x, then by y
  tiles.sort((a, b) => {
    if (a.coord.z !== b.coord.z) {
      return a.coord.z - b.coord.z
    }
    if (a.coord.x !== b.coord.x) {
      return a.coord.x - b.coord.x
    }
    return a.coord.y - b.coord.y
  })

  return (
    <div className="relative mt-8">
      {/* Undo button */}
      <button
        className="absolute left-4 top-4 rounded bg-red-500 p-2 text-white"
        onClick={handleUndo}
      >
        Undo Move
      </button>

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
