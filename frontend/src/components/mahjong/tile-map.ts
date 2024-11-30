import type { Coordinate, Tile } from '@/components/mahjong/game.ts'

export class TileMap {
  private readonly tileMap: {
    [key: string]: Tile
  }

  constructor(tiles: Tile[]) {
    this.tileMap = {}
    for (const tile of tiles) {
      this.tileMap[tileToKey(tile)] = tile
    }
  }

  public get(coord: Coordinate): Tile | null {
    return this.tileMap[tileToKey(coord)] || null
  }

  public set(tile: Tile): void {
    this.tileMap[tileToKey(tile)] = tile
  }

  public delete(tile: Tile): void {
    delete this.tileMap[tileToKey(tile)]
  }

  public tiles(): Tile[] {
    return Object.values(this.tileMap)
  }

  public isOpen({ x, y, z }: Coordinate): boolean {
    let occupiedLeft = this.get({ x: x - 1, y, z }) !== null
    occupiedLeft = occupiedLeft || (this.get({ x: x - 1, y: y - 1, z }) !== null)
    occupiedLeft = occupiedLeft || (this.get({ x: x - 1, y: y + 1, z }) !== null)

    let occupiedRight = this.get({ x: x + 1, y, z }) !== null
    occupiedRight = occupiedRight || (this.get({ x: x + 1, y: y - 1, z }) !== null)
    occupiedRight = occupiedRight || (this.get({ x: x + 1, y: y + 1, z }) !== null)

    let occupiedTop = this.get({ x, y, z: z + 1 }) !== null
    occupiedTop = occupiedTop || (this.get({ x, y: y - 1, z: z + 1 }) !== null)
    occupiedTop = occupiedTop || (this.get({ x, y: y + 1, z: z + 1 }) !== null)

    if (occupiedTop) {
      return false
    }

    if (occupiedLeft && occupiedRight) {
      return false
    }

    return true
  }

  public openExists(): boolean {
    for (const tile of this.tiles()) {
      if (this.isOpen(tile.coord)) {
        return true
      }
    }
    return false
  }
}

function tileToKey(tile: Tile | Coordinate): string {
  if ('x' in tile) {
    return `${tile.x},${tile.y},${tile.z}`
  }
  return `${tile.coord.x},${tile.coord.y},${tile.coord.z}`
}
