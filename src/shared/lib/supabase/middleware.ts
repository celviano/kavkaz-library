import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/profile',
  '/favorites',
  '/add-book',
]

// Routes only for guests (redirect to / if already logged in)
const GUEST_ONLY_ROUTES = [
  '/auth/login',
  '/auth/sign-up',
  '/auth/forgot-password',
]

function isProtected(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(route + '/'))
}

function isGuestOnly(pathname: string): boolean {
  return GUEST_ONLY_ROUTES.some((route) => pathname.startsWith(route))
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // Not logged in → trying to access protected route
  if (!user && isProtected(pathname)) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/auth/login'
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Already logged in → trying to access guest-only route
  if (user && isGuestOnly(pathname)) {
    const next = request.nextUrl.searchParams.get('next') ?? '/'
    const homeUrl = request.nextUrl.clone()
    homeUrl.pathname = next.startsWith('/') ? next : '/'
    homeUrl.search = ''
    return NextResponse.redirect(homeUrl)
  }

  return supabaseResponse
}
