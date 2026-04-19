import { proxyAiRequest } from '../../../shared'

export async function POST(
    _: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    return proxyAiRequest(`/ai/conversations/${id}/share`, {
        method: 'POST',
    })
}
