import { cookies } from 'next/headers'
import { getSafeActivity } from '@utils/api'
import type { Metadata } from 'next'
import { normalizeLang } from '@utils/lang'

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
}
import MusicDashboardCurrent from './dashboards/current'
import MusicDashboardAll from './dashboards/all'
import MusicDashboardToday from './dashboards/today'

export default async function Music({ params }: { params: Promise<{ items: string[] }> }) {
    const item = (await params).items
    const lang = normalizeLang((await cookies()).get('lang')?.value)
    const data = await getSafeActivity()

    if (item.length === 2 && item[1] === 'today') {
        return <MusicDashboardToday lang={lang} initialData={data} />
    }

    if (item.length === 2 && item[1] === 'all') {
        return <MusicDashboardAll lang={lang} initialData={data} />
    }

    return <MusicDashboardCurrent lang={lang} initialData={data} />
}
