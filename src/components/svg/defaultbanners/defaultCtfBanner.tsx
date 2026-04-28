/* eslint-disable @stylistic/max-len */
import { adjustBrightnessHex, createGradient, isValidHex } from '@/utils/colorManipulation'

export default function DefaultCtfBanner({ color, transition = true, className = '' }: ColorTransitionClassNameProps) {

    let gradient = color
    let fillColor = 'white'

    if (isValidHex(color)) {
        gradient = createGradient(color)
        fillColor = adjustBrightnessHex(color, -0.3) || 'white'
    }

    return (
        <div className={`default-banner ${transition ? 'default-banner--transition' : ''} ${className}`} style={{background: gradient}}>
            <svg className='default-banner_svg' viewBox='0 0 500 200' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path fill={fillColor} fillRule='evenodd' clipRule='evenodd' d='M209.755 64H251.845L260.245 106H218.155L209.755 64ZM215.245 68.5L221.845 101.5H254.755L248.155 68.5H215.245Z' />
                <path fill={fillColor} fillRule='evenodd' clipRule='evenodd' d='M245.755 101.5L247.794 111.691L248.155 113.5H250H287.5H290.245L289.706 110.809L282.206 73.3087L281.845 71.5H280H249.114L250.034 76H278.155L284.755 109H251.845L250.345 101.5H245.755Z' />
                <path fill={fillColor} d='M211 59.5H214L230.5 149.5H227.5L211 59.5Z' />
                <path fill={fillColor} fillRule='evenodd' clipRule='evenodd' d='M208.3 57.25H215.875L233.2 151.75H225.625L208.3 57.25Z' />
                <path fill={fillColor} d='M211.75 59.5C214.235 59.5 216.25 57.4854 216.25 55C216.25 52.5146 214.235 50.5 211.75 50.5C209.265 50.5 207.25 52.5146 207.25 55C207.25 57.4854 209.265 59.5 211.75 59.5Z' />
                <path fill={fillColor} fillRule='evenodd' clipRule='evenodd' d='M205 55C205 51.272 208.022 48.25 211.75 48.25C215.478 48.25 218.5 51.272 218.5 55C218.5 58.728 215.478 61.75 211.75 61.75C208.022 61.75 205 58.728 205 55ZM211.75 52.75C210.507 52.75 209.5 53.7573 209.5 55C209.5 56.2427 210.507 57.25 211.75 57.25C212.993 57.25 214 56.2427 214 55C214 53.7573 212.993 52.75 211.75 52.75Z' />
            </svg>
        </div>
    )
}
