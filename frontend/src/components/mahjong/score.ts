import type { Game } from '@/components/mahjong/game.ts'
import type { LevelInfo } from '@/components/mahjong/levels.ts'
import { FieldTemplate } from '@/components/mahjong/field-template.ts'

export function calculateScore(
  level: LevelInfo,
  hintCount: number,
  shuffleCount: number,
  undoCount: number,
  game: Game,
) {
  const totalTiles = FieldTemplate.decode(level.template).tileCoords.length
  const ingameTiles = game.tiles().length
  const removedTiles = totalTiles - ingameTiles

  const baseScore = removedTiles * 10
  const hintPenalty = hintCount * 5
  const shufflePenalty = shuffleCount * 30
  const undoPenalty = undoCount * 10

  return Math.max(0, baseScore - hintPenalty - shufflePenalty - undoPenalty)
}
