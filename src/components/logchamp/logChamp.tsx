'use client'
import { useState, useEffect } from 'react'
import DecoratedPicture from '@components/images/decoratedpicture/decoratedPicture'
import Link from 'next/link'

type LogChampProps = {
    name: string
    position: string
    img: string
    discord: string
    discordLink: string
}

export default function LogChamp({name, position, img, discord, discordLink}: LogChampProps) {
    const [variant, setVariant] = useState<number | null>(null)

    useEffect(() => {
        setVariant(Math.ceil(Math.random() * 4))
    }, [])

    if (variant === null ) return <></>

    return (
        <div className='mx-auto my-4 block w-44'>
            <DecoratedPicture
                imgUrl={img}
                variant={variant}
                cornerSize={36}
                width={100}
                height={100}
                cover
            />
            <div>
                <p className='mt-4 text-[1.2rem] font-medium text-(--color-text-primary)'>{position}</p>
                <p>{name}</p>
                {discord &&
                    <p className='mt-4'>
                        <i className='logfont-discord'> </i>
                        <Link href={discordLink} target='_blank'>{discord}</Link>
                    </p>
                }
            </div>
        </div>
    )
}
