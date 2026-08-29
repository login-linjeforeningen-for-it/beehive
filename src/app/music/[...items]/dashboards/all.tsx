'use client'

import useSWR from 'swr'
import { getCookie, removeCookie } from 'utilbee/utils'
import { useEffect } from 'react'
import TileInfo from '@components/music/tileInfo'
import no from '@text/music/no.json'
import en from '@text/music/en.json'
import TileMap from '@components/music/tileMap'
import { Users } from '@components/music/users'

async function fetcher(url: string) {
    const response = await fetch(url)
    const data = await response.json()
    return data
}

export default function MusicDashboardAll({ initialData, lang }: { initialData: Music, lang: Lang }) {
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
        <div className={'grid place-items-center min-h-full h-full py-6 px-8 gap-4'}>
            <TileInfo data={data} text={text} lang={lang} />
            <div className='grid grid-cols-2 gap-4 w-full'>
                <TileMap
                    text={text.mostx.most_liked_albums}
                    items={data.mostLikedAlbums}
                    getImageHash={a => a.image}
                    getTitle={a => a.album}
                    getFirstLine={a => a.artist}
                    getCountWithIcons={a => ({
                        likeRatio: Math.round(a.like_ratio * 100),
                        totalListens: a.total_listens,
                        totalSkips: a.total_skips
                    })}
                    dropdown={false}
                    open={true}
                    extraPadding={true}
                />

                <TileMap
                    text={text.mostx.most_liked_artists}
                    items={data.mostLikedArtists}
                    getImageHash={a => a.image}
                    getTitle={a => a.artist}
                    getFirstLine={a => a.artist}
                    getCountWithIcons={a => ({
                        likeRatio: Math.round(a.like_ratio * 100),
                        totalListens: a.total_listens,
                        totalSkips: a.total_skips
                    })}
                    dropdown={false}
                    open={true}
                    extraPadding={true}
                />

                <TileMap
                    text={text.mostx.most_liked_songs}
                    items={data.mostLikedSongs}
                    getImageHash={a => a.image}
                    getTitle={a => a.song}
                    getFirstLine={a => a.artist}
                    getCountWithIcons={a => ({
                        likeRatio: Math.round(a.like_ratio * 100),
                        totalListens: a.listens,
                        totalSkips: a.skips
                    })}
                    dropdown={false}
                    open={true}
                    extraPadding={true}
                />

                <Users
                    text={text.users}
                    mostActiveUsers={data.mostActiveUsers}
                    mostSkippingUsers={data.mostSkippingUsers}
                    currentlyListening={data.currentlyListening}
                    dropdown={false}
                    open={true}
                    extraPadding={true}
                    only='listens'
                />
            </div>
        </div>
    )
}
