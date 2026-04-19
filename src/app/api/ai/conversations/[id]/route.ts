import { proxyAiRequest } from '../../shared'

export async function GET(
    _: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    return proxyAiRequest(`/ai/conversations/${id}`)
}

export async function DELETE(
    _: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    return proxyAiRequest(`/ai/conversations/${id}`, {
        method: 'DELETE',
    })
}
