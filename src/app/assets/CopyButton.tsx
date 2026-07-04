'use client'

import { useState } from 'react'
import { Check, Link } from 'lucide-react'

export default function CopyButton({ url }: { url: string }) {
    const [copied, setCopied] = useState(false)

    async function handleCopy() {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <button
            type='button'
            onClick={handleCopy}
            title='Copy link'
            className='flex items-center justify-center gap-1.5 text-xs font-medium
                py-1.5 px-2 rounded cursor-pointer transition-all
                bg-(--color-btn-primary-bg) text-(--color-btn-primary-text)
                hover:brightness-95'
        >
            {copied
                ? <Check className='size-3.5' />
                : <Link className='size-3.5' />
            }
            {copied ? 'Copied' : 'Copy'}
        </button>
    )
}
