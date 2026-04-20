import { Check, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'

type AnonymousDisclaimerProps = {
    identity: AIIdentity
    conversations: ChatConversationSummary[]
    text: AIText
}

export default function AnonymousDisclaimer({ identity, conversations, text }: AnonymousDisclaimerProps) {
    const [copy, setCopy] = useState(false)

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

    if (identity.isLoggedIn || conversations.length === 0) {
        return null
    }

    return (
        <div
            className='rounded-lg border border-red-500/40 mx-auto px-20
                bg-red-500/10 p-3 text-sm text-red-100
                in-[.light]:text-red-900 flex items-center
                justify-between'
        >
            <div className='flex gap-2'>
                {text.temporaryBanner.split('{id}').map((part, i, arr) => (
                    <span className='flex items-center' key={i}>
                        {part}
                        {i < arr.length - 1 && (
                            <div className='flex gap-2 px-1'>
                                <code className='p-1 rounded-lg bg-red-800/10'>{identity.sessionId}</code>
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
    )
}
