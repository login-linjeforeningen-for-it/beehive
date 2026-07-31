export default function BarkomLogo() {
    return (
        <svg className='barkom-logo committee-logo' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
            <text
                x='50'
                y='50'
                textAnchor='middle'
                dominantBaseline='central'
                fontSize='42'
                fontWeight='bold'
                className='fill-(--color-text-disabled) transition duration-200 group-hover:fill-(--color-text-main)
                    group-[.active]:fill-(--color-text-main)'
            >
                Bar
            </text>
        </svg>
    )
}
