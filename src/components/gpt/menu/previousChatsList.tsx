import Marquee from '@components/music/marquee'
import { Ellipsis, Undo2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction } from 'react'
import MenuBar from './menuBar'

type PreviousChatsListProps = {
    text: AIText
    showDeleted: boolean
    visibleConversations: ChatConversationSummary[]
    id: string
    sidebar: string | null
    restoringConversationId: string | null
    router: ReturnType<typeof useRouter>
    setSidebar: Dispatch<SetStateAction<string | null>>
    handleMenuItemSidebar: (event: React.MouseEvent, conversationId: string) => void
    handleShareConversation: (event: React.MouseEvent, conversationId: string) => Promise<void>
    handleDeleteConversation: (event: React.MouseEvent, conversationId: string) => Promise<void>
    handleRestoreConversation: (event: React.MouseEvent, conversationId: string) => Promise<void>
    getDeleteIconClassName: (conversationId: string) => string
    getConversationClassName: (isActive: boolean) => string
}

export default function PreviousChatsList({
    text,
    showDeleted,
    visibleConversations,
    id,
    sidebar,
    restoringConversationId,
    router,
    setSidebar,
    handleMenuItemSidebar,
    handleShareConversation,
    handleDeleteConversation,
    handleRestoreConversation,
    getDeleteIconClassName,
    getConversationClassName,
}: PreviousChatsListProps) {
    return (
        <div className='mt-2 flex-1 overflow-y-auto pb-24'>
            {visibleConversations.map((conversation) => {
                const isActive = conversation.id === id

                return (
                    <div
                        key={conversation.id}
                        role='button'
                        tabIndex={0}
                        onClick={() => {
                            if (!showDeleted) {
                                router.push(`/ai/${conversation.id}`)
                            }
                        }}
                        onKeyDown={(event) => {
                            if ((event.key === 'Enter' || event.key === ' ') && !showDeleted) {
                                event.preventDefault()
                                router.push(`/ai/${conversation.id}`)
                            }
                        }}
                        className={`
                            group w-full rounded-lg p-2 text-left transition
                            cursor-pointer
                            ${getConversationClassName(isActive)}`}
                    >
                        <div className='flex items-start justify-between gap-3'>
                            <Marquee
                                className='truncate'
                                innerClassName='text-sm text-neutral-500'
                                text={conversation.title}
                            />
                            <span onMouseLeave={() => setSidebar(null)} className='flex shrink-0 items-center'>
                                {!showDeleted ? (
                                    <>
                                        <button
                                            type='button'
                                            aria-label={`${text.share}: ${conversation.title}`}
                                            onClick={(event) => handleMenuItemSidebar(event, conversation.id)}
                                            className={`
                                                rounded p-1 opacity-0 transition group-hover:opacity-60 hover:opacity-100 cursor-pointer
                                                `}
                                        >
                                            <Ellipsis className='h-4 w-4' />
                                        </button>
                                        {sidebar === conversation.id && <MenuBar
                                            text={text}
                                            conversation={conversation}
                                            handleShareConversation={handleShareConversation}
                                            handleDeleteConversation={handleDeleteConversation}
                                            getDeleteIconClassName={getDeleteIconClassName}
                                        />}
                                    </>
                                ) : (
                                    <button
                                        type='button'
                                        aria-label={`${text.restore}: ${conversation.title}`}
                                        onClick={(event) =>
                                            void handleRestoreConversation(event, conversation.id)}
                                        className='cursor-pointer rounded p-1 opacity-0 transition group-hover:opacity-60 hover:opacity-100'
                                    >
                                        <Undo2
                                            className={`h-4 w-4 ${
                                                restoringConversationId === conversation.id
                                                    ? 'text-(--color-primary)'
                                                    : ''
                                            }`}
                                        />
                                    </button>
                                )}
                            </span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
