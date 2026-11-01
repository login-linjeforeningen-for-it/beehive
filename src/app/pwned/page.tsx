import { cookies } from 'next/headers'
import { normalizeLang } from '@utils/lang'
import no from '@text/pwned/no.json'
import PageClient from './pageClient'

export default async function page(){
    const lang = normalizeLang((await cookies()).get('lang')?.value)
    const pwned = Math.floor(Math.random() * no.pwned.length)
    return <PageClient pwnedNumber={pwned} lang={lang} />
}
