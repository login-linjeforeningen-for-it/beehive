import { copySharedAiConversation } from '@utils/ai'
import { redirect } from 'next/navigation'

export default async function SharedChatPage({
    params
}: {
    params: Promise<{ token: string }>
}) {
    const { token } = await params
    const conversation = await copySharedAiConversation(token).catch(() => null)

    if (!conversation) {
        redirect('/ai')
    }

    redirect(`/ai/${conversation.id}`)
}
