import { levels } from '@/components/mahjong/levels.ts'
import { Mahjong } from '@/components/mahjong/Mahjong'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/test')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <Mahjong level={levels[0]} />
    </div>
  )
}
