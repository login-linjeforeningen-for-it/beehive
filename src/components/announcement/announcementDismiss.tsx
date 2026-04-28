'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { X } from 'lucide-react'
import { setCookie } from 'utilbee/utils'

interface AnnouncementDismissProps {
    cookieName: string
    closeLabel: string
    children: ReactNode
}

export default function AnnouncementDismiss({
    cookieName,
    closeLabel,
    children
}: AnnouncementDismissProps) {
    const [visible, setVisible] = useState(true)

    function handleClose() {
        setCookie(cookieName, 'true', 365)
        setVisible(false)
    }

    if (!visible) {
        return null
    }

    return (
        <div className='relative'>
            <button
                type='button'
                onClick={handleClose}
                className='absolute right-3 top-5 z-10 rounded-full p-1 text-(--color-text-disabled)
                    transition-colors duration-150 hover:text-(--color-primary) cursor-pointer'
                aria-label={closeLabel}
            >
                <X size={18} />
            </button>
            {children}
        </div>
    )
}
