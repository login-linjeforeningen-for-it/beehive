import Card from './card'
import ListeningCard from './listeningCard'
import no from '@text/music/no.json'
import en from '@text/music/en.json'
import { useState } from 'react'

type CurrentlyPlayingProps = {
    songs: CurrentlyListening[]
    lang: Lang
    expanded?: boolean
}

export default function CurrentlyPlaying({ songs, lang, expanded }: CurrentlyPlayingProps) {
    const [open, setOpen] = useState(true)
    const text = (lang === 'no' ? no : en)
    const uniqueSongs = Array.isArray(songs) && songs.length > 0
        ? Array.from(new Map(songs.map(s => [s.id, s])).values())
        : []

    return (
        <Card
            text={text.currently_playing}
            extraPadding={true}
            removePadding={true}
            className='w-full'
            dropdown={!expanded}
            open={open}
            setOpen={setOpen}
            playIcon={true}
        >
            <div className={`grid grid-cols-1 md:grid-cols-2 px-4 pt-2 pb-4 ${expanded && 'pt-4'}
                gap-x-4 gap-y-2 place-items-center w-full [scrollbar-width:none]
                [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
                ${expanded ? 'max-h-[77.64vh] overflow-auto' : 'max-h-[69vh] overflow-auto'}`}
            >
                {uniqueSongs.map((song) => <ListeningCard key={song.id} song={song} />)}
            </div>
        </Card>
    )
}
