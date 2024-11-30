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
    <main className="flex min-h-full bg-black">
      <video className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-cover blur-0" autoPlay muted loop playsInline>
        <source src="https://atom.auto/assets/videos/main-background.mp4" type="video/mp4" />
      </video>
      <div className="relative">
        <h1 className="mb-8 mt-6 text-center text-4xl font-bold">
          АВТОМАДЖИК
        </h1>
        <div className="mb-8 mt-6 px-4 text-center text-xl font-semibold">
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
    <Card className="bg-black bg-opacity-40 backdrop-blur-md transition-all hover:border-[#00D0C5]">
      <CardHeader>
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
        <div className="aspect-video min-w-[300px] rounded-xl bg-[#191919]">
          <img
            src={`/preview/${level.id}.png`}
            className="aspect-video max-w-[300px] rounded-xl object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild disabled={!isUnlocked} variant={isUnlocked ? 'default' : 'secondary'}>
          <Link to="/info" search={{ level: level.id }} className="w-full">
            {isUnlocked ? 'Играть' : 'Заблокировано'}
          </Link>
        </Button>
        {isUnlocked && (
          <Button asChild disabled={!isUnlocked} size="icon" variant="ghost">
            <Link to="/rating" search={{ level: level.id }}>
              <span className="iconify ph--chart-bar-bold" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
