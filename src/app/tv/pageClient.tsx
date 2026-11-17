'use client'

import useSWR from 'swr'
import { useEffect, useState } from 'react'
import CurrentlyPlaying from '@components/music/currentlyListening'

const RELOAD_MS = 10 * 60 * 1000

async function fetcher(url: string) {
    const response = await fetch(url)
    return response.json()
}

export function Clock({ lang }: { lang: Lang }) {
    const [now, setNow] = useState<Date | null>(null)
    const locale = lang === 'no' ? 'nb-NO' : 'en-GB'

    useEffect(() => {
        setNow(new Date())
        const tick = setInterval(() => setNow(new Date()), 1000)
        const reload = setInterval(async () => {
            const healthy = await fetch('/api/health', { cache: 'no-store' }).then(response => response.ok, () => false)
            if (healthy) window.location.reload()
        }, RELOAD_MS)
        return () => {
            clearInterval(tick)
            clearInterval(reload)
        }
    }, [])

    return (
        <div className='text-center'>
            <p className='text-8xl font-semibold tabular-nums'>
                {now?.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }) ?? '--:--'}
            </p>
            <p className='text-2xl capitalize text-(--color-text-regular)'>
                {now?.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
        </div>
    )
}

export function Music({ initialData, lang }: { initialData: Music, lang: Lang }) {
    const { data } = useSWR<Music>('/api/music', fetcher, {
        refreshInterval: 5000,
        fallbackData: initialData,
    })

    return (
        <div className='min-h-0 flex-1 overflow-hidden [&>div]:h-full'>
            <CurrentlyPlaying expanded={true} songs={data?.currentlyListening ?? []} lang={lang} />
        </div>
    )
}
