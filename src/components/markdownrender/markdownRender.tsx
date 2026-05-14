import type { ReactNode } from 'react'
import { MarkdownRender as UibeeMarkdownRender } from 'uibee/components'
import EventItem from '@components/event/eventItem'
import JobadCard from '@components/jobad/jobadCard'
import Alert from '@components/alert/alert'
import { getEventRow, getJobRow } from '@utils/api'
import Link from 'next/link'

type CustomLinkProps = {
    href: number
    children: ReactNode
}

type ErrorMessageProps = {
    // eslint-disable-next-line
    err: any
    title: string
}

export default function MarkdownRender({MDstr}: {MDstr: string}) {
    return (
        <UibeeMarkdownRender
            MDstr={MDstr}
            components={{
                a: ({href, children}) => <CustomLink href={href as unknown as number}>{children}</CustomLink>,
            }}
        />
    )
}

function CustomLink({ href, children }: CustomLinkProps) {
    if (typeof children === 'string') {
        if (children === ':event') {
            return EventEmbed(href)
        }
        if (children === ':jobad') {
            return JobadEmbed(href)
        }
    }

    return (
        <Link
            className='link link--primary hover:underline'
            href={String(href)}
            target='_blank'
            rel='noopener noreferrer'
        >
            {children}
        </Link>
    )
}

function ErrorMessage({ err, title }: ErrorMessageProps) {
    if (!err.error) {
        return 'Unknown error'
    }

    return (
    // @ts-ignore
        <Alert variant='danger'>
            {title}
            <br/>
            {err.status && <p>Status: {err.status}</p>}
            {err.error && <p>Error: {err.error}</p>}
        </Alert>
    )
}


async function EventEmbed(id: number) {
    const event = await getEventRow(id)
    if (typeof event === 'string') {
        <ErrorMessage err={event} title={'Error Fetching Event #' + id} />
    }

    return (
        <div className='my-4 w-full max-w-100 rounded-(--border-radius-large) border-[0.15rem] border-(--color-border-default)'>
            {event
                ? <EventItem event={event} variant='card' highlight={false} />
                : <p>Event not found</p>
            }
        </div>
    )
}

async function JobadEmbed(id: number) {
    const jobad = await getJobRow(id)
    if (typeof jobad === 'string') {
        <ErrorMessage err={jobad} title={'Error Fetching Event #' + id} />
    }
    return (
        <div className='my-4 w-full max-w-100 rounded-(--border-radius-large) border-[0.15rem] border-(--color-border-default)'>
            {jobad
                ? <JobadCard jobad={jobad} disableTags={true} />
                : <p>Job ad not found</p>
            }
        </div>
    )
}
