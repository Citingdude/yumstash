const UNAUTHENTICATED_ROUTES = [
  '/login',
  '/register',
] as const

type UnauthenticatedRoute = typeof UNAUTHENTICATED_ROUTES[number]

function isUnauthenticatedRoute(path: string): path is UnauthenticatedRoute {
  return (UNAUTHENTICATED_ROUTES as readonly string[]).includes(path)
}

export default defineNuxtRouteMiddleware(async (to, _from) => {
  const requestFetch = useRequestFetch()
  if (isUnauthenticatedRoute(to.path)) {
    return
  }

  try {
    await requestFetch('/api/auth/validate')
  }
  catch {
    return navigateTo('/login')
  }
})
