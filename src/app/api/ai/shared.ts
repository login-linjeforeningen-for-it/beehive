import config from '@config'
import { NextResponse } from 'next/server'

export async function proxyAiRequest(path: string, init?: RequestInit) {
    const headers = new Headers(init?.headers)
    if (!init?.body) {
        headers.delete('Content-Type')
    } else if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json')
    }

    const response = await fetch(`${config.url.beekeeper}${path}`, {
        ...init,
        headers,
        cache: 'no-store',
    })

    return new NextResponse(await response.text(), {
        status: response.status,
        headers: {
            'Content-Type': response.headers.get('content-type') || 'application/json',
        },
    })
}
