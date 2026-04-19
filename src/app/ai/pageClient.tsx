'use client'

import GPT_EmptyState from '@components/gpt/emptyState'
import GPTPreview from '@components/gpt/gptPreview'
import Menu from '@components/gpt/menu'
import useGptPageState from '@components/gpt/useGptPageState'
import { Comic_Neue } from 'next/font/google'
import en from '@text/ai/en.json'
import no from '@text/ai/no.json'
import { Check, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'

const comicNeue = Comic_Neue({ subsets: ['latin'], weight: ['400', '700'] })

export default function page({
    clients,
    conversations,
    random,
    lang,
    identity
}: {
    clients: number
    conversations: ChatConversationSummary[]
    random: number
    lang: Lang
    identity: AIIdentity
}) {
    const [copy, setCopy] = useState(false)
    const gpt = useGptPageState(conversations)
    const text = (lang === 'no' ? no : en).conversation

    function handleCopy() {
        navigator.clipboard.writeText(identity.sessionId)
        setCopy(true)
    }

    useEffect(() => {
        if (copy) {
            setTimeout(() => {
                setCopy(false)
            }, 600)
        }
    }, [copy])

    return (
        <div className='page-section--without-gaps h-full min-h-0'>
            <div className='grid h-full min-h-0 grid-cols-1 1000px:grid-cols-[18rem_minmax(0,1fr)]'>
                <Menu
                    text={text}
                    isLoadingConversations={gpt.isLoadingConversations}
                    conversations={gpt.conversations}
                    loadConversations={gpt.loadConversations}
                    id=''
                    identity={identity}
                />

                <section className='page-container min-h-[calc(100vh-var(--h-topbar))] bg-(--color-bg-main)'>
                    <div className='page-section--normal flex flex-col'>
                        {!identity.isLoggedIn && conversations.length ? (
                            <div
                                className='rounded-lg border border-red-500/40
                                    bg-red-500/10 p-3 text-sm text-red-100
                                    in-[.light]:text-red-900 flex items-center
                                    justify-between'
                            >
                                <div className='flex gap-2'>
                                    {text.temporaryBanner.split('{id}').map((part, i, arr) => (
                                        <span className='flex items-center' key={i}>
                                            {part}
                                            {i < arr.length - 1 && (
                                                <div className='flex gap-2 p-2'>
                                                    <code>{identity.sessionId}</code>
                                                    <button
                                                        type='button'
                                                        className='cursor-pointer'
                                                        onClick={handleCopy}
                                                    >
                                                        {copy
                                                            ? <Check className='h-4 w-4 stroke-green-500' />
                                                            : <Copy className='h-4 w-4' />}
                                                    </button>
                                                </div>
                                            )}
                                        </span>
                                    ))}
                                </div>
                                <div className='flex flex-wrap gap-3'>
                                    <a
                                        href={`/api/auth/login?redirect=${encodeURIComponent('/ai')}`}
                                        className='rounded-lg px-3 py-1.5 underline text-white'
                                    >
                                        {text.loginToSave}
                                    </a>
                                </div>
                            </div>
                        ) : null}
                        <h1 className='heading-1 heading-1--top-left-corner'>
                            Login AI
                        </h1>
                        <h1 className={`${comicNeue.className} text-right text-lg pr-18 -mt-25 text-(--color-primary)`}>#GjermundAI</h1>
                        {clients > 0 ? <GPTPreview gpt={gpt} random={random} lang={lang} /> : <GPT_EmptyState />}
                    </div>
                </section>
            </div>
        </div>
    )
}
