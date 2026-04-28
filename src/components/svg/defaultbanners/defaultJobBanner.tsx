

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
                <g transform='translate(196 50) scale(4.5)'>
                    <circle cx='12' cy='12' r='0.5' stroke={fillColor} strokeWidth='1' fill='none'/>
                    <path stroke={fillColor} strokeWidth='1.75' d='M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2'/>
                    <path stroke={fillColor} strokeWidth='1.75' d='M22 13a18.15 18.15 0 0 1-20 0'/>
                    <rect stroke={fillColor} strokeWidth='1.75' width='20' height='14' x='2' y='6' rx='2'/>
                </g>
            </svg>
        </div>
    )
}
