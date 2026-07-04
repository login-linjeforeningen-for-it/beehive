import { Fragment } from 'react'
import Link from 'next/link'
import { Folder, FileIcon, Download } from 'lucide-react'
import CopyButton from './CopyButton'

const S3_BASE = 'https://tekkom-assets.s3.de.io.cloud.ovh.net'

type S3File = { key: string; size: number }
type S3Dir = { prefix: string }

async function fetchCategories(): Promise<S3Dir[]> {
    const res = await fetch(`${S3_BASE}/?delimiter=/`, { next: { revalidate: 300 } })
    const xml = await res.text()
    const dirs: S3Dir[] = []
    for (const m of xml.matchAll(/<CommonPrefixes>([\s\S]*?)<\/CommonPrefixes>/g)) {
        const pfx = m[1].match(/<Prefix>(.*?)<\/Prefix>/)?.[1] ?? ''
        if (pfx) dirs.push({ prefix: pfx })
    }
    return dirs
}

async function fetchAllFiles(prefix: string): Promise<S3File[]> {
    const qs = new URLSearchParams({ prefix })
    const res = await fetch(`${S3_BASE}/?${qs.toString()}`, { next: { revalidate: 300 } })
    const xml = await res.text()
    const files: S3File[] = []
    for (const m of xml.matchAll(/<Contents>([\s\S]*?)<\/Contents>/g)) {
        const key = m[1].match(/<Key>(.*?)<\/Key>/)?.[1] ?? ''
        const size = parseInt(m[1].match(/<Size>(.*?)<\/Size>/)?.[1] ?? '0')
        if (key && !key.endsWith('/')) files.push({ key, size })
    }
    return files
}

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function isImage(key: string): boolean {
    return /\.(png|jpg|jpeg|gif|svg|webp|ico)$/i.test(key)
}

const SPLIT_BG: React.CSSProperties = {
    background: 'linear-gradient(135deg, #f0f0f0 50%, #1e1e1e 50%)',
}

function previewStyle(key: string): React.CSSProperties {
    const name = key.toLowerCase()
    if (/-white[.-]/.test(name) || name.endsWith('-white')) return { background: '#1e1e1e' }
    if (/-black[.-]/.test(name) || name.endsWith('-black')) return { background: '#f0f0f0' }
    if (isImage(key)) return SPLIT_BG
    return { background: 'var(--color-bg-surface-sunken)' }
}

function fileName(key: string): string {
    return key.split('/').pop() ?? key
}

function fileExt(key: string): string {
    return key.split('.').pop()?.toLowerCase() ?? ''
}

function categoryLabel(prefix: string): string {
    return prefix.replace(/\/$/, '').split('/').pop() ?? prefix
}

// Groups files by their immediate sub-folder within the category prefix.
// Files directly in the category (no sub-folder) go under key ''.
function groupBySubfolder(files: S3File[], prefix: string): Map<string, S3File[]> {
    const groups = new Map<string, S3File[]>()
    for (const file of files) {
        const relative = file.key.slice(prefix.length)
        const slashIdx = relative.indexOf('/')
        const group = slashIdx === -1 ? '' : relative.slice(0, slashIdx)
        if (!groups.has(group)) groups.set(group, [])
        groups.get(group)!.push(file)
    }
    return groups
}

type PageProps = { searchParams: Promise<{ p?: string }> }

export default async function AssetsPage({ searchParams }: PageProps) {
    const { p = '' } = await searchParams
    const isRoot = p === ''

    if (isRoot) {
        const categories = await fetchCategories()

        return (
            <div className='page-container min-h-[calc(100vh-var(--h-topbar))]'>
                <div className='page-section--normal flex flex-col gap-8 pb-16'>
                    <h1 className='heading-1 heading-1--top-left-corner'>Assets</h1>
                    <p className='p-highlighted'>
                        Logos, images, and marketing material for Login.
                    </p>
                    <div className='grid grid-cols-2 gap-4 500px:grid-cols-3 800px:grid-cols-4'>
                        {categories.map((cat) => (
                            <Link
                                key={cat.prefix}
                                href={`/assets?p=${encodeURIComponent(cat.prefix)}`}
                                className='flex items-center gap-3 rounded-lg p-4
                                    bg-(--color-bg-surface) border border-(--color-border-default)
                                    hover:bg-(--color-bg-surface-raised) transition-colors'
                            >
                                <Folder
                                    className='size-5 shrink-0'
                                    style={{
                                        stroke: 'var(--color-primary)',
                                        fill: 'color-mix(in srgb, var(--color-primary) 15%, transparent)',
                                    }}
                                />
                                <span className='text-(--color-text-main) font-medium text-sm truncate capitalize'>
                                    {categoryLabel(cat.prefix).replace(/-/g, ' ')}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    // Category view — fetch all files recursively, group by sub-folder
    const files = await fetchAllFiles(p)
    const groups = groupBySubfolder(files, p)
    const sortedGroups = Array.from(groups.entries()).sort(([a], [b]) => {
        if (a === 'tekkom') return -1
        if (b === 'tekkom') return 1
        return a.localeCompare(b)
    })
    const categoryName = categoryLabel(p).replace(/-/g, ' ')

    return (
        <div className='page-container min-h-[calc(100vh-var(--h-topbar))]'>
            <div className='page-section--normal flex flex-col gap-8 pb-16'>

                {/* Header + breadcrumb */}
                <h1 className='heading-1 heading-1--top-left-corner capitalize'>{categoryName}</h1>
                <nav className='flex items-center gap-2 text-sm text-(--color-text-regular)'>
                    <Link href='/assets' className='hover:text-(--color-primary) transition-colors'>
                        Assets
                    </Link>
                    <Fragment>
                        <span className='opacity-40'>/</span>
                        <span className='text-(--color-text-main) capitalize'>{categoryName}</span>
                    </Fragment>
                </nav>

                {/* File groups */}
                {sortedGroups.map(([group, groupFiles]) => (
                    <section key={group} className='flex flex-col gap-4'>
                        {group && (
                            <h2 className='heading-2 capitalize'>{group.replace(/-/g, ' ')}</h2>
                        )}
                        <div className='grid grid-cols-2 gap-4 500px:grid-cols-3 800px:grid-cols-4'>
                            {groupFiles.map((file) => {
                                const url = `${S3_BASE}/${file.key}`
                                const name = fileName(file.key)
                                const ext = fileExt(file.key)
                                const img = isImage(file.key)

                                return (
                                    <div
                                        key={file.key}
                                        className='flex flex-col rounded-lg overflow-hidden
                                            bg-(--color-bg-surface) border border-(--color-border-default)'
                                    >
                                        {/* Preview */}
                                        <div
                                            className='relative flex items-center justify-center aspect-video'
                                            style={previewStyle(file.key)}
                                        >
                                            {img ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={url}
                                                    alt={name}
                                                    className='max-h-28 max-w-full object-contain p-4'
                                                />
                                            ) : (
                                                <FileIcon className='size-10 opacity-30' />
                                            )}
                                            {ext && (
                                                <span className='absolute top-2 right-2 px-1.5 py-0.5 rounded
                                                    text-[10px] font-mono font-bold uppercase leading-none
                                                    bg-black/50 text-white'>
                                                    {ext}
                                                </span>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className='flex flex-col gap-2 p-3'>
                                            <p
                                                className='text-(--color-text-main) text-sm font-medium truncate'
                                                title={name}
                                            >
                                                {name}
                                            </p>
                                            <p className='text-(--color-text-regular) text-xs'>
                                                {formatSize(file.size)}
                                            </p>
                                            <div className='flex gap-2 pt-1'>
                                                <a
                                                    href={url}
                                                    download={name}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    className='flex flex-1 items-center justify-center gap-1.5
                                                        text-xs font-medium py-1.5 px-2 rounded transition-all
                                                        bg-(--color-btn-secondary-bg) text-(--color-text-main)
                                                        hover:brightness-95'
                                                >
                                                    <Download className='size-3.5' />
                                                    Download
                                                </a>
                                                <CopyButton url={url} />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                ))}

                {files.length === 0 && (
                    <p className='p-regular'>This category is empty.</p>
                )}
            </div>
        </div>
    )
}
