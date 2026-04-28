import config from '@config'

const baseUrl = config.url.workerbee

type GetParamsProps = {
    type?: string
    search?: string
    offset?: number
    limit?: number
    orderBy?: string
    sort?: 'asc' | 'desc'
    categories?: string
    highlighted?: boolean
}

export async function getJob(jobID: number): Promise<GetJobProps | string> {
    const path = `/jobs/${jobID}`
    return await fetchWrapper(path)
}

export async function getJobRow(jobID: number) {
    const path = `/jobs/${jobID}/row`
    return await fetchWrapper(path)
}

export async function getJobs(
    skills: string | null = null, cities: string | null = null,
    organizations: string | null = null, jobtypes: string | null = null,
    limit = 20, offset = 0
): Promise<GetJobsProps | string> {
    const queryParts = new URLSearchParams({ limit: String(limit), offset: String(offset) })

    if (skills) queryParts.append('skills', skills)
    if (cities) queryParts.append('cities', cities)
    if (organizations) queryParts.append('organizations', organizations)
    if (jobtypes) queryParts.append('jobtypes', jobtypes)

    const path = `/jobs/?${queryParts.toString()}`
    return await fetchWrapper(path)
}

export async function getEvent(eventID: number): Promise<GetEventProps | string> {
    const path = `/events/${eventID}`
    return await fetchWrapper(path)
}

export async function getEventRow(eventID: number) {
    const path = `/events/${eventID}/row`
    return await fetchWrapper(path)
}

export async function getEvents({
    search, offset, limit, orderBy, sort, categories, highlighted
}: GetParamsProps = {}): Promise<GetEventsProps | string> {
    const queryParts = new URLSearchParams()
    if (search)     queryParts.append('search', String(search))
    if (offset)     queryParts.append('offset', String(offset))
    if (limit)      queryParts.append('limit', String(limit))
    if (orderBy)    queryParts.append('order_by', String(orderBy))
    if (sort)       queryParts.append('sort', String(sort))
    if (categories) queryParts.append('categories', categories)
    if (highlighted) queryParts.append('highlighted', String(highlighted))

    const path = `/events/?${queryParts.toString()}`
    return await fetchWrapper(path)
}

export async function getEventCategoryFilters() {
    const path = '/events/categories'
    return await fetchWrapper(path)
}

export async function getJobJobtypeFilters() {
    const path = '/jobs/types'
    return await fetchWrapper(path)
}

export async function getJobSkillFilters() {
    const path = '/jobs/skills'
    return await fetchWrapper(path)
}

export async function getJobCityFilters() {
    const path = '/jobs/cities'
    return await fetchWrapper(path)
}

export async function getJobOrganizationFilters() {
    const path = '/filters/jobs/organizations'
    return await fetchWrapper(path)
}

// Albums
export async function getAlbums({ search, offset, limit, orderBy, sort }: GetParamsProps = {}): Promise<GetAlbumsProps | string> {
    const queryParts = new URLSearchParams()
    if (search)     queryParts.append('search', String(search))
    if (offset)     queryParts.append('offset', String(offset))
    if (limit)      queryParts.append('limit', String(limit))
    if (orderBy)    queryParts.append('order_by', String(orderBy))
    if (sort)       queryParts.append('sort', String(sort))

    const path = `/albums?${queryParts.toString()}`
    return await fetchWrapper(path)
}

// Alerts
export async function getAlerts(alertPath: string): Promise<GetAlertProps | string> {
    const path = `/alerts/beehive?page=${alertPath}`
    return await fetchWrapper(path)
}

export async function getAlbum(albumID: number): Promise<GetAlbumProps | string> {
    const path = `/albums/${albumID}`
    return await fetchWrapper(path)
}

// Status
export async function getStatus(): Promise<MonitoringService[]> {
    const response = await fetchWrapper(`${config.url.beekeeper}/monitoring`)
    return typeof response === 'string' ? [] : response
}

// Music
export async function getActivity(): Promise<Music> {
    const response = await fetchWrapper(`${config.url.tekkomBot}/activity`)

    if (typeof response === 'string') {
        console.error(response)
        return {
            stats: {
                avg_seconds: 0,
                total_minutes: 0,
                total_minutes_this_year: 0,
                total_songs: 0,
            },
            currentlyListening: [],
            mostPlayedAlbums: [],
            mostPlayedArtists: [],
            mostPlayedSongs: [],
            mostPlayedEpisodes: [],
            mostPlayedSongsPerDay: [],
            topFiveToday: [],
            topFiveYesterday: [],
            topFiveThisWeek: [],
            topFiveLastWeek: [],
            topFiveThisMonth: [],
            topFiveEpisodesThisMonth: [],
            topFiveEpisodesLastMonth: [],
            topFiveLastMonth: [],
            topFiveThisYear: [],
            topFiveLastYear: [],
            mostActiveUsers: [],
            mostSkippingUsers: [],
            mostLikedAlbums: [],
            mostLikedArtists: [],
            mostLikedSongs: [],
            mostLikedEpisodes: [],
            mostSkippedAlbums: [],
            mostSkippedArtists: [],
            mostSkippedSongs: [],
            mostSkippedEpisodes: [],
            mostInspiredEpisodes: [],
            mostInspiredSongs: []
        }
    }

    return response as Music
}

export async function getClients(): Promise<number> {
    return await fetchWrapper(`${config.url.beekeeper}/clients`)
}

export async function getSafeActivity(): Promise<Music> {
    const data = await getActivity()
    data.mostActiveUsers = []
    data.mostSkippingUsers = []
    data.currentlyListening = data.currentlyListening.map(song => ({ ...song, user_id: undefined })) as CurrentlyListening[]
    return data
}

async function fetchWrapper(path: string, options = {}) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), config.timeout)
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        signal: controller.signal
    }
    const finalOptions = { ...defaultOptions, ...options }

    try {
        const response = await fetch(path.includes('http') ? path : `${baseUrl}${path}`, finalOptions)
        const data = await response.text()

        if (!response.ok) {
            throw new Error(data)
        }

        clearTimeout(timeout)
        return JSON.parse(data)
    // eslint-disable-next-line
    } catch (error: any) {
        clearTimeout(timeout)
        return JSON.stringify(error.message) || 'Unknown error! Please contact TekKom'
    }
}
