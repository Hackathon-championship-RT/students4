import type { CSSProperties } from 'react'
import type { Coordinate } from './game'
import { cn } from '@/lib/utils'
import styles from './Tile.module.scss'

export function Tile({
  className,
  brand,
  closed,
  coord,
  onClick,
}: {
  className?: string
  brand: string
  closed: boolean
  coord: Coordinate
  onClick?: () => void
}) {
  const imgPath = `/logos/${brand}-logo.png`
  return (
    <div
      className={cn(styles.tile, closed && styles.closed, className)}
      style={{
        '--x': coord.x,
        '--y': coord.y,
        '--z': coord.z,
      } as CSSProperties}
    >
      <div
        data-wrapper=""
        onClick={onClick}
      >
        <span data-glass="" />
        <span data-noise="" />
        <div
          data-logo=""
          style={{
            '--img': `url('${imgPath}')`,
          } as CSSProperties}
        >
          <img
            src={imgPath}
            alt={brand}
          />
        </div>
        <span data-bg="" />
      </div>
      <span data-back="" />
    </div>
  )
}
