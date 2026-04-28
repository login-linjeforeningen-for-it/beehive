import config from '@config'

export async function listAiConversations(): Promise<ChatConversationSummary[]> {
    return fetchAi<ChatConversationSummary[]>('/ai/conversations')
}

export async function listDeletedAiConversations(): Promise<ChatConversationSummary[]> {
    return fetchAi<ChatConversationSummary[]>('/ai/conversations?deleted=true')
}

export async function getAiConversation(id: string): Promise<StoredConversation> {
    return fetchAi<StoredConversation>(`/ai/conversations/${id}`)
}

export async function createAiConversation(clientName: string): Promise<StoredConversation> {
    return fetchAi<StoredConversation>('/ai/conversations', {
        method: 'POST',
        body: JSON.stringify({ clientName }),
    })
}

export async function deleteAiConversation(id: string): Promise<void> {
    await fetchAi<void>(`/ai/conversations/${id}`, {
        method: 'DELETE',
    })
}

export async function restoreAiConversation(id: string): Promise<void> {
    await fetchAi<void>(`/ai/conversations/${id}/restore`, {
        method: 'POST',
    })
}

export async function switchAiConversationClient(id: string, clientName: string): Promise<StoredConversation> {
    return fetchAi<StoredConversation>(`/ai/conversations/${id}/switch-client`, {
        method: 'POST',
        body: JSON.stringify({ clientName }),
    })
}

export async function importAiConversationsFromSession(sessionId: string): Promise<void> {
    await fetchAi<void>('/ai/conversations/import-session', {
        method: 'POST',
        body: JSON.stringify({ sessionId }),
    })
}

export async function transferAiConversationToUser(id: string, userId: string): Promise<void> {
    await fetchAi<void>(`/ai/conversations/${id}/transfer`, {
        method: 'POST',
        body: JSON.stringify({ userId }),
    })
}

export async function shareAiConversation(id: string): Promise<{ shareToken: string }> {
    return fetchAi<{ shareToken: string }>(`/ai/conversations/${id}/share`, {
        method: 'POST',
    })
}

export async function copySharedAiConversation(shareToken: string): Promise<StoredConversation> {
    return fetchAi<StoredConversation>(`/ai/shared/${shareToken}/copy`, {
        method: 'POST',
    })
}

async function fetchAi<T>(path: string, init?: RequestInit): Promise<T> {
    const baseUrl = typeof window === 'undefined'
        ? config.url.beekeeper
        : '/api'
    const headers = new Headers(init?.headers)

    if (typeof window === 'undefined') {
        const { cookies } = await import('next/headers')
        const cookieStore = await cookies()
        const accessToken = cookieStore.get('access_token')?.value
        const sessionId = cookieStore.get('ai_session_id')?.value

        if (accessToken) {
            headers.set('Authorization', `Bearer ${accessToken}`)
        }

        if (sessionId) {
            headers.set('x-ai-session-id', sessionId)
        }
    }

    const response = await fetch(`${baseUrl}${path}`, {
        ...init,
        headers: init?.body
            ? {
                'Content-Type': 'application/json',
                ...Object.fromEntries(headers.entries()),
            }
            : Object.fromEntries(headers.entries()),
    })

    if (!response.ok) {
        const text = await response.text()
        throw new Error(text || 'Failed to load AI data.')
    }

    if (response.status === 204) {
        return undefined as T
    }

    return response.json() as Promise<T>
}
