import config from '@config'
import {
    formatProfileDate,
    getAuthentikProfile,
    getProfileAttributes,
    getProfileInitials,
    getReadableGroupName,
} from '@utils/profile'
import {
    BadgeCheck,
    DatabaseZap,
    Lock,
    LogIn,
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
                <section className='page-section--normal flex flex-col items-center py-24 text-center'>
                    <div className='mb-6 flex h-20 w-20 items-center justify-center rounded-(--border-radius-large)
                        border border-(--color-border-default) bg-(--color-bg-surface)'>
                        <UserRound className='h-9 w-9 text-(--color-primary)' />
                    </div>
                    <h1 className='heading-1 mb-4'>{text.loginTitle}</h1>
                    <Link
                        href={`${config.authPath.login}?redirect=${encodeURIComponent('/profile')}`}
                        className='mt-4 inline-flex items-center gap-2 rounded-(--border-radius)
                            bg-(--color-primary) px-5 py-2.5 text-sm font-semibold text-white
                            transition hover:brightness-110'
                    >
                        <LogIn className='h-4 w-4' />
                        {text.loginButton}
                    </Link>
                </section>
            </main>
        )
    }

    return (
        <main className='page-container'>
            <div className='page-section--normal pb-16'>
                <h1 className='heading-1 heading-1--top-left-corner'>{text.eyebrow}</h1>
                <p className='p-highlighted'>{text.description}</p>

                <div className='mt-6 flex items-start gap-5 border border-(--color-border-default)
                    bg-(--color-bg-surface) rounded-(--border-radius-large) p-5'>
                    <div
                        className='flex h-14 w-14 shrink-0 items-center justify-center
                            rounded-(--border-radius) text-xl font-bold text-white'
                        style={{ background: 'var(--color-primary)' }}
                    >
                        {getProfileInitials(profile)}
                    </div>
                    <div className='min-w-0 flex-1'>
                        <h2 className='text-2xl font-bold text-(--color-text-main) leading-tight'>
                            {profile?.name || profile?.username}
                        </h2>
                        <p className='mt-1 text-sm text-(--color-text-regular) wrap-break-word'>
                            {profile?.email || text.unavailable}
                        </p>
                        <div className='mt-3 flex flex-wrap gap-2'>
                            <InfoPill
                                icon={<BadgeCheck className='h-3.5 w-3.5' />}
                                label={profile?.emailVerified ? text.verified : text.unverified}
                                active={Boolean(profile?.emailVerified)}
                            />
                            <InfoPill
                                icon={<ShieldCheck className='h-3.5 w-3.5' />}
                                label={profile?.authentik.isActive === false ? text.inactive : text.active}
                                active={profile?.authentik.isActive !== false}
                            />
                        </div>
                    </div>
                </div>

                <SectionLabel icon={<Lock className='h-3.5 w-3.5' />} label={text.groups} />
                {groups.length ? (
                    <div className='flex flex-wrap gap-2'>
                        {groups.map((group) => (
                            <span
                                key={group}
                                className='rounded-(--border-radius) border border-(--color-border-default)
                                    bg-(--color-bg-surface) px-3 py-1 text-sm text-(--color-text-main)'
                            >
                                {group}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className='text-sm text-(--color-text-regular)'>{text.noGroups}</p>
                )}

                <SectionLabel icon={<UserRound className='h-3.5 w-3.5' />} label={text.account} />
                <div className={`grid gap-5 ${profile?.authentik.available ? '900px:grid-cols-2' : ''}`}>
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
                    {profile?.authentik.available ? (
                        <div>
                            <p className='mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-(--color-text-discreet)'>
                                {text.metadata}
                            </p>
                            <InfoList
                                rows={[
                                    ['Authentik PK', profile.authentik.pk],
                                    ['UID', profile.authentik.uid],
                                    ['Type', profile.authentik.type],
                                    ['Path', profile.authentik.path],
                                    ['Created', formatProfileDate(profile.authentik.dateJoined, lang)],
                                    ['Last login', formatProfileDate(profile.authentik.lastLogin, lang)],
                                ]}
                            />
                        </div>
                    ) : null}
                </div>

                {attributes.length ? (
                    <>
                        <SectionLabel icon={<DatabaseZap className='h-3.5 w-3.5' />} label={text.attributes} />
                        <InfoList rows={attributes.map((attribute) => [attribute.key, attribute.value])} />
                    </>
                ) : null}
            </div>
        </main>
    )
}

function SectionLabel({ label, icon }: { label: string; icon: React.ReactNode }) {
    return (
        <div className='flex items-center gap-3 mt-8 mb-4'>
            <span className='flex items-center gap-1.5 text-(--color-text-discreet) text-xs font-semibold uppercase tracking-[0.08em] shrink-0'>
                <span style={{ color: 'var(--color-primary)' }}>{icon}</span>
                {label}
            </span>
            <div className='flex-1 h-px bg-(--color-border-default)' />
        </div>
    )
}

function InfoList({ rows }: { rows: Array<[string, unknown]> }) {
    const visibleRows = rows.filter(([, value]) => value !== null && value !== undefined && String(value).length > 0)

    return (
        <dl className='grid gap-2'>
            {visibleRows.map(([label, value]) => (
                <div
                    key={label}
                    className='rounded-(--border-radius) border border-(--color-border-default) bg-(--color-bg-surface) px-3 py-2'
                >
                    <dt className='text-xs uppercase tracking-[0.12em] text-(--color-text-discreet)'>{label}</dt>
                    <dd className='mt-0.5 wrap-break-word text-sm text-(--color-text-main)'>{String(value)}</dd>
                </div>
            ))}
        </dl>
    )
}

function InfoPill({ icon, label, active }: { icon: React.ReactNode; label: string; active: boolean }) {
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-(--border-radius) border px-2.5 py-1 text-xs font-medium ${
            active
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : 'border-(--color-border-default) bg-(--color-bg-body) text-(--color-text-regular)'
        }`}>
            {icon}
            {label}
        </span>
    )
}
