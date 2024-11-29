import type { FieldTemplate } from './field-template'

export type Coordinate = { x: number, y: number, z: number }
export type Coordinate2D = { x: number, y: number }
export type Move = [Coordinate, Coordinate]
export type Tile<K = unknown> = {
  kind: K
  /** Coordinate of the top half of the tile. */
  coord: Coordinate
}
export type Comparator<K = unknown> = (kindA: K, kindB: K) => boolean

export class Game<K = unknown> {
  private inGameTiles: Tile<K>[]
  private selectedTile: Tile<K> | null
  private comparator: Comparator<K>

  constructor(
    tiles: Tile<K>[],
    comparator: Comparator<K>,
    public onSelectedTileChange?: (tile: Tile<K> | null) => void,
    public onTilesChange?: (tiles: Tile<K>[]) => void,
  ) {
    this.inGameTiles = tiles
    this.selectedTile = null
    this.comparator = comparator
  }

  public static random<K>(
    template: FieldTemplate,
    comparator: Comparator<K>,
    choices: K[],
  ): Game<K> {
    const tiles = template.tileCoords.map(coord => ({
      kind: choices[Math.floor(Math.random() * choices.length)],
      coord,
    }))

    return new Game(tiles, comparator)
  }

  public tiles(): Tile<K>[] {
    return this.inGameTiles
  }

  public selectAt(coord: Coordinate2D): void {
    const tile = this.tilesAt2D(coord)[0]
    if (!tile)
      return

    if (this.selectedTile) {
      if (coordsEqual(this.selectedTile.coord, tile.coord)) {
        this.selectedTile = null
        return
      }
      else if (this.comparator(this.selectedTile.kind, tile.kind) && this.isTileOpen(tile.coord)) {
        this.removeTile(this.selectedTile.coord)
        this.removeTile(tile.coord)
        this.selectedTile = null
        return
      }
    }

    if (this.isTileOpen(tile.coord)) {
      this.selectedTile = tile
    }

    this.onSelectedTileChange?.(this.selectedTile)
  }

  public removeTile(coord: Coordinate): void {
    this.inGameTiles = this.inGameTiles.filter(t => !coordsEqual(t.coord, coord))
    this.onTilesChange?.(this.inGameTiles)
  }

  public tilesAt2D(coord: Coordinate2D): Tile<K>[] {
    return this.inGameTiles
      .filter(t => t.coord.x === coord.x && (t.coord.y === coord.y || t.coord.y + 1 === coord.y))
      .sort((a, b) => b.coord.z - a.coord.z)
  }

  /** Returns a tile at field coordinate. */
  public tileAt({ x, y, z }: Coordinate): Tile<K> | null {
    // @todo Make better than O(n)
    for (const tile of this.inGameTiles) {
      if (tile.coord.z === z && tile.coord.x === x && (tile.coord.y === y || tile.coord.y + 1 === y)) {
        return tile
      }
    }
    return null
  }

  /** Returns whether the tile at the given field coordinate is open. */
  public isTileOpen({ x, y, z }: Coordinate): boolean {
    let occupiedLeft = false
    let occupiedRight = false

    // @todo Make better than O(n)
    for (const tile of this.inGameTiles) {
      if (tile.coord.z < z)
        continue

      if (tile.coord.z > z) {
        // If lies on top -> closed
        if (tile.coord.x === x && (Math.abs(tile.coord.y - y) <= 1)) {
          return false
        }
      }

      if (tile.coord.z === z) {
        if (tile.coord.x - 1 === x && (Math.abs(tile.coord.y - y) <= 1)) {
          occupiedLeft = true
        }
        else if (tile.coord.x + 1 === x && (Math.abs(tile.coord.y - y) <= 1)) {
          occupiedRight = true
        }
      }
    }

    return !occupiedLeft || !occupiedRight
  }
}

export function coordsEqual(a: Coordinate, b: Coordinate): boolean {
  return a.x === b.x && a.y === b.y && a.z === b.z
}
