import type { CSSProperties } from 'react'
import type { Coordinate } from './game'
import { cn } from '@/lib/utils'
import React from 'react'
import styles from './Mahjong.module.scss'

function _BrandTile({ brand }: { brand: string }) {
  const imgPath = `/logos/${brand}-logo.png`
  return (
    <>
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
    </>
  )
}

const BrandTile = React.memo(_BrandTile)

export function Tile({
  className,
  brand,
  closed,
  selected,
  hinted,
  coord,
  onClick,
}: {
  className?: string
  brand: string
  closed: boolean
  selected: boolean
  hinted: boolean
  coord: Coordinate
  onClick?: () => void
}) {
  return (
    <div
      className={cn(styles.tile, closed && styles.closed, selected && styles.selected, hinted && styles.hinted, className)}
      data-coord={`${coord.x},${coord.y},${coord.z}`}
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
        <BrandTile brand={brand} />
      </div>
      <span data-back="" />
    </div>
  )
}
