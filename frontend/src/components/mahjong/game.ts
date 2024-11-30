/* eslint-disable no-console */
import type { FieldTemplate } from './field-template'
import { TileMap } from '@/components/mahjong/tile-map.ts'

export type Coordinate = { x: number, y: number, z: number }
export type Coordinate2D = { x: number, y: number }
export type Move = [Tile, Tile]
export type Tile = {
  kind: string
  /** Coordinate of the top half of the tile. */
  coord: Coordinate
}
export type Comparator = (kindA: string, kindB: string) => boolean

export type TileSelectOutcome =
  | 'none'
  | 'selected'
  | 'unselected'
  | 'merged'

export class Game {
  private selectedTile: Tile | null
  private tileMap: TileMap
  comparator: Comparator
  private moveHistory: Move[]

  constructor(
    tiles: Tile[],
    comparator: Comparator,
    public onSelectedTileChange?: (tile: Tile | null) => void,
    public onTilesChange?: (tiles: Tile[]) => void,
  ) {
    this.tileMap = new TileMap(tiles)
    this.selectedTile = null
    this.comparator = comparator
    this.moveHistory = []
  }

  public static random(
    template: FieldTemplate,
    comparator: Comparator,
    allKinds: string[],
    maxRetries = 100,
  ): Game {
    console.log('random')

    const availableCoords = [...template.tileCoords]

    if (availableCoords.length % 2 !== 0) {
      throw new Error(`The number of tile positions (${availableCoords.length}) must be even`)
    }

    const kinds: string[] = []
    if (availableCoords.length / 4 > allKinds.length) {
      kinds.push(...allKinds)
      for (let i = 0; i < availableCoords.length / 4 - allKinds.length; i++) {
        kinds.push(allKinds[Math.floor(Math.random() * allKinds.length)])
      }
    }
    else if (availableCoords.length / 4 === allKinds.length) {
      kinds.push(...allKinds)
    }
    else {
      const leftoverKinds = [...allKinds]
      shuffleArray(leftoverKinds)
      kinds.push(...leftoverKinds.slice(0, Math.ceil(availableCoords.length / 4)))
    }
    console.log('kindCounter')

    const kindCounter: { [key: string]: number } = {}
    let current = 0
    for (const kind of kinds) {
      if (availableCoords.length - current >= 4) {
        kindCounter[kind] = (kindCounter[kind] || 0) + 4
        current += 4
      }
      else if (availableCoords.length - current === 2) {
        kindCounter[kind] = (kindCounter[kind] || 0) + 2
        current += 2
      }
      else {
        throw new Error('Invalid number of available coordinates')
      }
    }
    console.log('kindCounter', kindCounter)

    for (let retry = 0; retry < maxRetries; retry++) {
      console.log('retry', retry)
      const currentTryCounter = { ...kindCounter }
      const currentAvailableCoords = [...availableCoords]
      const tileMap: TileMap = new TileMap([])

      // Try to fill the field with tiles
      console.profile('fillField')
      let innerTries = currentAvailableCoords.length
      console.log('currentAvailableCoords.length', currentAvailableCoords.length)

      while (currentAvailableCoords.length > 0 && innerTries-- > 0) {
        console.log('innerTries', innerTries)
        // Choose random kind from currentTryCounter
        const kind = Object.keys(currentTryCounter)[Math.floor(Math.random() * Object.keys(currentTryCounter).length)]

        // find a pair of coordinates for the kind
        const coords = getTwoRandomElements(currentAvailableCoords)

        if (!coords) {
          break
        }

        tileMap.set({ kind, coord: coords[0] })
        tileMap.set({ kind, coord: coords[1] })

        if (!tileMap.openExists()) {
          tileMap.delete({ kind, coord: coords[0] })
          tileMap.delete({ kind, coord: coords[1] })
          continue
        }

        currentTryCounter[kind] = currentTryCounter[kind] -= 2
        if (currentTryCounter[kind] === 0) {
          delete currentTryCounter[kind]
        }

        currentAvailableCoords.splice(currentAvailableCoords.indexOf(coords[0]), 1)
        currentAvailableCoords.splice(currentAvailableCoords.indexOf(coords[1]), 1)
      }
      console.profileEnd('fillField')

      // Create Game instance
      if (currentAvailableCoords.length === 0) {
        const game = new Game(tileMap.tiles(), comparator)
        if (isSolvable(game, new Set<string>())) {
          return game
        }
      }
    }

    throw new Error('Unable to generate a solvable game after maximum retries.')
  }

  public tiles(): Tile[] {
    return this.tileMap.tiles()
  }

  public selectTileAt(exactCoord: Coordinate): TileSelectOutcome {
    const tile = this.tiles().find(tile => coordsEqual(tile.coord, exactCoord))
    if (!tile)
      return 'none'
    return this.selectTile(tile)
  }

  private selectTile(tile: Tile): TileSelectOutcome {
    if (this.selectedTile) {
      if (coordsEqual(this.selectedTile.coord, tile.coord)) {
        this.selectedTile = null
        this.onSelectedTileChange?.(this.selectedTile)
        return 'unselected'
      }
      else if (this.comparator(this.selectedTile.kind, tile.kind) && this.isTileOpen(tile.coord)) {
        this.removePairTiles(this.selectedTile, tile)
        this.moveHistory.push([this.selectedTile, tile]) // Track the move
        this.selectedTile = null
        this.onSelectedTileChange?.(this.selectedTile)
        return 'merged'
      }
    }

    if (this.isTileOpen(tile.coord)) {
      this.selectedTile = tile
      this.onSelectedTileChange?.(this.selectedTile)
      return 'selected'
    }

    return 'none'
  }

  public removePairTiles(tile1: Tile, tile2: Tile): void {
    this.tileMap.delete(tile1)
    this.tileMap.delete(tile2)
    this.onTilesChange?.(this.tiles())
  }

  /** Returns whether the tile at the given field coordinate is open. */
  public isTileOpen({ x, y, z }: Coordinate): boolean {
    return this.tileMap.isOpen({ x, y, z })
  }

  public lastMove(): Move | null {
    return this.moveHistory[this.moveHistory.length - 1] || null
  }

  public undoLastMove(): boolean {
    if (this.moveHistory.length === 0) {
      return false
    }

    const [tile1, tile2] = this.moveHistory[this.moveHistory.length - 1]

    // Restore the previous state of the game (before the last move)
    this.tileMap.set(tile1)
    this.tileMap.set(tile2)
    this.selectedTile = null
    this.moveHistory.pop() // Remove the last move from history
    this.onTilesChange?.(this.tiles())
    return true
  }

  public clone(): Game {
    const _tiles = this.tiles().slice()
    return new Game(
      _tiles,
      this.comparator,
      this.onSelectedTileChange,
      this.onTilesChange,
    )
  }

  public shuffle(): void {
    const tiles = this.tiles().slice()
    // shuffle coordinates while keeping kind count
    const kindCounter: { [key: string]: number } = {}
    for (const tile of tiles) {
      kindCounter[tile.kind] = (kindCounter[tile.kind] || 0) + 1
    }

    const availableCoords = tiles.map(tile => tile.coord)
    shuffleArray(availableCoords)
    const newTiles: Tile[] = []
    for (const tile of tiles) {
      const coord = availableCoords.pop()
      if (!coord) {
        throw new Error('Not enough available coordinates')
      }
      newTiles.push({ kind: tile.kind, coord })
    }

    this.tileMap = new TileMap(newTiles)
    this.selectedTile = null
    this.moveHistory = []
    this.onTilesChange?.(this.tiles())
  }

  public hint(previousPair: [Tile, Tile] | null): [Tile, Tile] | null {
    const openTiles = this.tiles().filter(tile => this.isTileOpen(tile.coord))
    shuffleArray(openTiles)

    const seen = new Set<Tile>()
    let fallbackPair: [Tile, Tile] | null = null

    for (const tile of openTiles) {
      for (const seenTile of seen) {
        if (this.comparator(tile.kind, seenTile.kind)) {
          const newPair: [Tile, Tile] = [tile, seenTile]
          // If no previousPair or the new pair is different, return it
          if (!previousPair) {
            return newPair
          }
          if (
            !(coordsEqual(previousPair[0].coord, newPair[0].coord) && coordsEqual(previousPair[1].coord, newPair[1].coord))
            && !(coordsEqual(previousPair[0].coord, newPair[1].coord) && coordsEqual(previousPair[1].coord, newPair[0].coord))
          ) {
            return newPair
          }

          // Otherwise, store it as a fallback
          fallbackPair = newPair
        }
      }
      seen.add(tile)
    }

    // If no new pair is found, return the fallbackPair (could be previousPair)
    return fallbackPair
  }

  /**
   * Returns the current dimensions of the game field as a tuple of two coordinates:
   * - the minimum coordinate
   * - the maximum coordinate
   *
   * Coordinates are calculated from the tiles that are in the game, so
   * the returned dimensions are the smallest possible rectangle that
   * contains all the tiles.
   */
  public dimensions(): [Coordinate, Coordinate] {
    const tiles = this.tiles()

    if (tiles.length === 0) {
      return [{ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }]
    }

    const min: Coordinate = { x: Infinity, y: Infinity, z: Infinity }
    const max: Coordinate = { x: -Infinity, y: -Infinity, z: -Infinity }

    for (const tile of this.tiles()) {
      min.x = Math.min(min.x, tile.coord.x)
      min.y = Math.min(min.y, tile.coord.y)
      min.z = Math.min(min.z, tile.coord.z)
      max.x = Math.max(max.x, tile.coord.x)
      max.y = Math.max(max.y, tile.coord.y + 1)
      max.z = Math.max(max.z, tile.coord.z)
    }

    return [min, max]
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
        newGame.removePairTiles(tileA, tileB)

        if (isSolvable(newGame, visited)) {
          return true
        }
      }
    }
  }

  // If no moves lead to a solution, return false
  return false
}

function getTwoRandomElements<T>(array: T[]): [T, T] | null {
  if (array.length < 2) {
    console.error('Array must have at least two elements')
    return null
  }

  const firstIndex = Math.floor(Math.random() * array.length)
  let secondIndex: number

  do {
    secondIndex = Math.floor(Math.random() * array.length)
  } while (secondIndex === firstIndex)

  return [array[firstIndex], array[secondIndex]]
}
