'use client'

import { useState, useEffect } from 'react'
import clsx from '@utils/clsx'

type DecoratedPictureProps = {
    imgUrl: string
    variant: number
    width: number
    height: number
    cornerSize: number
    cover?: boolean
    className?: string
}

export default function DecoratedPicture({
    imgUrl, variant, width, height, cornerSize, cover = false, className = ''
}: DecoratedPictureProps) {
    const [isLoaded, setIsLoaded] = useState(false)
    const maskID = `mask-${variant}-${width}-${height}`

    useEffect(() => {
        const img = new Image()
        img.src = imgUrl
        img.onload = () => setIsLoaded(true)
    }, [imgUrl])

    function renderDecorations() {
        switch (variant) {
            case 1:
                return (
                    <>
                        <clipPath id={maskID}>
                            <polygon
                                points={`0,${cornerSize} ${cornerSize / 3},${cornerSize}
                                    ${cornerSize / 3},${cornerSize / 3} ${cornerSize},${cornerSize / 3}
                                    ${cornerSize},0 ${width},0 ${width},${height} 0,${height}`}
                            />
                        </clipPath>
                        <rect
                            className='fill-(--color-primary)'
                            x='0'
                            y='0'
                            width={cornerSize - (cornerSize / 3) * 0.5}
                            height={(cornerSize / 3) * 0.5}
                        />
                        <rect
                            className='fill-(--color-primary)'
                            x='0'
                            y='0'
                            width={(cornerSize / 3) * 0.5}
                            height={cornerSize - (cornerSize / 3) * 0.5}
                        />
                    </>
                )
            case 2:
                return (
                    <>
                        <clipPath id={maskID}>
                            <polygon
                                points={`0,0 ${width - cornerSize},0 ${width - cornerSize},${
                                    cornerSize / 3
                                } ${width - cornerSize / 3},${cornerSize / 3} ${
                                    width - cornerSize / 3
                                },${cornerSize} ${width},${cornerSize} ${width},${height} 0,${height}`}
                            />
                        </clipPath>
                        <rect
                            className='fill-(--color-primary)'
                            x={width - cornerSize + (cornerSize / 3) * 0.5}
                            y='0'
                            width={cornerSize - (cornerSize / 3) * 0.5}
                            height={(cornerSize / 3) * 0.5}
                        />
                        <rect
                            className='fill-(--color-primary)'
                            x={width - (cornerSize / 3) * 0.5}
                            y='0'
                            width={(cornerSize / 3) * 0.5}
                            height={cornerSize - (cornerSize / 3) * 0.5}
                        />
                    </>
                )
            case 3:
                return (
                    <>
                        <clipPath id={maskID}>
                            <polygon
                                points={`0,0 ${width},0 ${width},${height - cornerSize} ${
                                    width - cornerSize / 3
                                },${height - cornerSize} ${width - cornerSize / 3},${
                                    height - cornerSize / 3
                                } ${width - cornerSize},${height - cornerSize / 3} ${width - cornerSize},${height} 0,${height}`}
                            />
                        </clipPath>
                        <rect
                            className='fill-(--color-primary)'
                            x={width - cornerSize + (cornerSize / 3) * 0.5}
                            y={height - (cornerSize / 3) * 0.5}
                            width={cornerSize - (cornerSize / 3) * 0.5}
                            height={(cornerSize / 3) * 0.5}
                        />
                        <rect
                            className='fill-(--color-primary)'
                            x={width - (cornerSize / 3) * 0.5}
                            y={height - cornerSize + (cornerSize / 3) * 0.5}
                            width={(cornerSize / 3) * 0.5}
                            height={cornerSize - (cornerSize / 3) * 0.5}
                        />
                    </>
                )
            case 4:
                return (
                    <>
                        <clipPath id={maskID}>
                            <polygon
                                points={`0,0 ${width},0 ${width},${height} ${cornerSize},${height} ${cornerSize},${
                                    height - cornerSize / 3
                                } ${cornerSize / 3},${height - cornerSize / 3} ${
                                    cornerSize / 3
                                },${height - cornerSize} 0,${height - cornerSize}`}
                            />
                        </clipPath>
                        <rect
                            className='fill-(--color-primary)'
                            x='0'
                            y={height - (cornerSize / 3) * 0.5}
                            width={cornerSize - (cornerSize / 3) * 0.5}
                            height={(cornerSize / 3) * 0.5}
                        />
                        <rect
                            className='fill-(--color-primary)'
                            x='0'
                            y={height - cornerSize + (cornerSize / 3) * 0.5}
                            width={(cornerSize / 3) * 0.5}
                            height={cornerSize - (cornerSize / 3) * 0.5}
                        />
                    </>
                )
            default:
                return null
        }
    }

    return (
        <picture className={clsx('relative w-full', className)}>
            <svg
                className={clsx(
                    variant === 1 && 'rounded-[0_.3rem_.3rem_.3rem]',
                    variant === 2 && 'rounded-[.3rem_0_.3rem_.3rem]',
                    variant === 3 && 'rounded-[.3rem_.3rem_0_.3rem]',
                    variant === 4 && 'rounded-[.3rem_.3rem_.3rem_0]'
                )}
                viewBox={`0,0 ${width},${height}`}
                xmlns='http://www.w3.org/2000/svg'
            >
                {renderDecorations()}
                {!isLoaded && (
                    <rect
                        width={width}
                        height={height}
                        clipPath={`url(#${maskID})`}
                        className='fill-[rgba(100,100,100,.3)]'
                    />
                )}
                <image
                    // @ts-ignore
                    clipPath={`url(#${maskID})`}
                    className={clsx('object-cover transition-opacity duration-500', isLoaded ? 'opacity-100' : 'opacity-0')}
                    href={imgUrl}
                    {...(cover ? { preserveAspectRatio: 'xMidYMid slice' } : {})}
                    width={'100%'}
                    height={'100%'}
                />
            </svg>
        </picture>
    )
}
