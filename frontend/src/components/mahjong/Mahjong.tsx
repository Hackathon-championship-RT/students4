import type { DotLottieWorker } from '@lottiefiles/dotlottie-react'
import type { Coordinate, Tile as TileT } from './game'
import { $api } from '@/api'
import { useMe } from '@/api/me'
import { getLevelById, type LevelInfo, levels } from '@/components/mahjong/levels.ts'
import { calculateScore } from '@/components/mahjong/score.ts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn, pluralize } from '@/lib/utils'
import { DotLottieWorkerReact } from '@lottiefiles/dotlottie-react'
import { useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { Fragment, useEffect, useRef, useState } from 'react'
import useSound from 'use-sound'
import { Separator } from '../ui/separator'
import soundTilesMergedDelayed from './assets/bloop_300ms.mp3'
import boomLottie from './assets/boom.lottie?arraybuffer'
import soundTileSelect from './assets/pop-down.mp3'
import { brands } from './brands'
import { Controls } from './Controls'
import { FieldTemplate } from './field-template'
import { Game } from './game'
import styles from './Mahjong.module.scss'
import { Tile } from './Tile'
import { tileToKey } from './tile-map'

const LOTTIE_SIZE = 300
const ORIGINAL_TILE_WIDTH = 240
const ORIGINAL_TILE_HEIGHT = 180
const TILE_WIDTH = 150
const TILE_HEIGHT = TILE_WIDTH * (ORIGINAL_TILE_HEIGHT / ORIGINAL_TILE_WIDTH)
const ORIGINAL_OFFSET = 8
const MAX_SCALE = 1.25

export function Mahjong({ level }: { level: LevelInfo }) {
  const navigate = useNavigate()
  const [startTime] = useState(() => Date.now())
  const [tiles, setTiles] = useState<TileT[]>([])

  const [selected, setSelected] = useState<TileT | null>(null)
  const [mergedAt, setMergedAt] = useState<{ x: number, y: number } | null>(null)
  const [hint, setHint] = useState<[TileT, TileT] | null>(null)
  const [hintCount, setHintCount] = useState(0)
  const [shuffleCount, setShuffleCount] = useState(0)
  const [undoCount, setUndoCount] = useState(0)
  const [clicksCount, setClicksCount] = useState(0)
  const [score, setScore] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const animatingElements = useRef<Set<HTMLElement>>(new Set())

  const [rulesDialogOpen, setRulesDialogOpen] = useState(false)

  const [playTilesMergedDelayed] = useSound(soundTilesMergedDelayed, { volume: 0.5 })
  const [playTileSelected] = useSound(soundTileSelect, { volume: 0.5 })

  const [lottie, setLottie] = useState<DotLottieWorker | null>(null)

  const [game, _] = useState(() => {
    const g = Game.random(
      FieldTemplate.decode(level.template),
      (a, b) => a === b,
      level.choices,
    )
    g.onTilesChange = (newTitles) => {
      newTitles.sort(compareTiles)
      setTiles(newTitles)
    }
    g.onSelectedTileChange = (newSelected) => {
      setSelected(newSelected)
    }
    setTiles(g.tiles().sort(compareTiles))
    return g
  })

  const [brandInfoDialogOpen, setBrandInfoDialogOpen] = useState(false)

  const lastMove = game.lastMove()
  const lastBrand = lastMove?.[0].kind
  const lastBrandInfo = lastBrand ? brands[lastBrand as keyof typeof brands] : undefined

  const [fieldMin, fieldMax] = game.dimensions()
  const { offsetX, offsetY } = getShiftToFieldOrigin(fieldMin)
  const { scale, fieldWidth, fieldHeight } = getScaleToFitField(
    fieldMin,
    fieldMax,
    containerRef.current?.clientWidth ?? window.innerWidth,
    containerRef.current?.clientHeight ?? window.innerHeight,
  )

  const [finishResults, setFinishResults] = useState<any>(null)

  useEffect(() => {
    if (mergedAt) {
      lottie?.setFrame(0)
        .then(() => lottie.resize())
        .then(() => lottie.unfreeze())
        .then(() => lottie.play())
    }
    else {
      lottie?.stop()
    }
  }, [mergedAt, lottie])

  useEffect(() => {
    if (tiles.length === 0) {
      setFinishResults({
        level: level.id,
        time_passed: Math.round((Date.now() - startTime) / 1000),
        help_number_used: hintCount ?? 0,
        clicks_num: clicksCount ?? 0,
        score: calculateScore(level, hintCount, shuffleCount, undoCount, game),
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiles])

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      animatingElements.current.forEach(e => e.remove())
    }
  }, [])

  const updateScore = () => {
    setScore(calculateScore(level, hintCount, shuffleCount, undoCount, game))
  }

  const handleUndo = () => {
    const result = game.undoLastMove()
    if (result) {
      setUndoCount(c => c + 1)
      updateScore()
    }
  }

  const handleShuffle = () => {
    game.shuffle()
    setShuffleCount(c => c + 1)
    updateScore()
  }

  const handleHint = () => {
    setHint(game.hint(hint))
    setHintCount(c => c + 1)
    updateScore()
  }

  const handleTileClick = (t: TileT) => {
    const outcome = game.selectTileAt(t.coord)
    setClicksCount(c => c + 1)
    switch (outcome) {
      case 'selected':
        playTileSelected()
        break
      case 'merged': {
        playTileSelected()
        playTilesMergedDelayed()

        const lastMove = game.lastMove()
        const leftTiles = game.tiles().length
        if (containerRef.current && lottie && lastMove && leftTiles > 0) {
          const [tileA, tileB] = lastMove
          const aEl = containerRef.current.querySelector(`[data-coord="${tileA.coord.x},${tileA.coord.y},${tileA.coord.z}"]`)
          const bEl = containerRef.current.querySelector(`[data-coord="${tileB.coord.x},${tileB.coord.y},${tileB.coord.z}"]`)
          if (aEl && bEl) {
            const aRect = aEl.getBoundingClientRect()
            const middleA = {
              x: aRect.left + aRect.width / 2,
              y: aRect.top + aRect.height / 2,
            }
            const bRect = bEl.getBoundingClientRect()
            const middleB = {
              x: bRect.left + bRect.width / 2,
              y: bRect.top + bRect.height / 2,
            }

            const middle = {
              x: (middleA.x + middleB.x) / 2,
              y: (middleA.y + middleB.y) / 2,
            }

            const aClone = aEl.cloneNode(true) as HTMLDivElement
            aClone.style.position = 'fixed'
            aClone.style.left = `${aRect.left}px`
            aClone.style.top = `${aRect.top}px`
            aClone.style.zIndex = '9999'
            aClone.style.transformOrigin = 'top left'
            aClone.style.transform = `scale(${scale})`
            aClone.classList.remove(styles.selected)
            aClone.classList.add(styles.animated)

            const bClone = bEl.cloneNode(true) as HTMLDivElement
            bClone.style.position = 'fixed'
            bClone.style.left = `${bRect.left}px`
            bClone.style.top = `${bRect.top}px`
            bClone.style.zIndex = '9999'
            bClone.style.transformOrigin = 'top left'
            bClone.style.transform = `scale(${scale})`
            bClone.classList.remove(styles.selected)
            bClone.classList.add(styles.animated)

            // Animate them to move to a middle point and then disappear.
            const aAnim = aClone.animate(
              [
                { left: `${aRect.left}px`, top: `${aRect.top}px` },
                { left: `${middle.x - aRect.width / 2}px`, top: `${middle.y - aRect.height / 2}px` },
              ],
              {
                duration: 300,
                fill: 'forwards',
              },
            )
            bClone.animate(
              [
                { left: `${bRect.left}px`, top: `${bRect.top}px` },
                { left: `${middle.x - bRect.width / 2}px`, top: `${middle.y - bRect.height / 2}px` },
              ],
              {
                duration: 300,
                fill: 'forwards',
              },
            )

            animatingElements.current.add(aClone)
            animatingElements.current.add(bClone)

            aAnim.addEventListener('finish', () => {
              aClone.remove()
              bClone.remove()
              animatingElements.current.delete(aClone)
              animatingElements.current.delete(bClone)
              setMergedAt(middle)
            })

            document.body.appendChild(aClone)
            document.body.appendChild(bClone)
          }
        }
        updateScore()
        break
      }
      case 'none':
      case 'unselected':
        break
    }
  }

  return (
    <div className="h-full px-2 pb-2 pt-[60px]">
      <Controls
        className="fixed inset-x-0 top-0 w-full md:px-16"
        platesLeading={[
          {
            id: 'exit',
            items: [{ icon: <span className="iconify rotate-180 ph--sign-out" /> }],
            clickable: true,
            onClick: () => {
              navigate({ to: '/' })
            },
          },
        ]}
        platesMiddle={[
          {
            id: 'time',
            items: [
              // mm:ss
              { icon: <span className="iconify ph--cards-fill" />, text: tiles.length.toString() },
              { icon: <span className="iconify ph--trophy-fill" />, text: score.toString() },
            ],
          },
          {
            id: 'undo',
            items: [{ icon: <span className="iconify ph--arrow-counter-clockwise" />, text: undoCount ? undoCount.toString() : '' }],
            clickable: lastMove != null,
            onClick: handleUndo,
          },
          {
            id: 'shuffle',
            items: [{ icon: <span className="iconify ph--shuffle" />, text: shuffleCount ? shuffleCount.toString() : '' }],
            clickable: true,
            onClick: handleShuffle,
          },
          {
            id: 'hint',
            items: [{ icon: <span className="iconify ph--lightbulb-fill" />, text: hintCount ? hintCount.toString() : '' }],
            clickable: true,
            onClick: handleHint,
          },
          {
            id: 'clicks',
            items: [{ icon: <span className="iconify ph--cursor" />, text: clicksCount.toString() }],
            hideOnSmall: true,
          },

        ]}
        platesTrailing={[
          {
            id: 'info',
            items: [{ icon: <span className="iconify ph--info" /> }],
            clickable: true,
            onClick: () => {
              setRulesDialogOpen(true)
            },
          },
        ]}
        startTime={startTime}
      />

      <div
        className={styles.boom}
        style={mergedAt
          ? {
              left: `${mergedAt.x - LOTTIE_SIZE / 2}px`,
              top: `${mergedAt.y - LOTTIE_SIZE / 2}px`,
            }
          : {
              visibility: 'hidden',
            }}
      >
        <DotLottieWorkerReact
          data={boomLottie}
          autoplay={false}
          renderConfig={{
            freezeOnOffscreen: false,
          }}
          dotLottieRefCallback={setLottie}
        />
      </div>

      <div
        ref={containerRef}
        className={styles.tilesContainer}
      >
        <div
          style={{
            width: fieldWidth,
            height: fieldHeight,
            position: 'absolute',
            top: '50%',
            left: '50%',
            willChange: 'transform, width, height',
            transition: 'transform 0.3s ease 0.5s, width 0.3s ease 0.5s, height 0.3s ease 0.5s',
            transform: `scale(${scale}) translate(${offsetX}px, ${offsetY}px) translate(-50%, -50%)`,
            transformOrigin: 'top left',
          }}
        >
          {tiles.map(t => (
            <Tile
              key={tileToKey(t)}
              brand={t.kind}
              closed={!game.isTileOpen(t.coord)}
              selected={t === selected}
              hinted={hint?.includes(t) ?? false}
              onClick={() => handleTileClick(t)}
              coord={t.coord}
            />
          ))}
        </div>
      </div>

      {lastBrandInfo && (
        <Button
          className="fixed bottom-4 right-4 h-fit p-2"
          onClick={() => setBrandInfoDialogOpen(true)}
          variant="secondary"
        >
          <img
            src={lastBrandInfo.url}
            alt={lastBrandInfo.title}
            className="inline-block h-auto w-[75px]"
          />
        </Button>
      )}

      <Dialog open={brandInfoDialogOpen && lastBrandInfo != null} onOpenChange={setBrandInfoDialogOpen}>
        <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-[425px] lg:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{lastBrandInfo?.title}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 text-muted-foreground">
            <p>{lastBrandInfo?.description}</p>
            {lastBrandInfo && 'history' in lastBrandInfo && (
              <p>{lastBrandInfo.history as any}</p>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button">Закрыть</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rulesDialogOpen} onOpenChange={setRulesDialogOpen}>
        <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-[425px] lg:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Правила игры</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 text-muted-foreground">
            <p>Цель игры - убрать все плитки с поля. Чем быстрее вы это сделаете, тем больше очков вы получите.</p>
            <p>Чтобы убрать плитки, выберите две открытые плитки, на которых изображены одинаковые марки.</p>
            <p>Плитка считается открытой, если слева или справа от неё нет других плиток, а также если она не закрыта сверху.</p>
            <p>Если вы застряли, вы можете воспользоваться подсказкой, перемешать плитки или отменить последний ход. Но учтите, что каждое использование этих функций уменьшает ваш счёт.</p>
            <p>После выбора пары плиток с одинаковым брендом, в нижнем правом углу появится кнопка, нажав на которую вы сможете узнать историю и интересные факты о бренде.</p>
            <p>Удачи!</p>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button">Продолжить</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={finishResults !== null} onOpenChange={() => {}}>
        <DialogContent className="max-h-[calc(100vh-2rem)] min-w-0 max-w-[min(100%-24px,425px)] overflow-y-auto rounded-lg lg:max-w-[625px]" noCloseIcon>
          <DialogHeader>
            <DialogTitle>Поздравляем!</DialogTitle>
          </DialogHeader>
          {finishResults && (<Results {...finishResults} />)}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Results({
  level: levelId,
  time_passed,
  help_number_used,
  clicks_num,
  score,
}: {
  level?: string
  time_passed?: number
  help_number_used?: number
  clicks_num?: number
  score?: number
}) {
  const level = getLevelById(levelId)
  const levelIndex = levels.findIndex(l => l.id === levelId)
  const nextLevel = levels[levelIndex + 1]

  const me = useMe()
  const refSent = useRef(false)
  const queryClient = useQueryClient()
  const { mutate: sendResult } = $api.useMutation('post', '/users/result', {
    onSettled: () => {
      queryClient.resetQueries({
        queryKey: $api.queryOptions('get', '/users/result/{level_name}', {
          params: { path: { level_name: levelId ?? '' } },
        }).queryKey,
      })
    },
  })

  const { data: levelResults } = $api.useQuery('get', '/users/result/{level_name}', {
    params: { path: { level_name: levelId ?? '' } },
  })

  useEffect(() => {
    if (levelId === undefined || time_passed === undefined || score === undefined) {
      return
    }
    if (refSent.current) {
      return
    }
    refSent.current = true

    sendResult({
      body: {
        level_name: levelId,
        time_passed,
        help_number_used: 0,
        clicks_num: score,
      },
    })
  }, [levelId, time_passed, help_number_used, clicks_num, sendResult, score])

  if (!level) {
    return <div>Invalid level id</div>
  }

  const resultsTable = [...(levelResults ?? [])].sort((a, b) => {
    if (b.lvlInfo.clicks_num - a.lvlInfo.clicks_num !== 0)
      return b.lvlInfo.clicks_num - a.lvlInfo.clicks_num
    return a.lvlInfo.time_passed - b.lvlInfo.time_passed
  })

  return (
    <div>
      <p className="mb-4 text-muted-foreground">
        Вы прошли уровень
        {' '}
        «
        {level.title}
        »
      </p>
      <CardContent>
        <div>
          Баллы:
          {' '}
          {score}
        </div>
        <div>
          Время:
          {' '}
          {time_passed}
          {' '}
          {pluralize(time_passed ?? 0, 'секунда', 'секунды', 'секунд')}
        </div>
        <div>
          Использовано подсказок:
          {' '}
          {help_number_used}
        </div>
        <div>
          Сделано кликов:
          {' '}
          {clicks_num}
        </div>

        <div className="my-2 flex w-full flex-row gap-2">
          {(help_number_used === 0) && (
            <Card className="max-w-40">
              <CardContent className="px-4 py-2">
                <div className="aspect-square rounded-lg bg-gray-500">
                  <img src="/no-hints.png" />
                </div>
              </CardContent>
              <CardHeader className="px-4 py-2">
                <CardTitle className="text-center text-sm lg:text-lg">
                  Без подсказок!
                </CardTitle>
              </CardHeader>
            </Card>
          )}

          {(clicks_num === FieldTemplate.decode(level.template).tileCoords.length) && (
            <Card className="max-w-40">
              <CardContent className="px-4 py-2">
                <div className="aspect-square rounded-lg bg-gray-500">
                  <img src="/no-clicks.png" />
                </div>
              </CardContent>
              <CardHeader className="px-4 py-2">
                <CardTitle className="text-center text-sm lg:text-lg">
                  Без лишних кликов!
                </CardTitle>
              </CardHeader>
            </Card>
          )}

          {(time_passed !== undefined && time_passed < 60) && (
            <Card className="max-w-40">
              <CardContent className="px-4 py-2">
                <div className="aspect-square rounded-lg bg-gray-500">
                  <img src="/very-fast.png" />
                </div>
              </CardContent>
              <CardHeader className="px-4 py-2">
                <CardTitle className="text-center text-sm lg:text-lg">
                  Очень быстро!
                </CardTitle>
              </CardHeader>
            </Card>
          )}

          {(help_number_used === 0 && clicks_num === FieldTemplate.decode(level.template).tileCoords.length && time_passed !== undefined && time_passed < 60) && (
            <Card className="max-w-40">
              <CardContent className="px-4 py-2">
                <div className="aspect-square rounded-lg bg-gray-500">
                  <img src="/ideal.png" />
                </div>
              </CardContent>
              <CardHeader className="px-4 py-2">
                <CardTitle className="text-center text-sm lg:text-lg">
                  Идеально!
                </CardTitle>
              </CardHeader>
            </Card>
          )}
        </div>

        <Separator className="my-2" />

        <div className="grid grid-cols-3 space-x-2">
          <div className="flex items-center justify-center">#</div>
          <div className="flex items-center justify-center">Баллы</div>
          <div className="flex items-center justify-center">Секунд</div>
        </div>
        <Separator className="my-2" />
        <div className="grid grid-cols-3 gap-2">
          {resultsTable.map((result, i) => (
            <Fragment key={result.user_id}>
              <div className={cn(
                'flex items-center justify-center gap-1 rounded-full p-1',
                me?.id === result.user_id ? 'bg-yellow-500/25' : '',
              )}
              >
                {i + 1 === 1
                  ? '🥇'
                  : i + 1 === 2
                    ? '🥈'
                    : i + 1 === 3
                      ? '🥉'
                      : (
                          i + 1
                        )}
              </div>
              <div className="flex items-center justify-center font-bold">{result.lvlInfo.clicks_num}</div>
              <div className="flex items-center justify-center">{Math.round(result.lvlInfo.time_passed)}</div>
            </Fragment>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        {nextLevel && (
          <Button asChild className="w-full">
            <Link to="/info" search={{ level: nextLevel.id }}>
              Следующий уровень
            </Link>
          </Button>
        )}
        <Button asChild className="w-full" variant="outline">
          <Link to="/">
            В меню
          </Link>
        </Button>
      </CardFooter>
    </div>
  )
}

function getShiftToFieldOrigin(min: Coordinate): {
  offsetX: number
  offsetY: number
} {
  // Original offset from design scaled to actual size.
  const Z_X_MULTIPLIER = ORIGINAL_OFFSET * (TILE_WIDTH / ORIGINAL_TILE_WIDTH)
  const Z_Y_MULTIPLIER = Z_X_MULTIPLIER

  let offsetX = 0
  let offsetY = 0

  const shiftByCells = (x: number, y: number, z: number) => {
    offsetX = x * TILE_WIDTH + z * Z_X_MULTIPLIER
    offsetY = y * TILE_HEIGHT / 2 + z * Z_Y_MULTIPLIER // Tile occupies 2 cells vertically.
  }

  shiftByCells(-min.x, -min.y, min.z)

  return { offsetX, offsetY }
}

function getScaleToFitField(
  fieldMin: Coordinate,
  fieldMax: Coordinate,
  containerWidth: number,
  containerHeight: number,
): {
    scale: number
    fieldWidth: number
    fieldHeight: number
  } {
  // Original offset from design scaled to actual size.
  const Z_X_MULTIPLIER = ORIGINAL_OFFSET * (TILE_WIDTH / ORIGINAL_TILE_WIDTH)
  const Z_Y_MULTIPLIER = Z_X_MULTIPLIER

  // Calculate for x.
  const fieldWidth = (fieldMax.x - fieldMin.x + 1) * TILE_WIDTH + (fieldMax.z - fieldMin.z + 1) * Z_X_MULTIPLIER
  const scaleX = containerWidth / fieldWidth

  // Calculate for y (tile occupies 2 cells).
  const fieldHeight = (fieldMax.y - fieldMin.y + 1) * TILE_HEIGHT / 2 + (fieldMax.z - fieldMin.z + 1) * Z_Y_MULTIPLIER
  const scaleY = containerHeight / fieldHeight

  return {
    scale: Math.min(Math.min(scaleX, scaleY), MAX_SCALE),
    fieldWidth,
    fieldHeight,
  }
}

function compareTiles(a: TileT, b: TileT) {
  if (a.coord.z !== b.coord.z) {
    return a.coord.z - b.coord.z
  }
  if (a.coord.x !== b.coord.x) {
    return a.coord.x - b.coord.x
  }
  return a.coord.y - b.coord.y
}
