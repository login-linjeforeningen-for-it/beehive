import config from '@config'
import clsx from '@utils/clsx'
import {
    formatProfileDate,
    getAuthentikProfile,
    getProfileAttributes,
    getProfileInitials,
    getReadableGroupName,
} from '@utils/profile'
import {
    ArrowUpRight,
    BadgeCheck,
    BookOpen,
    Bot,
    BriefcaseBusiness,
    CalendarDays,
    ClipboardList,
    Code2,
    DatabaseZap,
    FileText,
    GraduationCap,
    Images,
    KeyRound,
    LayoutDashboard,
    Lock,
    LogIn,
    Music,
    ShieldCheck,
    UserRound,
} from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import no from '@text/profile/no.json'
import en from '@text/profile/en.json'

export default async function ProfilePage() {
    const cookieStore = await cookies()
    const lang = ((cookieStore.get('lang')?.value || 'no') as Lang) === 'en' ? 'en' : 'no'
    const accessToken = cookieStore.get('access_token')?.value
    const profile = accessToken ? await getAuthentikProfile(accessToken) : null
    const text = lang === 'no' ? no : en
    const groups = [
        ...(profile?.groups || []),
        ...(profile?.authentik.groups || []).map(getReadableGroupName).filter((group): group is string => Boolean(group)),
    ].filter((group, index, allGroups) => allGroups.indexOf(group) === index)
    const attributes = getProfileAttributes(profile)

    if (!accessToken) {
        return (
            <main className='page-container'>
                <section className='page-section--normal mx-auto flex max-w-4xl flex-col items-center py-24 text-center'>
                    <div className='mb-8 flex h-24 w-24 items-center justify-center rounded-full
                        border border-login-orange/30 bg-login-orange/10 shadow-2xl shadow-login-orange/10'
                    >
                        <UserRound className='h-10 w-10 stroke-login-orange' />
                    </div>
                    <p className='mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-login-orange'>
                        {text.eyebrow}
                    </p>
                    <h1 className='heading-1 mb-5'>{text.loginTitle}</h1>
                    <Link
                        href={`${config.authPath.login}?redirect=${encodeURIComponent('/profile')}`}
                        className='mt-6 inline-flex items-center gap-3 rounded-full bg-login-orange px-6 py-3
                            font-semibold shadow-lg shadow-login-orange/20 transition hover:scale-[1.02]'
                    >
                        <LogIn className='h-5 w-5' />
                        {text.loginButton}
                    </Link>
                </section>
            </main>
        )
    }

    return (
        <main className='page-container overflow-hidden'>
            <section className='page-section--normal relative grid gap-8 py-12 1100px:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)]'>
                <div className='absolute left-1/2 top-0 -z-10 h-80 w-80 -translate-x-1/2 rounded-full
                    bg-login-orange/15 blur-3xl'
                />
                <aside className='flex flex-col gap-5'>
                    <section className='rounded-4xl border border-white/10 bg-white/4 p-6 shadow-2xl shadow-black/10'>
                        <div className='flex items-start gap-4'>
                            <div className='flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl
                                bg-login-orange text-3xl font-bold text-black shadow-lg shadow-login-orange/20'
                            >
                                {getProfileInitials(profile)}
                            </div>
                            <div className='min-w-0'>
                                <p className='mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-login-orange'>
                                    {text.eyebrow}
                                </p>
                                <h1 className='text-3xl font-bold text-(--color-text-main) 800px:text-4xl'>
                                    {profile?.name || profile?.username}
                                </h1>
                                <p className='mt-2 wrap-break-word text-sm text-(--color-text-regular)'>
                                    {profile?.email || text.unavailable}
                                </p>
                            </div>
                        </div>
                        <div className='mt-6 grid gap-3'>
                            <InfoPill
                                icon={<BadgeCheck className='h-4 w-4' />}
                                label={profile?.emailVerified ? text.verified : text.unverified}
                                active={Boolean(profile?.emailVerified)}
                            />
                            <InfoPill
                                icon={<ShieldCheck className='h-4 w-4' />}
                                label={profile?.authentik.isActive === false ? text.inactive : text.active}
                                active={profile?.authentik.isActive !== false}
                            />
                        </div>
                    </section>
                    <ProfileCard title={text.groups} icon={<Lock className='h-5 w-5' />}>
                        {groups.length ? (
                            <div className='flex flex-wrap gap-2'>
                                {groups.map((group) => (
                                    <span
                                        key={group}
                                        className='rounded-full border border-login-orange/25 bg-login-orange/10
                                            px-3 py-1 text-sm text-(--color-text-main)'
                                    >
                                        {group}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className='text-sm text-(--color-text-regular)'>{text.noGroups}</p>
                        )}
                    </ProfileCard>
                </aside>

                <div className='flex flex-col gap-5'>
                    <section className='rounded-4xl border border-white/10 bg-white/4 p-6 shadow-xl shadow-black/10'>
                        <p className='max-w-3xl text-lg leading-8 text-(--color-text-regular)'>
                            {text.description}
                        </p>
                    </section>

                    <ProfileCard title={text.actions} icon={<LayoutDashboard className='h-5 w-5' />}>
                        <div className='grid gap-3 700px:grid-cols-2'>
                            {getQuickActions(lang).map((action) => (
                                <QuickAction key={action.href} {...action} />
                            ))}
                        </div>
                    </ProfileCard>

                    <div className='grid gap-5 900px:grid-cols-2'>
                        <ProfileCard title={text.account} icon={<UserRound className='h-5 w-5' />}>
                            <InfoList
                                rows={[
                                    ['ID', profile?.id],
                                    ['Username', profile?.username],
                                    ['Preferred username', profile?.preferredUsername],
                                    ['Nickname', profile?.nickname],
                                    ['Given name', profile?.givenName],
                                    ['Family name', profile?.familyName],
                                    ['Email', profile?.email],
                                ]}
                            />
                        </ProfileCard>
                        <ProfileCard title={text.metadata} icon={<KeyRound className='h-5 w-5' />}>
                            <InfoList
                                rows={[
                                    ['Authentik PK', profile?.authentik.pk],
                                    ['UID', profile?.authentik.uid],
                                    ['Type', profile?.authentik.type],
                                    ['Path', profile?.authentik.path],
                                    ['Created', formatProfileDate(profile?.authentik.dateJoined || null, lang)],
                                    ['Last login', formatProfileDate(profile?.authentik.lastLogin || null, lang)],
                                ]}
                            />
                        </ProfileCard>
                    </div>

                    {attributes.length ? (
                        <ProfileCard title={text.attributes} icon={<DatabaseZap className='h-5 w-5' />}>
                            <InfoList rows={attributes.map((attribute) => [attribute.key, attribute.value])} />
                        </ProfileCard>
                    ) : null}
                </div>
            </section>
        </main>
    )
}

function ProfileCard({ title, icon, children }: {
    title: string
    icon: React.ReactNode
    children: React.ReactNode
}) {
    return (
        <section className='rounded-4xl border border-white/10 bg-white/3 p-5 shadow-xl shadow-black/10'>
            <h2 className='mb-4 flex items-center gap-2 text-lg font-semibold text-(--color-text-main)'>
                <span className='flex h-9 w-9 items-center justify-center rounded-2xl bg-login-orange/15 text-login-orange'>
                    {icon}
                </span>
                {title}
            </h2>
            {children}
        </section>
    )
}

function InfoList({ rows }: { rows: Array<[string, unknown]> }) {
    const visibleRows = rows.filter(([, value]) => value !== null && value !== undefined && String(value).length > 0)

    return (
        <dl className='grid gap-3'>
            {visibleRows.map(([label, value]) => (
                <div key={label} className='grid gap-1 rounded-2xl border border-white/8 bg-black/10 p-3'>
                    <dt className='text-xs uppercase tracking-[0.18em] text-(--color-text-regular)'>{label}</dt>
                    <dd className='wrap-break-word text-sm text-(--color-text-main)'>{String(value)}</dd>
                </div>
            ))}
        </dl>
    )
}

function InfoPill({ icon, label, active }: { icon: React.ReactNode; label: string; active: boolean }) {
    return (
        <div
            className={clsx(
                'flex items-center gap-2 rounded-full border px-3 py-2 text-sm',
                active
                    ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200'
                    : 'border-white/10 bg-white/5 text-(--color-text-regular)'
            )}
        >
            {icon}
            {label}
        </div>
    )
}

type QuickActionProps = {
    title: string
    description: string
    href: string
    icon: React.ReactNode
    external?: boolean
}

function QuickAction({ title, description, href, icon, external = false }: QuickActionProps) {
    const content = (
        <>
            <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-login-orange/15 text-login-orange'>
                {icon}
            </span>
            <span className='min-w-0 flex-1'>
                <span className='block font-semibold text-(--color-text-main)'>{title}</span>
                <span className='mt-1 block text-sm leading-5 text-(--color-text-regular)'>{description}</span>
            </span>
            <ArrowUpRight className='h-4 w-4 shrink-0 text-login-orange' />
        </>
    )
    const className = 'group flex items-center gap-3 rounded-3xl border border-white/10 bg-white/3 p-4 '
        + 'transition hover:-translate-y-0.5 hover:border-login-orange/35 hover:bg-login-orange/10'

    if (external) {
        return (
            <a href={href} target='_blank' rel='noopener noreferrer' className={className}>
                {content}
            </a>
        )
    }

    return (
        <Link href={href} className={className}>
            {content}
        </Link>
    )
}

function getQuickActions(lang: Lang): QuickActionProps[] {
    const no = lang === 'no'

    return [
        {
            title: 'wiki',
            description: no ? 'Dokumenter, referater og håndbøker.' : 'Documents, minutes, and handbooks.',
            href: config.url.wiki,
            icon: <BookOpen className='h-5 w-5' />,
            external: true,
        },
        {
            title: 'Studentbee',
            description: no ? 'Emner, notater og studentverktøy.' : 'Courses, notes, and student tools.',
            href: config.url.studentbee,
            icon: <GraduationCap className='h-5 w-5' />,
            external: true,
        },
        {
            title: 'Login GPT',
            description: no ? 'Fortsett samtaler med Login AI.' : 'Continue conversations with Login AI.',
            href: '/ai',
            icon: <Bot className='h-5 w-5' />,
        },
        {
            title: no ? 'Arrangementer' : 'Events',
            description: no ? 'Se hva som skjer og meld deg på.' : 'See what is happening and sign up.',
            href: '/events',
            icon: <CalendarDays className='h-5 w-5' />,
        },
        {
            title: no ? 'Karriere' : 'Career',
            description: no ? 'Stillinger og bedriftspresentasjoner.' : 'Jobs and company presentations.',
            href: '/career',
            icon: <BriefcaseBusiness className='h-5 w-5' />,
        },
        {
            title: no ? 'Albumer' : 'Albums',
            description: no ? 'Bilder fra Login-arrangementer.' : 'Photos from Login events.',
            href: '/albums',
            icon: <Images className='h-5 w-5' />,
        },
        {
            title: no ? 'Musikk' : 'Music',
            description: no ? 'Live aktivitet og statistikk.' : 'Live activity and stats.',
            href: '/music',
            icon: <Music className='h-5 w-5' />,
        },
        {
            title: 'Forms',
            description: no ? 'Skjemaer og påmeldinger.' : 'Forms and registrations.',
            href: config.url.forms,
            icon: <ClipboardList className='h-5 w-5' />,
            external: true,
        },
        {
            title: 'Git',
            description: no ? 'Kode og interne repositories.' : 'Code and internal repositories.',
            href: config.url.git,
            icon: <Code2 className='h-5 w-5' />,
            external: true,
        },
        {
            title: no ? 'Internside' : 'Internal',
            description: no ? 'Drift og adminverktøy.' : 'Operations and admin tools.',
            href: '/internal',
            icon: <ShieldCheck className='h-5 w-5' />,
        },
        {
            title: 'Queenbee',
            description: no ? 'Administrer Login-innhold.' : 'Manage Login content.',
            href: config.url.queenbee,
            icon: <FileText className='h-5 w-5' />,
            external: true,
        },
        {
            title: 'Beekeeper',
            description: no ? 'TekKom API og statusverktøy.' : 'TekKom API and status tooling.',
            href: config.url.beekeeper,
            icon: <DatabaseZap className='h-5 w-5' />,
            external: true,
        },
    ]
}
