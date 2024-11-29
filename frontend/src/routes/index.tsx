import { Button } from '@/components/ui/button.tsx'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="min-h-screen bg-black">
      <video className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-cover blur-0" autoPlay muted loop playsInline>
        <source src="https://atom.auto/assets/videos/main-background.mp4" type="video/mp4" />
      </video>
      <div className="relative">
        <h1 className="mb-8 mt-6 text-center text-4xl font-bold">
          Маджонг
        </h1>
        <div className=" mb-8 mt-6 text-center text-xl font-semibold">
          Сыграйте в увлекательную игру и ближе познакомьтесь с ведущими автомобильными компаниями мира
        </div>
        <div className="flex flex-row flex-wrap justify-center gap-8">
          <LevelCard title="Уровень 1" isUnlocked />
          <LevelCard title="Уровень 2" isUnlocked />
          <LevelCard title="Уровень 3" isUnlocked={false} />
          <LevelCard title="Уровень 4" isUnlocked={false} />
          <LevelCard title="Уровень 5" isUnlocked={false} />
          <LevelCard title="Уровень 6" isUnlocked={false} />
          <LevelCard title="Уровень 7" isUnlocked={false} />
          <LevelCard title="Уровень 8" isUnlocked={false} />
          <LevelCard title="Уровень 9" isUnlocked={false} />
        </div>
      </div>
    </main>
  )
}

function LevelCard({ title, isUnlocked }: { title: string, isUnlocked: boolean }) {
  return (
    <Card className="bg-black bg-opacity-40 backdrop-blur-md transition-all hover:border-emerald-500">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>72 кости, Российский автопром</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video min-w-[300px] rounded-xl bg-gray-900"></div>
      </CardContent>
      <CardFooter>
        <Button asChild disabled={!isUnlocked} variant={isUnlocked ? 'default' : 'secondary'}>
          <Link to="/test" className="w-full">
            {isUnlocked ? 'Играть' : 'Заблокировано'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
