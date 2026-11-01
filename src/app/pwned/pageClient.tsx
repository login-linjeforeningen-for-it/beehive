'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import config from '@config'
import no from '@text/pwned/no.json'
import en from '@text/pwned/en.json'
import { useDarkMode } from 'uibee/hooks'
import { VolumeX } from 'lucide-react'
import clsx from '@utils/clsx'

type PageClientProps = {
    pwnedNumber: number
    lang: Lang
}

type MemeProps = {
    text: string
    sound: string
    pwned: ({ text: string, image: string })[]
}

export default function PageClient({pwnedNumber, lang}: PageClientProps){
    const [time, setTime] = useState<number>(1)
    const [activated, setActivated] = useState(true)
    const isDark = useDarkMode()
    const memes = (lang === 'no' ? no : en) as MemeProps
    const seconds = time === 1
        ? lang === 'no'
            ? 'sekund'
            : 'second'
        : lang === 'no'
            ? 'sekunder'
            : 'seconds'

    useEffect(() => {
        const startTime = Date.now()
        const interval = setInterval(() => {
            const difference = Math.floor((Date.now() - startTime) / 1000)
            setTime(difference)
        }, 1000)

        // Browsers block audio until the user has interacted with the page
        setActivated(navigator.userActivation?.hasBeenActive ?? false)
        const activate = () => setActivated(true)
        window.addEventListener('pointerdown', activate, { once: true })
        window.addEventListener('keydown', activate, { once: true })

        const audio = new Audio('/assets/audio/pwned.mp3')
        const play = () => audio.play().catch(() => {})
        let audioInterval: ReturnType<typeof setInterval>
        const audioTimeout = setTimeout(() => {
            play()
            audioInterval = setInterval(play, 5 * 60 * 1000)
        }, 60 * 1000)

        return () => {
            clearInterval(interval)
            clearTimeout(audioTimeout)
            clearInterval(audioInterval)
            window.removeEventListener('pointerdown', activate)
            window.removeEventListener('keydown', activate)
        }
    }, [])

    const meme = memes.pwned[pwnedNumber] || memes.pwned[0] || { text: 'Pwned!', image: '' }

    return (
        <div className='h-full min-h-0 w-full overflow-hidden grid grid-rows-[auto,1fr,auto,auto] justify-items-center items-center'>
            <h1 className='text-xl font-semibold px-8 max-w-240 text-center'>
                {meme.text}
            </h1>
            <div className='relative max-h-100 m-8'>
                <Image
                    src={`${config.url.cdn}/img/pwned/${meme.image}`}
                    className='object-contain w-auto h-100'
                    alt='meme'
                    width={400}
                    height={400}
                />
            </div>
            <div className='flex gap-2 items-center px-8'>
                <p className='text-xl flex text-center'>
                    {memes.text.replace('{time}', `${String(time)} ${seconds}`)}
                </p>
                <Image
                    src={`${config.url.cdn}/img/login_shitty_thicc${isDark ? '_white' : ''}.png`}
                    className='object-contain w-6 h-6'
                    alt='meme'
                    width={40}
                    height={40}
                />
            </div>
            <div
                aria-hidden={activated}
                className={clsx(
                    'mt-4 mb-6 flex items-center gap-3 rounded-full',
                    'pl-3 pr-5 py-2 border border-(--color-border-default) bg-(--color-bg-topbar-fallback)',
                    'supports-[backdrop-filter:blur(0px)]:bg-(--color-bg-topbar) supports-[backdrop-filter:blur(0px)]:backdrop-blur-[20px]',
                    'shadow-lg transition-all duration-500 pointer-events-none',
                    activated ? 'opacity-0 translate-y-2' : 'opacity-100'
                )}
            >
                <span className='relative flex h-8 w-8 items-center justify-center'>
                    <span className='absolute inset-0 rounded-full bg-login-orange/30 animate-ping' />
                    <span className='relative flex h-8 w-8 items-center justify-center rounded-full bg-login-orange/15'>
                        <VolumeX className='h-4 w-4 text-login-orange' />
                    </span>
                </span>
                <span className='text-sm font-medium whitespace-nowrap text-(--color-text-regular)'>
                    {memes.sound}
                </span>
            </div>
        </div>
    )
}
