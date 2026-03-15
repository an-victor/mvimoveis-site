/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' blob: data: https://cdn.sanity.io https://i.ytimg.com https://img.youtube.com",
              "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com",
              "connect-src 'self' https://cdn.sanity.io wss:",
              "media-src 'self' blob: https://www.youtube.com",
            ].join("; "),
          },
        ],
      },
    ]
  },
}

export default nextConfig