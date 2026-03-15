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
            // Apenas liberar iframes do YouTube — sem restringir outros recursos
            key: "Content-Security-Policy",
            value: "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://maps.google.com https://www.google.com;",
          },
        ],
      },
    ]
  },
}

export default nextConfig