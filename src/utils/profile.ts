import config from '@config'

export type AuthentikProfile = {
    id: string
    name: string | null
    email: string | null
    username: string | null
    preferredUsername: string | null
    nickname: string | null
    givenName: string | null
    familyName: string | null
    emailVerified: boolean | null
    picture: string | null
    groups: string[]
    authentik: {
        available: boolean
        pk: number | string | null
        uid: string | null
        username: string | null
        name: string | null
        email: string | null
        isActive: boolean | null
        lastLogin: string | null
        dateJoined: string | null
        path: string | null
        type: string | null
        groups: unknown[]
        attributes: Record<string, unknown>
    }
}

export async function getAuthentikProfile(accessToken: string): Promise<AuthentikProfile | null> {
    const response = await fetch(`${config.url.appApi}/auth/me`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
    })

    if (!response.ok) {
        return null
    }

    return await response.json() as AuthentikProfile
}

export function formatProfileDate(value: string | null, lang: Lang) {
    if (!value) {
        return null
    }

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
        return value
    }

    return new Intl.DateTimeFormat(lang === 'no' ? 'nb-NO' : 'en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date)
}

export function getProfileInitials(profile: AuthentikProfile | null) {
    const source = profile?.name || profile?.username || profile?.email || 'Login'
    const initials = source
        .split(/[\s._-]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('')

    return initials || 'L'
}

export function getReadableGroupName(group: unknown) {
    if (typeof group === 'string') {
        return group
    }

    if (typeof group !== 'object' || group === null) {
        return null
    }

    const record = group as Record<string, unknown>
    const value = record.name || record.group_name || record.slug || record.pk
    return value === undefined || value === null ? null : String(value)
}

export function getProfileAttributes(profile: AuthentikProfile | null) {
    if (!profile?.authentik.attributes) {
        return []
    }

    return Object.entries(profile.authentik.attributes)
        .filter(([, value]) => value !== null && value !== undefined && String(value).length > 0)
        .map(([key, value]) => ({
            key,
            value: Array.isArray(value) ? value.join(', ') : String(value),
        }))
}
