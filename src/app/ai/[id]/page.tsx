import { getClients } from '@utils/api'
import { getAiConversation, listAiConversations } from '@utils/ai'
import PageClient from './pageClient'
import { cookies } from 'next/headers'

export default async function page({ params }: PromisedPageProps) {
    const id = String((await params).id)
    const lang = ((await cookies()).get('lang')?.value || 'no') as Lang
    const [initialConversation, initialClientsCount, initialConversations] = await Promise.all([
        getAiConversation(id).catch(() => null),
        getClients().catch(() => 0),
        listAiConversations().catch(() => []),
    ])

    return (
        <PageClient
            id={id}
            lang={lang}
            initialConversation={initialConversation}
            initialClientsCount={initialClientsCount}
            initialConversations={initialConversations}
        />
    )
}
