import { getLevelById } from '@/components/mahjong/levels.ts'
import { Button } from '@/components/ui/button.tsx'

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog.tsx'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/info')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      level: (search.level as string | undefined) ?? undefined,
    }
  },
})

function RouteComponent() {
  const { level: levelId } = Route.useSearch()
  const navigate = useNavigate()

  const level = getLevelById(levelId)

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Dialog open onOpenChange={() => navigate({ to: '/play', search: { level: levelId } })}>
        <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-[425px] lg:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{level?.description}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 text-muted-foreground">
            <p>{level?.story}</p>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button">Продолжить</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
