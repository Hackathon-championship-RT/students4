import { $api } from '@/api'
import { getLevelById } from '@/components/mahjong/levels.ts'
import { Button } from '@/components/ui/button.tsx'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx'
import { pluralize } from '@/lib/utils.ts'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

export const Route = createFileRoute('/finish')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      level: (search.level as string | undefined) || undefined,
      time_passed: (search.time_passed as number | undefined) || undefined,
      help_number_used: (search.help_number_used as number | undefined) || undefined,
      clicks_num: (search.clicks_num as number | undefined) || undefined,
    }
  },
})

function RouteComponent() {
  const { level: levelId, time_passed, help_number_used, clicks_num } = Route.useSearch()

  const level = getLevelById(levelId)

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
    if (levelId === undefined || time_passed === undefined || clicks_num === undefined || help_number_used === undefined) {
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
        help_number_used,
        clicks_num,
      },
    })
  }, [levelId, time_passed, help_number_used, clicks_num, sendResult])

  if (!level) {
    return <div>Invalid level id</div>
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="max-w-4xl">
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
          <div>
            {JSON.stringify(levelResults)}
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link to="/">
              В меню
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
