import type { LevelInfo } from '@/components/mahjong/levels.ts'
import { $api } from '@/api'
import { FieldTemplate } from '@/components/mahjong/field-template.ts'
import { levels } from '@/components/mahjong/levels.ts'
import { Button } from '@/components/ui/button.tsx'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx'
import { pluralize } from '@/lib/utils.ts'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo } from 'react'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="flex min-h-full bg-black pb-8">
      <video className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-cover blur-0" autoPlay muted loop playsInline>
        <source src="https://atom.auto/assets/videos/main-background.mp4" type="video/mp4" />
      </video>
      <div className="relative">
        <div className="mt-8 flex justify-center">
          <img src="/favicon.png" className="w-48" />
        </div>
        <h1 className="mb-8 mt-6 text-center text-3xl font-bold lg:text-4xl">
          АВТОМАДЖИК
        </h1>
        <div className="mb-8 mt-6 px-4 text-center text-lg text-muted-foreground lg:text-xl">
          Сыграйте в увлекательную игру и ближе познакомьтесь с ведущими автомобильными компаниями мира
        </div>
        <div className="flex flex-row flex-wrap justify-center gap-8">
          {levels.map(level => (
            <LevelCard key={level.id} level={level} />
          ))}
        </div>
      </div>
    </main>
  )
}

function LevelCard({ level }: { level: LevelInfo }) {
  const diceCount = useMemo(() => {
    const decoded = FieldTemplate.decode(level.template)
    return decoded.tileCoords.length
  }, [level])

  const { data: results } = $api.useQuery('get', '/users/result')

  const isUnlocked = !level.requiredLevel || results?.some(result => result.level_name === level.requiredLevel || result.level_name === level.id)

  return (
    <Card className="flex max-w-[min(300px,100%-24px)] flex-col bg-black bg-opacity-40 backdrop-blur-md transition-all hover:border-[#00D0C5]">
      <CardHeader className="grow">
        <CardTitle>{level.title}</CardTitle>
        <CardDescription>
          {diceCount}
          {' '}
          {pluralize(diceCount, 'кость', 'кости', 'костей')}
          ,
          {' '}
          {level.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-[rgba(255,255,255,0.075)] bg-[#191919] p-2 shadow-inner">
          <img
            src={`/preview/${level.id}.png`}
            className="size-full rounded-xl object-contain object-center"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button asChild disabled={!isUnlocked} variant={isUnlocked ? 'default' : 'secondary'}>
          <Link to="/info" search={{ level: level.id }} className="w-full">
            {isUnlocked ? 'Играть' : 'Заблокировано'}
          </Link>
        </Button>
        {isUnlocked && (
          <Button asChild disabled={!isUnlocked} size="icon" className="shrink-0" variant="outline">
            <Link to="/rating" search={{ level: level.id }}>
              <span className="iconify ph--chart-bar-bold" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
