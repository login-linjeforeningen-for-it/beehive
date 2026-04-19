'use client'

import en from '@text/ai/en.json'
import no from '@text/ai/no.json'
import { useEffect, useMemo, useRef, useState } from 'react'
import useGptPageState, {
    createChatSessionFromStoredConversation,
    getStoredChatSessionSnapshot
} from '@components/gpt/useGptPageState'
import findHighestTPSClient from '@utils/findHighestTPSClient'
import Footer from '@components/gpt/footer'
import Prompt from '@components/gpt/prompt'
import Messages from '@components/gpt/messages'
import UnavailableBanner from '@components/gpt/unavailableBanner'
import Menu from '@components/gpt/menu'

export default function PageClient({
    id,
    lang,
    initialConversation,
    initialClientsCount,
    initialConversations,
    identity,
}: {
    id: string
    lang: Lang
    initialConversation: StoredConversation | null
    initialClientsCount: number
    initialConversations: ChatConversationSummary[]
    identity: AIIdentity
}) {
    const {
        chatSession: liveChatSession,
        clients,
        conversations,
        isConnected,
        isLoadingChat,
        isLoadingConversations,
        loadConversations,
        restoreChat,
        sendPrompt,
        switchConversationClient
    } = useGptPageState(initialConversations)
    const text = (lang === 'no' ? no : en).conversation
    const [input, setInput] = useState('')
    const [selectedClient, setSelectedClient] = useState('')
    const [isSwitching, setIsSwitching] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    const shouldFollowRef = useRef(true)
    const snapshotSession = useMemo(() => getStoredChatSessionSnapshot(id), [id])
    const fallbackSession = useMemo(
        () => initialConversation ? createChatSessionFromStoredConversation(initialConversation) : null,
        [initialConversation]
    )
    const chatSession = liveChatSession?.conversationId === id
        ? liveChatSession
        : snapshotSession?.conversationId === id
            ? snapshotSession
            : fallbackSession?.conversationId === id
                ? fallbackSession
                : liveChatSession

    useEffect(() => {
        if (!fallbackSession || fallbackSession.conversationId !== id) {
            void restoreChat(id)
        }
    }, [fallbackSession, id, restoreChat])

    useEffect(() => {
        const textarea = textareaRef.current
        if (!textarea) {
            return
        }

        textarea.style.height = '0px'
        textarea.style.height = `${Math.min(textarea.scrollHeight, 240)}px`
    }, [input])

    const isActiveClientAvailable = useMemo(() => {
        if (!chatSession) {
            return false
        }

        if (!clients.length) {
            return initialClientsCount > 0
        }

        return clients.some((client) => client.name === chatSession.clientName)
    }, [chatSession, clients, initialClientsCount])

    const fallbackClient = useMemo(() => {
        if (!clients.length) {
            return null
        }

        return findHighestTPSClient(clients)
    }, [clients])

    useEffect(() => {
        if (!selectedClient && fallbackClient) {
            setSelectedClient(fallbackClient.name)
        }
    }, [fallbackClient, selectedClient])

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!chatSession || !input.trim() || !isActiveClientAvailable) {
            return
        }

        shouldFollowRef.current = true

        const didSend = await sendPrompt(input, chatSession)
        if (didSend) {
            setInput('')
        }
    }

    async function handleSwitchClient() {
        if (!chatSession || !selectedClient) {
            return
        }

        try {
            setIsSwitching(true)
            shouldFollowRef.current = true
            await switchConversationClient(chatSession.conversationId, selectedClient)
        } finally {
            setIsSwitching(false)
        }
    }

    const showUnavailableBanner = Boolean(
        chatSession
        && ((clients.length > 0 && !isActiveClientAvailable)
            || (clients.length === 0 && initialClientsCount === 0))
    )

    return (
        <div className='page-section--without-gaps h-full min-h-0'>
            <div className='grid h-full min-h-0 grid-cols-1 1000px:grid-cols-[18rem_minmax(0,1fr)]'>
                <Menu
                    text={text}
                    isLoadingConversations={isLoadingConversations}
                    conversations={conversations}
                    loadConversations={loadConversations}
                    id={id}
                    identity={identity}
                />

                <section className='flex min-h-0 flex-col bg-(--color-bg-main)'>
                    {!identity.isLoggedIn ? (
                        <div className='border border-red-500/40 bg-red-500/10 px-5 py-3 1000px:px-8'>
                            <div className='flex flex-col gap-2 text-sm text-red-100 in-[.light]:text-red-900'>
                                <p className='font-semibold'>
                                    {text.temporaryBanner.replace('{id}', identity.sessionId)}
                                </p>
                                <div className='flex flex-wrap items-center gap-3'>
                                    <button
                                        type='button'
                                        onClick={() => navigator.clipboard.writeText(identity.sessionId)}
                                        className='text-left underline underline-offset-3'
                                    >
                                        {text.copySessionId}
                                    </button>
                                    <a
                                        href={`/api/auth/login?redirect=${encodeURIComponent(`/ai/${id}`)}`}
                                        className='rounded-(--border-radius) bg-red-500 px-3 py-1.5 font-semibold text-white'
                                    >
                                        {text.loginToSave}
                                    </a>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    <UnavailableBanner
                        showUnavailableBanner={showUnavailableBanner}
                        chatSession={chatSession}
                        text={text}
                        selectedClient={selectedClient}
                        setSelectedClient={setSelectedClient}
                        clients={clients}
                        isSwitching={isSwitching}
                        handleSwitchClient={handleSwitchClient}
                    />

                    <Messages
                        isLoadingChat={isLoadingChat}
                        chatSession={chatSession}
                        text={text}
                        shouldFollowRef={shouldFollowRef}
                        id={id}
                    />

                    <Prompt
                        handleSubmit={handleSubmit}
                        textareaRef={textareaRef}
                        input={input}
                        chatSession={chatSession}
                        isActiveClientAvailable={isActiveClientAvailable}
                        setInput={setInput}
                        text={text}
                    />

                    <Footer
                        isConnected={isConnected}
                        text={text}
                        chatSession={chatSession}
                        isLoadingChat={isLoadingChat}
                    />
                </section>
            </div>
        </div>
    )
}
