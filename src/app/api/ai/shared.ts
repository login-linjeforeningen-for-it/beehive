import config from '@config'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function proxyAiRequest(path: string, init?: RequestInit) {
    const cookieStore = await cookies()
    const headers = new Headers(init?.headers)
    const accessToken = cookieStore.get('access_token')?.value
    const sessionId = cookieStore.get('ai_session_id')?.value

    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`)
    }

    if (sessionId) {
        headers.set('x-ai-session-id', sessionId)
    }

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
