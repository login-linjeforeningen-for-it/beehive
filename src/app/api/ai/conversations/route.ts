import { proxyAiRequest } from '../shared'

export async function GET() {
    return proxyAiRequest('/ai/conversations')
}

export async function POST(request: Request) {
    return proxyAiRequest('/ai/conversations', {
        method: 'POST',
        body: await request.text(),
    })
}
