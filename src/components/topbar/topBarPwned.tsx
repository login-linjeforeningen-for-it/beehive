'use client'

import LangToggle from '@components/langtoggle/langToggle'
import ThemeToggle from '../themetoggle/themeToggle'
import config from '@config'
import Image from 'next/image'
import Link from 'next/link'

type TopBarProps = {
    lang: Lang
    theme: string
}

export default function TopBar({lang, theme}: TopBarProps) {
    return (
        <div
            className={'flex max-w-[calc(var(--w-page)+2rem)] w-full m-auto p-2 '
                + 'h-(--h-topbar) transition duration-500 800px:justify-between 800px:p-4'}
        >
            <div className='flex items-center h-12 p-[0.2rem] 800px:p-0'>
                <Link href='/' onClick={(e) => { e.preventDefault(); window.location.href = '/' }}>
                    <Image
                        src={`${config.url.cdn}/img/login_shitty_thicc${theme ? '_white' : ''}.png`}
                        className='object-cover'
                        alt='ticc login logo'
                        width={48}
                        height={48}
                    />
                </Link>
            </div>
            <nav className='flex w-full justify-end h-12 800px:w-fit mr-0'>
                <ThemeToggle />
                <LangToggle serverLang={lang} />
            </nav>
        </div>
    )
}
