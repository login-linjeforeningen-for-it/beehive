import { cookies } from 'next/headers'
import HeroSection from '@components/herosection/heroSection'
import EventsPreview from '@components/event/preview'
import JobadsPreview from '@components/jobad/preview'
import SmallInfo from '@components/smallInfo'
import MusicPreview from '@components/music/preview/preview'
import Announcement from '@components/announcement/announcement'
import { normalizeLang } from '@utils/lang'

export default async function Home() {
    const lang = normalizeLang((await cookies()).get('lang')?.value)

    return (
        <>
            <HeroSection lang={lang} />
            <Announcement lang={lang} />
            <EventsPreview lang={lang} />
            <JobadsPreview lang={lang} />
            <MusicPreview lang={lang} />
            <SmallInfo lang={lang} />
        </>
    )
}
