

import { adjustBrightnessHex, createGradient, isValidHex } from '@/utils/colorManipulation'

export default function DefaultEventBanner({ color, transition = true, className = '' }: ColorTransitionClassNameProps) {

    let gradient = color
    let fillColor = 'white'

    if (isValidHex(color)) {
        gradient = createGradient(color)
        fillColor = adjustBrightnessHex(color, -0.3) || 'white'
    }

    return (
        <div className={`default-banner ${transition ? 'default-banner--transition' : ''} ${className}`} style={{background: gradient}}>
            <svg className='default-banner_svg' viewBox='0 0 500 200' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <rect width='500' height='200'/>
                <g clipPath='url(#clip0_328_310)'>
                    <path fill={fillColor} d='M200 50H206.667V78.3333H200V50Z'/>
                    <path fill={fillColor} d='M228.333 50V56.6667H200V50H228.333Z' />
                    <path fill={fillColor} d='M300 50V56.6667H271.667V50H300Z' />
                    <path fill={fillColor} d='M300 78.3333H293.333V50H300V78.3333Z' />
                    <path fill={fillColor} d='M200 150V143.333H228.333V150H200Z' />
                    <path fill={fillColor} d='M200 121.667H206.667V150H200V121.667Z' />
                    <path fill={fillColor} d='M300 150H293.333V121.667H300V150Z' />
                    <path fill={fillColor} d='M271.667 150V143.333H300V150H271.667Z' />
                    <path fill={fillColor} d='M231.667 68.3333H243.333V131.667H231.667V68.3333Z' />
                    <path fill={fillColor} d='M231.667 120H268.333V131.667H231.667V120Z' />
                </g>
                <clipPath id='clip0_328_310'>
                    <rect width='100' height='100' fill='white' transform='translate(200 50)'/>
                </clipPath>
            </svg>
        </div>
    )
}
