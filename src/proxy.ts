import { NextRequest, NextResponse } from 'next/server'
import { normalizeLang } from '@utils/lang'

export async function proxy(req: NextRequest) {
    const isAiRoute = req.nextUrl.pathname.startsWith('/ai') || req.nextUrl.pathname.startsWith('/api/ai')
    const theme = req.cookies.get('theme')?.value || 'dark'
    const rawLang = req.cookies.get('lang')?.value
    const lang = normalizeLang(rawLang)
    const aiSessionId = req.cookies.get('ai_session_id')?.value
    const pwned = Math.floor(Math.random() * 23)
    const res = NextResponse.next()
    if (rawLang !== lang) {
        res.cookies.set('lang', lang, { path: '/', sameSite: 'lax' })
    }
    if (!aiSessionId) {
        res.cookies.set('ai_session_id', crypto.randomUUID(), {
            path: '/',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 365,
        })
    }
    res.headers.set('x-theme', theme)
    res.headers.set('x-lang', lang)
    res.headers.set('x-pwned', pwned.toString())
    res.headers.set('x-current-path', req.nextUrl.pathname)
    if (isAiRoute) {
        res.headers.set('Cache-Control', 'private, no-store, no-cache, max-age=0, must-revalidate')
    }
    return res
}
