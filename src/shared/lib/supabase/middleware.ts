import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED_ROUTES = [
  '/profile',
  '/favorites',
  '/add-book',
  '/dashboard',
  '/organization',
]

const GUEST_ONLY_ROUTES = [
  '/auth/login',
  '/auth/sign-up',
  '/auth/forgot-password',
]

function isProtected(pathname: string): boolean {
  return PROTECTED_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'))
}

function isGuestOnly(pathname: string): boolean {
  return GUEST_ONLY_ROUTES.some((r) => pathname.startsWith(r))
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
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

  if (!user && isProtected(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  if (user && isGuestOnly(pathname)) {
    const next = request.nextUrl.searchParams.get('next') ?? '/'
    const url  = request.nextUrl.clone()
    url.pathname = next.startsWith('/') ? next : '/'
    url.search   = ''
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
