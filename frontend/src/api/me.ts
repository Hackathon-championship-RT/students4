import { $api } from '@/api/index.ts'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

export function useMe() {
  const queryClient = useQueryClient()
  const { mutate: register } = $api.useMutation('post', '/users/register', {
    onSettled: () => {
      queryClient.resetQueries()
    },
  })

  const { data: me, isPending } = $api.useQuery(
    'get',
    '/users/me',
    {},
    {
      refetchInterval: 1000 * 60 * 5, // 5 minutes
    },
  )

  useEffect(() => {
    if (!isPending && !me) {
      register({
        params: { query: {
          login: Math.random().toString(36).substring(7),
          password: Math.random().toString(36).substring(7),
        } },
      })
    }
  }, [isPending, me, register])

  return me
}
