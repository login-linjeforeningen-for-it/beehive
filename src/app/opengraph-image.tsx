import { ImageResponse } from 'next/og'

export const alt = 'Login - Linjeforeningen for IT'
export const size = {
    width: 1200,
    height: 630,
}
export const contentType = 'image/png'

const baseUrl = 'https://login.no'
const wideBannerSrc = new URL('/img/logo/logo-tekst-white.svg', baseUrl).toString()

export default function OpenGraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    alignItems: 'center',
                    background: 'radial-gradient(circle at 20% 20%, #2a2a2a 0%, #171717 55%, #0f0f0f 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    justifyContent: 'center',
                    padding: '72px',
                    width: '100%',
                }}
            >
                <img
                    src={wideBannerSrc}
                    alt='Login Wide Banner'
                    width={980}
                    height={386}
                    style={{
                        objectFit: 'contain',
                    }}
                />
            </div>
        ),
        {
            ...size,
        },
    )
}
