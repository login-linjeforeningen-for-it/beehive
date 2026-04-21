type PreviousChatsHeaderProps = {
    text: AIText
    showDeleted: boolean
    isLoadingConversations: boolean
    visibleConversations: ChatConversationSummary[]
}

export default function PreviousChatsHeader({
    text,
    showDeleted,
    isLoadingConversations,
    visibleConversations,
}: PreviousChatsHeaderProps) {
    return (
        <div className='mt-4 flex items-center justify-between'>
            <h2 className='text-xs font-semibold tracking-[0.18em] text-(--color-text-discreet)'>
                {showDeleted ? text.deleted : text.previousChats}
            </h2>
            <span className='text-xs text-(--color-text-discreet)'>
                {isLoadingConversations && !showDeleted ? text.loading : visibleConversations.length}
            </span>
        </div>
    )
}
