import { getLevelById } from '@/components/mahjong/levels.ts'
import { Mahjong } from '@/components/mahjong/Mahjong'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/play')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      level: (search.level as string | undefined) || undefined,
    }
  },
})

function RouteComponent() {
  const { level: levelId } = Route.useSearch()

  const level = getLevelById(levelId)

  if (!level) {
    return <div>Invalid level id</div>
  }

  return (<Mahjong level={level} />)
}
