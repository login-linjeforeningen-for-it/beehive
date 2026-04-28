import { proxyAiRequest } from '../../../shared'

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    return proxyAiRequest(`/ai/conversations/${id}/transfer`, {
        method: 'POST',
        body: await request.text(),
    })
}
