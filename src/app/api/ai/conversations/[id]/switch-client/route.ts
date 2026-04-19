import { proxyAiRequest } from '../../../shared'

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    return proxyAiRequest(`/ai/conversations/${id}/switch-client`, {
        method: 'POST',
        body: await request.text(),
    })
}
