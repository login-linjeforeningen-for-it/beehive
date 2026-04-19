import { proxyAiRequest } from '../../../shared'

export async function POST(
    _: Request,
    { params }: { params: Promise<{ token: string }> }
) {
    const { token } = await params
    return proxyAiRequest(`/ai/shared/${token}/copy`, {
        method: 'POST',
    })
}
