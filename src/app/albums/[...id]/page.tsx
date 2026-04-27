import { getAlbum } from '@utils/api'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import AlbumImages from '@components/albumImages'
import { normalizeLang } from '@utils/lang'

export default async function AlbumPage({ params }: PromisedPageProps) {
    const { id } = await params
    const album = await getAlbum(Number(id))

    if (typeof album === 'string') {
        notFound()
    }

    const lang = normalizeLang((await cookies()).get('lang')?.value)

    const formatter = new Intl.DateTimeFormat('no-NO', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
    })

    return (
        <div className='page-container h-full'>
            <div className='page-section--normal h-full flex flex-col'>
                {album.event ?
                    <Link
                        href={`/events/${album.event.id}`}
                        className='heading-1 heading-1--top-left-corner'
                    >
                        <span className='flex items-center gap-1'>
                            {lang === 'no' ? album.name_no : album.name_en}
                            <ChevronRight className='size-16'/>
                        </span>
                    </Link>
                    :
                    <h1 className='heading-1 heading-1--top-left-corner'>
                        {lang === 'no' ? album.name_no : album.name_en}
                    </h1>
                }
                <section>
                    <p className='p-highlighted'>
                        {album.event && album.event.time_start ? `${formatter.format(new Date(album.event.time_start))} - ` : ''}
                        {lang === 'no' ? album.description_no : album.description_en}
                    </p>
                </section>
                <AlbumImages
                    images={album.images}
                    albumId={album.id}
                    albumNameNo={album.name_no}
                    albumNameEn={album.name_en}
                    lang={lang}
                />
            </div>
        </div>
    )
}
