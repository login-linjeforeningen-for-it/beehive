import { getClients } from '@utils/api'
import { listAiConversations } from '@utils/ai'
import PageClient from './pageClient'
import { cookies } from 'next/headers'

export default async function page() {
    const cookieStore = await cookies()
    const [clients, conversations] = await Promise.all([
        getClients(),
        listAiConversations().catch(() => []),
    ])
    const lang = (cookieStore.get('lang')?.value || 'no') as Lang
    const identity = {
        userId: cookieStore.get('user_id')?.value || null,
        userName: cookieStore.get('user_name')?.value || null,
        sessionId: cookieStore.get('ai_session_id')?.value || '',
        isLoggedIn: Boolean(cookieStore.get('access_token')?.value),
    }
    const random = Math.floor(Math.random() * 3)
    return <PageClient
        clients={clients}
        conversations={conversations}
        random={random}
        lang={lang}
        identity={identity}
    />
}
