import Card from './card'

type TileInfoText = Pick<MusicText, 'average_duration' | 'total_minutes' | 'minutes_this_year' | 'total_songs'>

export default function TileInfo({ data, text, lang }: { data: Music, text: TileInfoText, lang: Lang }) {
    const tileInfoData: Array<{ title: string; value: string }> = [
        { title: text.average_duration, value: formatDuration(data.stats.avg_seconds, lang) },
        { title: text.total_minutes, value: formatDuration(data.stats.total_minutes * 60, lang) },
        { title: text.minutes_this_year, value: formatDuration(data.stats.total_minutes_this_year * 60, lang) },
        { title: text.total_songs, value: formatSongCount(data.stats.total_songs, lang) }
    ]

    return (
        <div className='flex flex-col md:flex-row gap-4 w-full'>
            {tileInfoData.map((item) => (
                <Card key={item.title} text={item.title} smallText={true} centerText={true}>
                    <p className='font-bold'>{item.value}</p>
                </Card>
            ))}
        </div>
    )
}

function formatDuration(seconds: number, lang: Lang): string {
    const MINUTE = 60
    const HOUR = MINUTE * 60
    const DAY = HOUR * 24
    const WEEK = DAY * 7
    const MONTH = DAY * 30
    const YEAR = DAY * 365

    const years = Math.floor(seconds / YEAR)
    const months = Math.floor((seconds % YEAR) / MONTH)
    const weeks = Math.floor((seconds % MONTH) / WEEK)
    const days = Math.floor((seconds % WEEK) / DAY)
    const hours = Math.floor((seconds % DAY) / HOUR)
    const minutes = Math.floor((seconds % HOUR) / MINUTE)
    const remainingSeconds = seconds % MINUTE

    const parts = []
    if (years > 0) {
        parts.push(lang === 'no' ? `${years}år` : `${years}y`)
        if (months > 0) parts.push(lang === 'no' ? `${months}mnd` : `${months}mo`)
        return parts.join(' ')
    }

    if (weeks > 0) parts.push(`${weeks}w`)
    if (days > 0) parts.push(`${days}d`)
    if (hours > 0) parts.push(`${hours}h`)
    if (minutes > 0) parts.push(`${minutes}m`)
    if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds}s`)

    return parts.join(' ')
}

function formatSongCount(count: number, lang: Lang): string {
    if (count <= 100000) return count.toString()

    const thousands = Math.round(count / 1000)
    return lang === 'no' ? `${thousands} tusen` : `${thousands}k`
}
