import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: '/omoss',
                destination: '/about',
            },
            {
                source: '/om',
                destination: '/about'
            },
            {
                source: '/arrangementer',
                destination: '/events'
            },
            {
                source: '/arrangement/:id',
                destination: '/events/:id'
            },
            {
                source: '/arrangementer/:id',
                destination: '/events/:id'
            },
            {
                source: '/karriere',
                destination: '/career'
            },
            {
                source: '/karriere/:id',
                destination: '/career/:id'
            },
            {
                source: '/bedrift',
                destination: '/companies'
            },
            {
                source: '/bedrifter',
                destination: '/companies'
            },
            {
                source: '/fond',
                destination: '/fund'
            },
            {
                source: '/fondet',
                destination: '/fund'
            },
            {
                source: '/rekruttering',
                destination: '/recruitment'
            },
            {
                source: '/spotify',
                destination: '/music'
            },
            {
                source: '/musikk',
                destination: '/music'
            },
            {
                source: '/wrapped',
                destination: '/music'
            },
        ]
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 's3.login.no',
                port: '',
                pathname: '/beehive/**',
                search: '',
            },
            {
                protocol: 'https',
                hostname: 'i.scdn.co',
                port: '',
                pathname: '/image/**',
                search: '',
            },
            {
                protocol: 'https',
                hostname: 'cdn.discordapp.com',
                port: '',
                pathname: '/avatars/**',
            }
        ],
        qualities: [25, 50, 75],
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                ],
            },
            {
                source: '/sw.js',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'application/javascript; charset=utf-8',
                    },
                    {
                        key: 'Cache-Control',
                        value: 'no-cache, no-store, must-revalidate',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: 'default-src \'self\'; script-src \'self\'',
                    },
                ],
            },
        ]
    },
    output: 'standalone'
}

export default nextConfig
