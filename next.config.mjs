/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      { source: '/blog', headers: [{ key: 'Content-Language', value: 'bn' }] },
      { source: '/blog/:path*', headers: [{ key: 'Content-Language', value: 'bn' }] },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://tagmanager.google.com https://www.google-analytics.com https://va.vercel-scripts.com https://connect.facebook.net https://cdn.jsdelivr.net/npm/meta-capi-param-builder-clientjs/ https://unpkg.com/meta-capi-param-builder-clientjs/; connect-src 'self' https://connect.facebook.net https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://www.googletagmanager.com https://www.google.com https://*.google.com https://*.g.doubleclick.net https://wa.me https://*.wa.me https://www.facebook.com https://*.facebook.com; img-src 'self' data: https: https://www.googletagmanager.com https://www.facebook.com https://*.facebook.com; style-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://tagmanager.google.com https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; frame-src 'self' https://www.googletagmanager.com https://wa.me https://*.wa.me https://www.facebook.com;" },
        ],
      },
      {
        source: '/ship/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=604800' }],
      },
      {
        source: '/:file(Logo|og_image|saint-martin-hero|placeholder|icon).:ext(jpg|jpeg|png|svg|webp)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=604800' }],
      },
      {
        source: '/:file(llms|llms-full|ai|robots).:ext(txt)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=3600' }],
      },
    ]
  },
  async redirects() {
    return [{
      source: '/:path*',
      has: [{ type: 'host', value: 'shiptickets.bd' }],
      destination: 'https://www.shiptickets.bd/:path*',
      permanent: true,
    }]
  },
  typescript: {
    // ignoreBuildErrors: true, // Removed — enables strict type checking
  },
  images: {
    unoptimized: false,
    formats: ['image/webp'],
    deviceSizes: [640, 768, 1024, 1280, 1536, 1920],
    minimumCacheTTL: 2592000,
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}

export default nextConfig
