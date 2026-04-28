import { proxyAiRequest } from '../../shared'

export async function POST(request: Request) {
    return proxyAiRequest('/ai/conversations/import-session', {
        method: 'POST',
        body: await request.text(),
    })
}
