import type { Coordinate } from './game'

/**
 * Field template is encoded as a list of 2D matrixes, where each matrix
 * represents a layer of the field.
 *
 * Each matrix is a 2D array of 0, 1 and 2, where:
 * - 0: empty tile
 * - 1: top part of a tile
 * - 2: bottom part of a tile
 *
 * We represent each tile with 2 numbers, because a tile occupies 2 sections
 * of the layer.
 *
 * @example
 * ```
 * // Template for a field with two layers:
 * // 1. 6 tiles on the first;
 * // 2. 2 tiles on the second.
 * [
 *  [[0, 1, 1, 0],
 *   [1, 2, 2, 1],
 *   [2, 1, 1, 2],
 *   [0, 2, 2, 0]],
 *
 *  [[0, 0, 0, 0],
 *   [0, 1, 1, 0],
 *   [0, 2, 2, 0],
 *   [0, 0, 0, 0]],
 * ]
 * ```
 */
export type EncodedTemplate = number[][][]

export class FieldTemplate {
  tileCoords: Coordinate[]

  constructor(tileCoords: Coordinate[]) {
    this.tileCoords = tileCoords
  }

  static decode(encoded: EncodedTemplate): FieldTemplate {
    const tileCoords: Coordinate[] = []

    for (let z = 0; z < encoded.length; z++) {
      for (let y = 0; y < encoded[z].length; y++) {
        for (let x = 0; x < encoded[z][y].length; x++) {
          switch (encoded[z][y][x]) {
            case 0: break
            case 1: { // Make sure below is 2 and add the tile.
              if (encoded[z][y + 1]?.[x] !== 2)
                throw new Error('Invalid template: 1 without 2 below')
              tileCoords.push({ x, y, z: z + 1 })
              break
            }
            case 2: { // Make sure above is 1.
              if (encoded[z][y - 1]?.[x] !== 1)
                throw new Error('Invalid template: 2 without 1 above')
              break
            }
          }
        }
      }
    }

    return new FieldTemplate(tileCoords)
  }
}

export const TEMPLATE_1: EncodedTemplate = [
  [
    [0, 1, 1, 0],
    [1, 2, 2, 1],
    [2, 1, 1, 2],
    [0, 2, 2, 0],
  ],

  [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 2, 2, 0],
    [0, 0, 0, 0],
  ],
]

export const TEMPLATE_2: EncodedTemplate = [
  // Layer 1
  [
    [0, 1, 0, 1, 0],
    [1, 2, 0, 2, 1],
    [2, 1, 1, 1, 2],
    [0, 2, 2, 2, 0],
    [0, 0, 0, 0, 0],
  ],

  // Layer 2
  [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 2, 2, 2, 0],
    [1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2],
  ],

  // Layer 3
  [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 2, 2, 2, 0],
    [0, 0, 0, 0, 0],
  ],
]
