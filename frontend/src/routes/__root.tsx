import { useMe } from '@/api/me.ts'
import {
  createRootRoute,
  Outlet,
} from '@tanstack/react-router'

export const Route = createRootRoute({
  component: function RouteComponent() {
    useMe() // Auto register

    return (
      <div className="flex flex-col">
        <Outlet />
      </div>
    )
  },
})
