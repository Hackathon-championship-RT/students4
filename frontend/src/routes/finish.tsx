import { $api } from '@/api'
import { useMe } from '@/api/me.ts'
import { FieldTemplate } from '@/components/mahjong/field-template.ts'
import { getLevelById, levels } from '@/components/mahjong/levels.ts'
import { Button } from '@/components/ui/button.tsx'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx'
import { Separator } from '@/components/ui/separator'
import { cn, pluralize } from '@/lib/utils.ts'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Fragment, useEffect, useRef } from 'react'

export const Route = createFileRoute('/finish')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      level: (search.level as string | undefined) ?? undefined,
      time_passed: (search.time_passed as number | undefined) ?? undefined,
      help_number_used: (search.help_number_used as number | undefined) ?? undefined,
      clicks_num: (search.clicks_num as number | undefined) ?? undefined,
      score: (search.score as number | undefined) ?? undefined,
    }
  },
})

function RouteComponent() {
  const { level: levelId, time_passed, help_number_used, clicks_num, score } = Route.useSearch()

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
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Поздравляем!</CardTitle>
          <CardDescription>
            Вы прошли уровень
            {' '}
            «
            {level.title}
            »
          </CardDescription>
        </CardHeader>
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
                  <CardTitle className="text-center text-lg">
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
                  <CardTitle className="text-center text-lg">
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
                  <CardTitle className="text-center text-lg">
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
                  <CardTitle className="text-center text-lg">
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
              <Fragment key={i}>
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
        <CardFooter className="gap-4">
          <Button asChild className="w-full" variant="secondary">
            <Link to="/">
              В меню
            </Link>
          </Button>
          {nextLevel
          && (
            <Button asChild className="w-full">
              <Link to="/info" search={{ level: nextLevel.id }}>
                Следующий уровень
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
