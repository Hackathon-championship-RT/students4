import { Mahjong } from '@/components/mahjong/Mahjong'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/test')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Mahjong />
    </div>
  )
}
