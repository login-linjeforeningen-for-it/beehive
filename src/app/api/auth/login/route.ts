import config from '@config'
import { NextRequest } from 'next/server'
import { authLogin } from 'uibee/utils'
import { NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const redirect = request.nextUrl.searchParams.get('redirect')
    const response = await authLogin({
        req: request,
        authURL: config.authentik.auth,
        clientID: config.authentik.clientId,
        redirectPath: config.authPath.callback,
    })

    if (redirect && response instanceof NextResponse) {
        response.cookies.set('redirect_after_login', redirect, {
            path: '/',
            sameSite: 'lax',
        })
    }

    return response
}
