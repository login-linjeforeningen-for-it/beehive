import { cookies } from 'next/headers'
import { getStatus } from '@utils/api'
import PageClient from './pageClient'

export default async function page() {
    const lang = ((await cookies()).get('lang')?.value || 'no') as Lang
    const monitoring = await getStatus()

    return <PageClient lang={lang} monitoring={monitoring} />
}
