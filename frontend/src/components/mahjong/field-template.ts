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
export type EncodedTemplate = number[][]

export class FieldTemplate {
  static decode(encoded: EncodedTemplate): FieldTemplate {
    // @todo
  }
}
