import { getClients } from '@utils/api'
import { listAiConversations } from '@utils/ai'
import PageClient from './pageClient'
import { cookies } from 'next/headers'

export default async function page() {
    const [clients, conversations] = await Promise.all([
        getClients(),
        listAiConversations().catch(() => []),
    ])
    const lang = ((await cookies()).get('lang')?.value || 'no') as Lang
    const random = Math.floor(Math.random() * 3)
    return <PageClient
        clients={clients}
        conversations={conversations}
        random={random}
        lang={lang}
    />
}
