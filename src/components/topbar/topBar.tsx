'use client'

import { Navbar, NavDropdown, NavItem } from 'uibee/components'
import en from '@text/layout/en.json'
import no from '@text/layout/no.json'
import config from '@config'
import Office from '@components/svg/symbols/office'
import {
    Activity,
    BookOpen,
    FolderOpen,
    Globe,
    Heart,
    Images,
    Music,
    UserRound
} from 'lucide-react'

type TopBarProps = {
    onlyLogo: boolean
    theme: string
    lang: Lang
    accessToken: string | null
}

export default function Topbar({ onlyLogo, theme, lang, accessToken }: TopBarProps) {
    const text = lang === 'no' ? no : en
    const navbarClassName = 'site-header [view-transition-name:site-header] '
        + 'bg-transparent! max-800px:[&.topbar--open]:h-screen '
        + 'max-800px:[&.topbar--open]:bg-(--color-bg-topbar-open) '
        + '800px:[&.topbar--open]:h-(--h-topbar)'

    return (
        <div className='relative flex items-center'>
            <div className='min-w-0 flex-1'>
                <Navbar
                    lang={lang}
                    theme={theme}
                    token={accessToken}
                    loginPath={config.authPath.login}
                    logoutPath={config.authPath.logout}
                    onlyLogo={onlyLogo}
                    className={navbarClassName}
                >
                    <NavItem href='/events'>{text.nav.events}</NavItem>
                    <NavItem href='/career'>{text.nav.jobad}</NavItem>
                    <NavItem href='/companies'>{text.nav.companies}</NavItem>
                    <NavDropdown title={text.nav.about} className='bg-(--color-bg-topbar-fallback)!'>
                        <NavItem href='/about'>
                            <div className='flex flex-row items-center'>
                                <i className='logfont-login pr-[0.7rem] text-[1.3rem] leading-6 align-middle ml-[0.1rem]' />
                                {text.nav.general}
                            </div>
                        </NavItem>
                        <NavItem href='/verv'>
                            <div className='flex flex-row items-center'>
                                <Heart className='size-6 stroke-(--color-text-regular) mr-[0.7rem]' />
                                {text.nav.verv}
                            </div>
                        </NavItem>
                        <NavItem href='/fond'>
                            <div className='flex flex-row items-center'>
                                <Office className='size-6 fill-(--color-text-regular) mr-[0.7rem]' />
                                {text.nav.fondet}
                            </div>
                        </NavItem>
                        <NavItem href={config.url.wiki} external target='_blank'>
                            <div className='flex flex-row items-center'>
                                <BookOpen className='size-6 stroke-(--color-text-regular) mr-[0.7rem]' />
                                wiki
                            </div>
                        </NavItem>
                    </NavDropdown>
                    <NavDropdown title={text.nav.more} className='bg-(--color-bg-topbar-fallback)!'>
                        <NavItem href='/albums'>
                            <div className='flex flex-row items-center'>
                                <Images className='size-6 stroke-(--color-text-regular) mr-[0.7rem]' />
                                {text.nav.albums}
                            </div>
                        </NavItem>
                        <NavItem href='/assets'>
                            <div className='flex flex-row items-center'>
                                <FolderOpen className='size-6 stroke-(--color-text-regular) mr-[0.7rem]' />
                                {text.nav.assets}
                            </div>
                        </NavItem>
                        <NavItem href='/music'>
                            <div className='flex flex-row items-center'>
                                <Music className='size-6 stroke-(--color-text-regular) mr-[0.7rem]' />
                                {text.nav.music}
                            </div>
                        </NavItem>
                        <NavItem href='/status'>
                            <div className='flex flex-row items-center'>
                                <Activity className='size-6 stroke-(--color-text-regular) mr-[0.7rem]' />
                                {text.nav.status}
                            </div>
                        </NavItem>
                        <NavItem href='/tjenester'>
                            <div className='flex flex-row items-center'>
                                <Globe className='size-6 stroke-(--color-text-regular) mr-[0.7rem]' />
                                {text.nav.tjenester}
                            </div>
                        </NavItem>
                        {accessToken && (
                            <NavItem href='/profile'>
                                <div className='flex flex-row items-center'>
                                    <UserRound className='size-6 stroke-(--color-text-regular) mr-[0.7rem]' />
                                    {text.nav.profile}
                                </div>
                            </NavItem>
                        )}
                    </NavDropdown>
                </Navbar>
            </div>
        </div>
    )
}
