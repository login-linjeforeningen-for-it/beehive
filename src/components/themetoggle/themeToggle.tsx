'use client'

import { useEffect, useState } from 'react'
import { getCookie, setCookie } from 'utilbee/utils'
import { useRouter } from 'next/navigation'
import clsx from '@utils/clsx'

export default function ThemeSwitch() {
    const router = useRouter()
    const [theme, setTheme] = useState<'dark' | 'light'>('dark')

    useEffect(() => {
        const savedTheme = getCookie('theme') as 'dark' | 'light'
        if (savedTheme) {
            setTheme(savedTheme)
        }

        document.documentElement.classList.remove('dark', 'light')
        document.documentElement.classList.add(theme)
    }, [theme])

    function toggleTheme() {
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        setCookie('theme', newTheme)
        setTheme(newTheme)
        router.refresh()
    }

    return (
        <div className='grid place-items-center justify-end rounded-(--border-radius) hover:bg-[#6464641a]'>
            <label className='cursor-pointer'>
                <input
                    type='checkbox'
                    checked={theme === 'light'}
                    onChange={toggleTheme}
                    className='sr-only'
                />
                <ThemeIcon />
            </label>
        </div>
    )
}

function ThemeIcon() {
    const rayClassName = 'transition-all duration-400 in-[.light]:opacity-0 in-[.dark]:opacity-100'

    return (
        <svg
            className='h-12 p-[0.8rem] fill-white in-[.light]:fill-black'
            viewBox='0 0 100 100'
            xmlns='http://www.w3.org/2000/svg'
        >
            <mask id='theme-toggle_clip-path'>
                <rect x='0' y='0' width='100' height='100' fill='white' />
                <circle
                    className='transition-all duration-400 in-[.dark]:translate-x-8 in-[.dark]:-translate-y-4'
                    cx='68'
                    cy='40'
                    r='18'
                />
            </mask>
            <circle
                className={clsx(
                    'origin-center transition-all duration-400',
                    'in-[.light]:scale-[1.9] in-[.light]:fill-black',
                    'in-[.dark]:scale-100 in-[.dark]:fill-white',
                    'in-[.topbar--open]:fill-white'
                )}
                mask={'url(#theme-toggle_clip-path)'}
                cx='50'
                cy='50'
                r='23'
            />
            <rect
                className={rayClassName}
                x='86'
                y='47'
                width='14'
                height='6'
            />
            <rect className={rayClassName} y='47' width='14' height='6' />
            <rect
                className={rayClassName}
                x='47'
                y='86'
                width='6'
                height='14'
            />
            <path
                className={rayClassName}
                d='M75 78.2426L79.2426 74L89.1421 83.8995L84.8995 88.1421L75 78.2426Z'
            />
            <rect
                className={rayClassName}
                x='84.8995'
                y='12'
                width='6'
                height='14'
                transform='rotate(45 84.8995 12)'
            />
            <rect
                className={rayClassName}
                x='22.8995'
                y='74'
                width='6'
                height='14'
                transform='rotate(45 22.8995 74)'
            />
            <rect
                className={rayClassName}
                x='13'
                y='16.2426'
                width='6'
                height='14'
                transform='rotate(-45 13 16.2426)'
            />
            <path className={rayClassName} d='M47 0H53V14H47V0Z' />
        </svg>
    )
}
