const UNAUTHENTICATED_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
]

const GUEST_ONLY_ROUTES = ['/login', '/register']

type UnauthenticatedRoute = typeof UNAUTHENTICATED_ROUTES[number]

function isUnauthenticatedRoute(path: string): path is UnauthenticatedRoute {
  return UNAUTHENTICATED_ROUTES.includes(path)
}

export default defineNuxtRouteMiddleware(async (to, _from) => {
  const requestFetch = useRequestFetch()
  const isGuestOnlyRoute = GUEST_ONLY_ROUTES.includes(to.path)

  if (isUnauthenticatedRoute(to.path) && !isGuestOnlyRoute) {
    return
  }

  try {
    await requestFetch('/api/auth/validate')
  }
  catch {
    if (!isGuestOnlyRoute) {
      return navigateTo('/login')
    }
    return
  }

  if (isGuestOnlyRoute) {
    return navigateTo('/')
  }
})
