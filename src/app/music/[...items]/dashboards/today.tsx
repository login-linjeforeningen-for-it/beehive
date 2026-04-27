'use client'

import useSWR from 'swr'
import { getCookie, removeCookie } from 'utilbee/utils'
import { useEffect } from 'react'
import { InnerTopFiveThisX } from '@components/music/topFiveThisX'
import no from '@text/music/no.json'
import en from '@text/music/en.json'
import PlayIcon from '@components/music/playIcon'

async function fetcher(url: string) {
    const response = await fetch(url)
    const data = await response.json()
    return data
}

function CurrentSummary({ text, listeners }: { text: string, listeners: number }) {
    return (
        <div className='bg-(--color-bg-surface) rounded-lg w-full h-full p-4'>
            <div className='flex items-center justify-between'>
                <div className='flex gap-2 w-full font-semibold justify-between'>
                    <PlayIcon />
                    {listeners} {text}
                    <PlayIcon />
                </div>
            </div>
        </div>
    )
}

export default function MusicDashboardToday({ initialData, lang }: { initialData: Music, lang: Lang }) {
    const text = (lang === 'no' ? no : en)
    const { data }: { data: Music } = useSWR('/api/music', fetcher, {
        refreshInterval: 5000,
        fallbackData: initialData,
    })

    useEffect(() => {
        const shouldReload = getCookie('shouldReload')
        if (shouldReload) {
            removeCookie('shouldReload')
            window.location.reload()
        }
    }, [])

    return (
        <div className='grid place-items-center mx-8 py-6 gap-4'>
            <CurrentSummary listeners={data.currentlyListening.length} text={text.active_listeners} />
            <div className='grid grid-cols-2 gap-4'>
                <InnerTopFiveThisX extraPadding={true} open={true} dropdown={false} interval='today' data={data} lang={lang} />
                <InnerTopFiveThisX extraPadding={true} open={true} dropdown={false} interval='yesterday' data={data} lang={lang} />
                <InnerTopFiveThisX extraPadding={true} open={true} dropdown={false} interval='thisWeek' data={data} lang={lang} />
                <InnerTopFiveThisX extraPadding={true} open={true} dropdown={false} interval='lastWeek' data={data} lang={lang} />
            </div>
        </div>
    )
}
