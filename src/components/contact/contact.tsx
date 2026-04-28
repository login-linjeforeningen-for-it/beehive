'use client'

import MazeMapEmbed from '@components/mazemap/mazeMapEmbed'
import no from '@text/contact/no.json'
import en from '@text/contact/en.json'
import TravelExplore from '@components/svg/symbols/travelExplore'
import config from '@config'
import useLang from '@/hooks/useLang'

export default function Contact() {
    const text = useLang(no, en)

    return(
        <div>
            <h2 className='heading-2 heading-2--icon'>
                <TravelExplore className='w-12 h-12 fill-(--color-text-main) mr-4' />
                <span>{text.contact.title}</span>
            </h2>
            <div className='flex flex-col 800px:flex-row gap-4 justify-between w-full'>
                <div className='w-fit min-w-64'>
                    <h4 className='heading-4'>{text.contact.address}:</h4>
                    <p className='p-regular'>
                        Login - Linjeforeningen for IT
                        <br/>
                        Teknologivegen 22
                        <br/>
                        Bygg A, rom 155
                        <br/>
                        2815 GJØVIK
                    </p>
                    <h4 className='heading-4'>{text.contact.email}:</h4>
                    <p className='p-regular'>
                        <a
                            className='link link--primary hover:underline'
                            href={`mailto:${config.url.mail}`}
                        >
                            {config.url.mail}
                        </a>
                    </p>
                </div>
                <div className='w-full max-w-160 pt-4'>
                    <MazeMapEmbed poi={229153} height={345} />
                </div>
            </div>
        </div>
    )
}
