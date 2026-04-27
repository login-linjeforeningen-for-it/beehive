import { cookies } from 'next/headers'
import { getSafeActivity } from '@utils/api'
import type { Metadata } from 'next'
import MusicClient from './pageClient'
import no from '@text/music/no.json'
import en from '@text/music/en.json'
import Dashboards from '@components/music/dashboards'
import { normalizeLang } from '@utils/lang'
import { Comic_Neue } from 'next/font/google'

const comicNeue = Comic_Neue({ subsets: ['latin'], weight: ['400', '700'] })

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
}

export default async function Music() {
    const lang = normalizeLang((await cookies()).get('lang')?.value)
    const data = await getSafeActivity()
    const text = (lang === 'no' ? no : en)

    return (
        <div className='page-container'>
            <div className='page-section--normal space-y-4'>
                <Intro text={text} />
                <MusicClient lang={lang} initialData={data} />
                <Dashboards lang={lang} />
            </div>
        </div>
    )
}

function Intro({ text }: { text: MusicText }) {
    return (
        <>
            <div className='grid grid-cols-2 w-full'>
                <h1 className='heading-1 heading-1--top-left-corner'>{text.title}</h1>
                <h1 className={`${comicNeue.className} text-right text-lg text-(--color-primary) self-center`}>#LoginWrapped</h1>
            </div>
            <section className='page-section--normal'>
                <p className='p-highlighted'>{text.intro}</p>
            </section>
        </>
    )
}
