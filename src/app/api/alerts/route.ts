import { getAlerts } from '@utils/api'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')
    if (!page) {
        return NextResponse.json('Page parameter is required', { status: 400 })
    }
    const data = await getAlerts(page)
    if (typeof data === 'string') {
        return NextResponse.json(data, { status: 400 })
    }
    return NextResponse.json(data)
}
