import type { FieldTemplate } from './field-template'

export type Coordinate = { x: number, y: number, z: number }
export type Coordinate2D = { x: number, y: number }
export type Move = [Tile, Tile]
export type Tile = {
  kind: string
  /** Coordinate of the top half of the tile. */
  coord: Coordinate
}
export type Comparator = (kindA: string, kindB: string) => boolean

export class Game {
  private inGameTiles: Tile[]
  private selectedTile: Tile | null
  comparator: Comparator
  private moveHistory: Move[]

  constructor(
    tiles: Tile[],
    comparator: Comparator,
    public onSelectedTileChange?: (tile: Tile | null) => void,
    public onTilesChange?: (tiles: Tile[]) => void,
  ) {
    this.inGameTiles = tiles
    this.selectedTile = null
    this.comparator = comparator
    this.moveHistory = []
  }

  public static random(
    template: FieldTemplate,
    comparator: Comparator,
    kinds: string[],
    maxRetries = 100,
  ): Game {
    const availableCoords = [...template.tileCoords]

    if (availableCoords.length % 2 !== 0) {
      throw new Error(`The number of tile positions (${availableCoords.length}) must be even`)
    }

    if (availableCoords.length !== kinds.length * 4 && availableCoords.length !== kinds.length * 2) {
      throw new Error(`The number of tile positions (${availableCoords.length}) must be equal to the number of choices (${kinds.length}) times 4 or times 2`)
    }

    for (let retry = 0; retry < maxRetries; retry++) {
      const tiles: Tile[] = []
      const tilePerKind = availableCoords.length / kinds.length
      for (const kind of kinds) {
        for (let i = 0; i < tilePerKind; i++) {
          tiles.push({ kind, coord: null as any })
        }
      }
      // Shuffle tiles
      shuffleArray(tiles)

      // Shuffle coordinates
      shuffleArray(availableCoords)

      // Assign tiles to coordinates
      for (let i = 0; i < tiles.length; i++) {
        tiles[i].coord = availableCoords[i]
      }

      // Create Game instance
      const game = new Game(tiles, comparator)

      // Check solvability
      const visited = new Set<string>()
      if (isSolvable(game, visited)) {
        return game
      }
    }

    throw new Error('Unable to generate a solvable game after maximum retries.')
  }

  public tiles(): Tile[] {
    return this.inGameTiles
  }

  public selectAt(coord: Coordinate2D): void {
    const tile = this.tilesAt2D(coord)[0]
    if (!tile)
      return

    if (this.selectedTile) {
      if (coordsEqual(this.selectedTile.coord, tile.coord)) {
        this.selectedTile = null
        this.onSelectedTileChange?.(this.selectedTile)
        return
      }
      else if (this.comparator(this.selectedTile.kind, tile.kind) && this.isTileOpen(tile.coord)) {
        this.removePairTiles(this.selectedTile.coord, tile.coord)
        this.moveHistory.push([this.selectedTile, tile]) // Track the move
        this.selectedTile = null
        this.onSelectedTileChange?.(this.selectedTile)
        return
      }
    }

    if (this.isTileOpen(tile.coord)) {
      this.selectedTile = tile
      this.onSelectedTileChange?.(this.selectedTile)
    }
  }

  public removePairTiles(coord1: Coordinate, coord2: Coordinate): void {
    this.inGameTiles = this.inGameTiles.filter(t => !coordsEqual(t.coord, coord1) && !coordsEqual(t.coord, coord2))
    this.onTilesChange?.(this.inGameTiles)
  }

  public tilesAt2D(coord: Coordinate2D): Tile[] {
    return this.inGameTiles
      .filter(t => t.coord.x === coord.x && (t.coord.y === coord.y || t.coord.y + 1 === coord.y))
      .sort((a, b) => b.coord.z - a.coord.z)
  }

  /** Returns a tile at field coordinate. */
  public tileAt({ x, y, z }: Coordinate): Tile | null {
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

  public lastMove(): Move | null {
    return this.moveHistory[this.moveHistory.length - 1] || null
  }

  public undoLastMove(): void {
    if (this.moveHistory.length === 0) {
      console.log('No move to undo')
      return
    }

    const [tile1, tile2] = this.moveHistory[this.moveHistory.length - 1]

    // Restore the previous state of the game (before the last move)
    this.inGameTiles = [...this.inGameTiles, tile1, tile2]
    this.moveHistory.pop() // Remove the last move from history
    this.onTilesChange?.(this.inGameTiles)
  }

  public clone(): Game {
    return new Game(
      this.inGameTiles.map(tile => ({ ...tile, coord: { ...tile.coord } })),
      this.comparator,
      this.onSelectedTileChange,
      this.onTilesChange,
    )
  }
}

export function coordsEqual(a: Coordinate, b: Coordinate): boolean {
  return a.x === b.x && a.y === b.y && a.z === b.z
}

function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

function serializeGame(game: Game): string {
  const tileStrings = game
    .tiles()
    .map(tile => `${tile.kind}:${tile.coord.x},${tile.coord.y},${tile.coord.z}`)
    .sort()
  return tileStrings.join('|')
}

function isSolvable(game: Game, visited: Set<string>): boolean {
  // Base case: if no tiles left, return true
  if (game.tiles().length === 0) {
    return true
  }

  const gameState = serializeGame(game)
  if (visited.has(gameState)) {
    return false
  }
  visited.add(gameState)

  // Get all open tiles
  const openTiles = game.tiles().filter(tile => game.isTileOpen(tile.coord))

  // For all pairs of open tiles that can be matched
  for (let i = 0; i < openTiles.length; i++) {
    for (let j = i + 1; j < openTiles.length; j++) {
      const tileA = openTiles[i]
      const tileB = openTiles[j]

      if (game.comparator(tileA.kind, tileB.kind)) {
        // Try removing these tiles
        const newGame = game.clone()
        newGame.removePairTiles(tileA.coord, tileB.coord)

        if (isSolvable(newGame, visited)) {
          return true
        }
      }
    }
  }

  // If no moves lead to a solution, return false
  return false
}
