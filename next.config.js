/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
          remotePatterns: [
            {
                      protocol: 'https',
                      hostname: '*.supabase.co',
            },
            {
                      protocol: 'https',
                      hostname: '*.supabase.in',
            },
            {
                      protocol: 'https',
                      hostname: 'images.pexels.com',
            },
            {
                      protocol: 'https',
                      hostname: '*.pexels.com',
            },
                ],
    },
}

module.exports = nextConfig
