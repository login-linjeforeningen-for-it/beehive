import { MessageSquarePlus } from 'lucide-react'
import Link from 'next/link'

export default function NewChatLink({ text }: { text: AIText }) {
    return (
        <Link
            href='/ai'
            className='flex items-center gap-2 rounded-lg py-2 text-sm font-semibold
                text-(--color-text-main) transition hover:bg-(--color-bg-main)'
        >
            <MessageSquarePlus className='h-4 w-4' />
            {text.newChat}
        </Link>
    )
}
