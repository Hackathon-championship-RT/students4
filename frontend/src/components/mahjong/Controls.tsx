import { cn } from '@/lib/utils'
import styles from './Mahjong.module.scss'

export type Plate = {
  id: string
  items: { icon?: React.ReactNode, text?: React.ReactNode }[]
  onClick?: () => void
  clickable?: boolean
}

export function Controls({
  platesLeading,
  platesMiddle,
  platesTrailing,
  className,
}: {
  platesLeading?: Plate[]
  platesMiddle?: Plate[]
  platesTrailing?: Plate[]
  className?: string
}) {
  return (
    <div className={cn(styles.controlsRoot, 'font-game', className)}>
      {platesLeading && <PlatesGroup plates={platesLeading} />}
      {platesMiddle && <PlatesGroup plates={platesMiddle} className="grow" />}
      {platesTrailing && <PlatesGroup plates={platesTrailing} />}
    </div>
  )
}

function PlatesGroup({
  plates,
  className,
}: {
  plates: Plate[]
  className?: string
}) {
  return (
    <div className={cn(styles.platesGroup, className)}>
      {plates.map(plate => (
        <div
          key={plate.id}
          className={cn(styles.plate, plate.clickable && styles.clickable)}
          onClick={plate.onClick}
          role={plate.clickable ? 'button' : undefined}
          tabIndex={plate.clickable ? 0 : undefined}
        >
          {plate.items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              {item.icon && <div className={cn('h-fit text-[2rem] leading-[0]', styles.plateIcon)}>{item.icon}</div>}
              {item.text && <div className={cn('h-fit text-[1.5rem] leading-none', styles.plateText)}>{item.text}</div>}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
