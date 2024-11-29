import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main>
      <h1 className="mt-6 text-center text-xl font-bold text-green-500">Hi</h1>
    </main>
  )
}
