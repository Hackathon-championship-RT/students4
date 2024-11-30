import { cn } from '@/lib/utils'
import React, { useEffect, useState } from 'react'
import useSound from 'use-sound'
import clickSound from './assets/click.mp3'
import styles from './Mahjong.module.scss'

export type Plate = {
  id: string
  items: { icon?: React.ReactNode, text?: React.ReactNode }[]
  onClick?: () => void
  clickable?: boolean
  hideOnSmall?: boolean
}

export function Controls({
  platesLeading,
  platesMiddle,
  platesTrailing,
  className,
  startTime,
}: {
  platesLeading?: Plate[]
  platesMiddle?: Plate[]
  platesTrailing?: Plate[]
  className?: string
  startTime: number
}) {
  return (
    <div className={cn(styles.controlsRoot, 'font-game', className)}>
      {platesLeading && <PlatesGroup plates={platesLeading} startTime={startTime} />}
      {platesMiddle && <PlatesGroup plates={platesMiddle} className="grow" startTime={startTime} />}
      {platesTrailing && <PlatesGroup plates={platesTrailing} startTime={startTime} />}
    </div>
  )
}

function Timer_({ startTime }: { startTime: number }) {
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Date.now() - startTime)
    }, 1000)
    return () => clearInterval(interval)
  }, [startTime])

  return (
    <div key="timer" className="flex items-center gap-2">
      <div
        className={cn('h-fit text-[1rem] sm:text-[1.25rem] lg:text-[2rem] leading-[0]', styles.plateIcon)}
      >
        <span className="iconify ph--timer-fill" />
      </div>
      <div
        className={cn('h-fit text-[0.75rem] sm:text-[1rem] lg:text-[1.5rem] leading-none', styles.plateText)}
      >
        {new Date(elapsedTime).toISOString().substring(14, 19)}
      </div>
    </div>

  )
}

const Timer = React.memo(Timer_)

function PlatesGroup({
  plates,
  className,
  startTime,
}: {
  plates: Plate[]
  className?: string
  startTime: number
}) {
  const [playClick] = useSound(clickSound)

  return (
    <div className={cn(styles.platesGroup, className)}>
      {plates.map(plate => (
        <div
          key={plate.id}
          className={cn(styles.plate, plate.clickable && styles.clickable, plate.hideOnSmall && 'hidden sm:block')}
          onClick={() => {
            if (plate.clickable) {
              playClick()
              plate.onClick?.()
            }
          }}
          role={plate.clickable ? 'button' : undefined}
          tabIndex={plate.clickable ? 0 : undefined}
        >
          {plate.id === 'time' ? <Timer startTime={startTime} /> : null}
          {plate.items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              {item.icon && <div className={cn('h-fit text-[1rem] sm:text-[1.25rem] lg:text-[2rem] leading-[0]', styles.plateIcon)}>{item.icon}</div>}
              {item.text && <div className={cn('h-fit text-[0.75rem] sm:text-[1rem] lg:text-[1.5rem] leading-none', styles.plateText)}>{item.text}</div>}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
