import Image from 'next/image'

export default function CarouselImage({ image, title }: { image: string, title: string }) {
    return (
        <>
            <Image
                className='rounded-(--border-radius)'
                src={image}
                alt={title}
                fill={true}
                sizes='100vw'
            />
        </>
    )
}
