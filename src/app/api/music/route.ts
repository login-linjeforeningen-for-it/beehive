import { getSafeActivity } from '@utils/api'
import { NextResponse } from 'next/server'

export async function GET() {
    const data = await getSafeActivity()
    return NextResponse.json(data)
}
