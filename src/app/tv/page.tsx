import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { cookies } from 'next/headers'
import EventListItem from '@components/event/eventItem'
import JobadsListItem from '@components/jobad/jobadsListItem'
import Apartment from '@components/svg/symbols/apartment'
import { getEvents, getJobs, getSafeActivity, getWeather } from '@utils/api'
import { Cloud, CloudFog, CloudLightning, CloudMoon, CloudRain, CloudSnow, CloudSun, Moon, Sun } from 'lucide-react'
import { normalizeLang } from '@utils/lang'
import no from '@text/landing/no.json'
import en from '@text/landing/en.json'
import { Clock, Music } from './pageClient'

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
}

function Column({ title, children }: { title: string, children: ReactNode }) {
    return (
        <section className='flex min-h-0 flex-col'>
            <h2 className='py-2 text-2xl font-normal'>{title}</h2>
            <ul className='min-h-0 flex-1 list-none overflow-hidden'>{children}</ul>
        </section>
    )
}

export default async function TV() {
    const lang = normalizeLang((await cookies()).get('lang')?.value)
    const text = lang === 'no' ? no : en
    const [eventsResponse, jobsResponse, music, weather] = await Promise.all([
        getEvents({ orderBy: 'time_start', limit: 8 }),
        getJobs(null, null, null, null, 6, 0),
        getSafeActivity(),
        getWeather(),
    ])
    const now = Date.now()
    const events = typeof eventsResponse === 'string' || !Array.isArray(eventsResponse.events)
        ? []
        : eventsResponse.events.filter(event => new Date(event.time_end).getTime() > now)
    const jobs = typeof jobsResponse === 'string' || !Array.isArray(jobsResponse.jobs) ? [] : jobsResponse.jobs

    const columns = [
        <Column key='events' title={text.eventsPreview.title}>
            {events.map(event => (
                <li key={event.id}><EventListItem event={event} variant='list-item' highlight={event.highlight} /></li>
            ))}
        </Column>,
        <Column key='jobs' title={text.jobadsPreview.title}>
            {jobs.map(job => <li key={job.id} className='mb-2'><JobadsListItem jobad={job} /></li>)}
            {!jobs.length && (
                <li className='grid grid-cols-[auto_1fr] items-center gap-x-8 rounded-(--border-radius) bg-(--color-bg-body) p-4'>
                    <div
                        className={'flex aspect-5/2 h-20 items-center justify-center rounded-(--border-radius) '
                            + 'bg-(--color-border-default) text-3xl font-bold'}
                    >
                        NAV
                    </div>
                    <div>
                        <div className='text-2xl leading-[1.4em]'>
                            {lang === 'no' ? 'Du hadde fått avslag uansett' : 'You would have been rejected anyway'}
                        </div>
                        <ul className='mt-2 flex list-none flex-wrap gap-x-6 gap-y-2 text-[0.95rem] text-(--color-text-regular)'>
                            <li className='flex items-center'>
                                <Apartment className='h-6 w-6 fill-(--color-text-discreet) pr-[0.3rem]' />
                                NAV
                            </li>
                            <li>arbeidsplassen.nav.no</li>
                        </ul>
                    </div>
                </li>
            )}
        </Column>,
        <section key='info' className='flex min-h-0 flex-col gap-8 overflow-hidden'>
            <h1 className='text-center text-5xl font-semibold'>
                <i className='logfont-login pr-3 align-middle' />
                Login Lounge
            </h1>
            <Clock lang={lang} />
            <Weather weather={weather} lang={lang} />
            <Music initialData={music} lang={lang} />
        </section>,
    ]
    // OLED burn-in: rotate the columns one slot per day (UTC) so the static headings and clock move around
    const shift = Math.floor(now / 86_400_000) % columns.length

    return (
        <div className='grid h-full grid-cols-3 grid-rows-[minmax(0,1fr)] gap-8 overflow-hidden p-8'>
            {/* OLED burn-in: drift everything, top bar included. Phase comes from the clock so reloads don't reset it.
                Off-white instead of #fff, and no surface panels, so there are fewer bright static edges. */}
            <style>{`
                html { font-size: min(100vw / 120, 100vh / 67.5) }
                :root {
                    --color-white: var(--color-grey-400);
                    --color-text-regular: var(--color-grey-500);
                    --color-text-discreet: var(--color-grey-600);
                    --color-text-disabled: var(--color-grey-800);
                    --color-bg-surface: var(--color-bg-body);
                }
                body {
                    animation: tv-x 420s steps(16) -${now}ms infinite alternate,
                        tv-y 660s steps(16) -${now}ms infinite alternate;
                }
                @keyframes tv-x { from { translate: -0.5rem } to { translate: 0.5rem } }
                @keyframes tv-y { from { transform: translateY(-0.5rem) } to { transform: translateY(0.5rem) } }
            `}</style>
            {[...columns.slice(shift), ...columns.slice(0, shift)]}
        </div>
    )
}

function WeatherIcon({ symbol, className }: { symbol: string, className: string }) {
    const night = symbol.includes('night')
    const Icon = symbol.includes('thunder') ? CloudLightning
        : symbol.includes('snow') || symbol.includes('sleet') ? CloudSnow
            : symbol.includes('rain') ? CloudRain
                : symbol.includes('fog') ? CloudFog
                    : symbol.includes('cloudy') && !symbol.includes('partly') ? Cloud
                        : symbol.includes('partly') || symbol.includes('fair') ? (night ? CloudMoon : CloudSun)
                            : night ? Moon : Sun
    return <Icon className={className} />
}

function Weather({ weather, lang }: { weather: Weather[], lang: Lang }) {
    if (!weather.length) return null
    const [current, ...later] = weather
    const hour = (time: string) => new Date(time).toLocaleTimeString(lang === 'no' ? 'nb-NO' : 'en-GB', {
        hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Oslo'
    })

    return (
        <div className='flex items-center justify-center gap-8'>
            <div className='flex items-center gap-3'>
                <WeatherIcon symbol={current.symbol} className='size-14' />
                <span className='text-5xl font-semibold'>{Math.round(current.temperature)}°</span>
            </div>
            <ul className='flex list-none gap-5 text-(--color-text-regular)'>
                {later.slice(0, 5).map(entry => (
                    <li key={entry.time} className='flex flex-col items-center gap-1'>
                        <span className='text-sm'>{hour(entry.time)}</span>
                        <WeatherIcon symbol={entry.symbol} className='size-6' />
                        <span>{Math.round(entry.temperature)}°</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
