/** @type {import('next').NextConfig} */

const securityHeaders = [
  // Prevent clickjacking
  { key: 'X-Frame-Options',         value: 'SAMEORIGIN' },
  // Prevent MIME type sniffing
  { key: 'X-Content-Type-Options',  value: 'nosniff' },
  // Referrer policy
  { key: 'Referrer-Policy',         value: 'strict-origin-when-cross-origin' },
  // Permissions policy — disable unused browser features
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=()',
  },
  // XSS protection for older browsers
  { key: 'X-XSS-Protection',        value: '1; mode=block' },
  // DNS prefetch control
  { key: 'X-DNS-Prefetch-Control',  value: 'on' },
  // HSTS — only enable on production with HTTPS
  ...(process.env.NODE_ENV === 'production'
    ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }]
    : []),
]

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },

  // Strict mode catches potential issues early
  reactStrictMode: true,

  // Disable powered-by header
  poweredByHeader: false,
}

export default nextConfig
