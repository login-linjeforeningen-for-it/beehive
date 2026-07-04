import Link from 'next/link'
import {
    ArrowUpRight,
    BookOpen,
    ClipboardList,
    Code2,
    Gamepad2,
    GitBranch,
    GraduationCap,
    HardDrive,
    KeyRound,
    LayoutDashboard,
    Lock,
    MessageSquare,
    Server,
} from 'lucide-react'
import config from '@config'

type Service = {
    name: string
    description: string
    url: string
    icon: React.ReactNode
    external?: boolean
    host: string
}

type Group = {
    label: string
    services: Service[]
}

const groups: Group[] = [
    {
        label: 'Ressurser',
        services: [
            {
                name: 'Wiki',
                description: 'Dokumenter, referater og håndbøker for Login.',
                url: 'https://outline.login.no',
                icon: <BookOpen className='size-4.5' />,
                external: true,
                host: 'outline.login.no',
            },
            {
                name: 'Studentbee',
                description: 'Eksamensoppgaver, løsningsforslag og flashcards.',
                url: config.url.studentbee,
                icon: <GraduationCap className='size-4.5' />,
                external: true,
                host: 'studentbee.login.no',
            },
        ],
    },
    {
        label: 'Verktøy',
        services: [
            {
                name: 'Forms',
                description: 'Skjemaer, søknader og påmeldinger for Login.',
                url: config.url.forms,
                icon: <ClipboardList className='size-4.5' />,
                external: true,
                host: 'forms.login.no',
            },
            {
                name: 'Konto',
                description: 'Administrer din Login-konto og SSO-innstillinger.',
                url: 'https://authentik.login.no',
                icon: <KeyRound className='size-4.5' />,
                external: true,
                host: 'authentik.login.no',
            },
            {
                name: 'Zammad',
                description: 'Helpdesk og supportsystem for Login.',
                url: 'https://zammad.login.no',
                icon: <MessageSquare className='size-4.5' />,
                external: true,
                host: 'zammad.login.no',
            },
        ],
    },
    {
        label: 'Administrasjon',
        services: [
            {
                name: 'Queenbee',
                description: 'Administrasjon av Login-innhold og sider.',
                url: config.url.queenbee,
                icon: <LayoutDashboard className='size-4.5' />,
                external: true,
                host: 'queenbee.login.no',
            },
            {
                name: 'Git',
                description: 'Interne repositories og kode.',
                url: config.url.git,
                icon: <Code2 className='size-4.5' />,
                external: true,
                host: 'git.login.no',
            },
            {
                name: 'GitHub',
                description: 'Open source-prosjekter og offentlig kode.',
                url: config.url.github,
                icon: <GitBranch className='size-4.5' />,
                external: true,
                host: 'github.com/login-linjeforeningen-for-it',
            },
            {
                name: 'Vault',
                description: 'Delt passordbehandler for Login.',
                url: 'https://vault.login.no',
                icon: <Lock className='size-4.5' />,
                external: true,
                host: 'vault.login.no',
            },
        ],
    },
    {
        label: 'Infrastruktur',
        services: [
            {
                name: 'Proxmox',
                description: 'Virtualisering og containeradministrasjon.',
                url: 'https://pve.login.no',
                icon: <Server className='size-4.5' />,
                external: true,
                host: 'pve.login.no',
            },
            {
                name: 'TrueNAS',
                description: 'NAS og lagringsadministrasjon.',
                url: 'https://truenas.login.no',
                icon: <HardDrive className='size-4.5' />,
                external: true,
                host: 'truenas.login.no',
            },
            {
                name: 'Pelican',
                description: 'Spillserveradministrasjon for Login.',
                url: 'https://pelican.login.no',
                icon: <Gamepad2 className='size-4.5' />,
                external: true,
                host: 'pelican.login.no',
            },
        ],
    },
]

export default function TjenesterPage() {
    return (
        <div className='page-container min-h-[calc(100vh-var(--h-topbar))]'>
            <div className='page-section--normal flex flex-col pb-16'>
                <h1 className='heading-1 heading-1--top-left-corner'>Tjenester</h1>
                <p className='p-highlighted'>
                    Plattformer og verktøy driftet av Login.
                </p>

                {groups.map((group) => (
                    <div key={group.label}>
                        <div className='flex items-center gap-4 mt-8 mb-3'>
                            <span className='text-(--color-text-discreet) text-xs font-semibold uppercase tracking-[0.08em] shrink-0'>
                                {group.label}
                            </span>
                            <div className='flex-1 h-px bg-(--color-border-default)' />
                        </div>
                        <div className='grid grid-cols-1 gap-2 500px:grid-cols-2 900px:grid-cols-3'>
                            {group.services.map((service) => (
                                <ServiceCard key={service.name} {...service} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function ServiceCard({ name, description, url, icon, external, host }: Service) {
    const className = 'group flex items-start gap-4 rounded-(--border-radius-large) p-4 '
        + 'bg-(--color-bg-surface) border border-(--color-border-default) '
        + 'hover:border-(--color-border-light) transition-colors duration-150'

    const content = (
        <>
            <div
                className='flex size-9 shrink-0 items-center justify-center rounded-(--border-radius)'
                style={{
                    background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
                    color: 'var(--color-primary)',
                }}
            >
                {icon}
            </div>
            <div className='min-w-0 flex-1'>
                <p className='font-semibold text-(--color-text-main) leading-snug'>{name}</p>
                <p className='text-sm text-(--color-text-regular) mt-0.5 leading-snug'>{description}</p>
                <p className='text-xs font-mono text-(--color-text-discreet) mt-1.5'>{host}</p>
            </div>
            <ArrowUpRight
                className='size-4 shrink-0 mt-0.5 text-(--color-text-discreet)
                    group-hover:text-(--color-primary) transition-colors duration-150'
            />
        </>
    )

    if (external) {
        return (
            <a href={url} target='_blank' rel='noopener noreferrer' className={className}>
                {content}
            </a>
        )
    }

    return <Link href={url} className={className}>{content}</Link>
}
