import { proxyAiRequest } from '../shared'

export async function GET(request: Request) {
    const url = new URL(request.url)
    const query = url.search || ''

    return proxyAiRequest(`/ai/conversations${query}`)
}

export async function POST(request: Request) {
    return proxyAiRequest('/ai/conversations', {
        method: 'POST',
        body: await request.text(),
    })
}
