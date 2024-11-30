import { $api } from '@/api'
import { useMe } from '@/api/me.ts'
import { getLevelById } from '@/components/mahjong/levels.ts'
import { Button } from '@/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils.ts'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Fragment } from 'react'

export const Route = createFileRoute('/rating')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      level: (search.level as string | undefined) ?? undefined,
    }
  },
})

function RouteComponent() {
  const {
    level: levelId,
  } = Route.useSearch()

  const level = getLevelById(levelId)

  const me = useMe()
  const { data: levelResults } = $api.useQuery(
    'get',
    '/users/result/{level_name}',
    {
      params: { path: { level_name: levelId ?? '' } },
    },
  )

  if (!level) {
    return <div>Invalid level id</div>
  }

  const resultsTable = [...(levelResults ?? [])].sort((a, b) => {
    if (b.lvlInfo.clicks_num - a.lvlInfo.clicks_num !== 0)
      return b.lvlInfo.clicks_num - a.lvlInfo.clicks_num
    return a.lvlInfo.time_passed - b.lvlInfo.time_passed
  })

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Просмотр рейтинга</CardTitle>
          <CardDescription>
            Таблица для уровня «
            {level.title}
            »
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 space-x-2">
            <div className="flex items-center justify-center">#</div>
            <div className="flex items-center justify-center">Баллы</div>
            <div className="flex items-center justify-center">Секунд</div>
          </div>
          <Separator className="my-2" />
          <div className="grid grid-cols-3 gap-2">
            {resultsTable.map((result, i) => (
              <Fragment key={i}>
                <div className="flex items-center justify-center gap-1">
                  {me?.id === result.user_id ? '👤' : null}
                  {i + 1 === 1
                    ? '🥇'
                    : i + 1 === 2
                      ? '🥈'
                      : i + 1 === 3
                        ? '🥉'
                        : null}
                  <div
                    className={cn(
                      'flex size-8 items-center justify-center rounded-full border p-1',
                      i + 1 === 1
                        ? 'border-yellow-400'
                        : i + 1 === 2
                          ? 'border-gray-400'
                          : i + 1 === 3
                            ? 'border-yellow-700'
                            : 'border-gray-200',
                    )}
                  >
                    {i + 1}
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  {result.lvlInfo.clicks_num}
                </div>
                <div className="flex items-center justify-center">
                  {result.lvlInfo.time_passed}
                </div>
              </Fragment>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link to="/">В меню</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
