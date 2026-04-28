'use client'

import { useState, useEffect } from 'react'
import ConfirmationNumber from '@components/svg/symbols/confirmationNumber'
import Group from '@components/svg/symbols/group'

type LiveData = {
    registered_count: number
    limit: number | null
    spaces_left: number | null
}

type Props = {
    formName: string
    lang: Lang
}

export default function LiveCount({ formName, lang }: Props) {
    const [data, setData] = useState<LiveData | null>(null)

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`https://forms-api.login.no/api/forms/${formName}/live`)
                const json = await res.json()
                setData(json)
            } catch {
                setData(null)
            }
        }

        fetchData()
        const interval = setInterval(fetchData, 30_000)
        return () => clearInterval(interval)
    }, [formName])

    if (!data) return null

    const registeredLabel = lang === 'no' ? 'Påmeldt' : 'Registered'
    const spacesLeftLabel = lang === 'no' ? 'Ledige plasser' : 'Spaces left'

    return (
        <>
            {data.limit && data.limit !== null && (
                <>
                    <div className='inline-flex text-(--color-text-discreet)'>
                        <ConfirmationNumber className='w-8 pr-2 text-center leading-6 fill-(--color-text-discreet)' />
                        {registeredLabel}:
                    </div>
                    <div className='font-medium text-(--color-text-regular) wrap-break-word hyphens-auto'>
                        {data.registered_count} / {data.limit}
                    </div>
                </>
            )}
            {data.spaces_left && data.spaces_left !== null && (
                <>
                    <div className='inline-flex text-(--color-text-discreet) text-nowrap'>
                        <Group className='w-8 pr-2 text-center leading-6 fill-(--color-text-discreet)' />
                        {spacesLeftLabel}:
                    </div>
                    <div className='font-medium text-(--color-text-regular) wrap-break-word hyphens-auto'>{data.spaces_left}</div>
                </>
            )}
        </>
    )
}
