import type { Dispatch, JSX, ReactNode, SetStateAction } from 'react'
import clsx from '@utils/clsx'

type TabNavItemProps = {
    id: string
    title: JSX.Element
    activeTab: string
    setActiveTab: Dispatch<SetStateAction<string>>
}

type TabContentProps = {
    id: string
    activeTab: string
    children: ReactNode
}

export function TabNavItem({ id, title, activeTab, setActiveTab }: TabNavItemProps) {
    return (
        <li
            onClick={() => setActiveTab(id)}
            className={clsx(
                'group w-full list-none overflow-hidden rounded-(--border-radius)',
                'bg-(--color-bg-surface) shadow-(--container-shadow)',
                'transition-all duration-200 hover:cursor-pointer',
                activeTab === id && 'active'
            )}
        >
            <div
                className={clsx(
                    'm-auto block h-full w-fit border-b-[0.3rem] border-solid border-(--color-bg-surface)',
                    'p-0 text-(--color-text-discreet) transition duration-200',
                    '*:block *:w-full *:max-w-16 500px:*:max-w-24',
                    'group-hover:text-(--color-text-main)',
                    activeTab === id && 'tabs_nav-title--active border-(--color-primary) text-(--color-text-main)'
                )}
            >
                {title}
            </div>
        </li>
    )
}

export function TabContent({ id, activeTab, children }: TabContentProps) {
    if (activeTab !== id) {
        return null
    }

    return (
        <div className='rounded-(--border-radius) bg-(--color-bg-surface)
            p-[.1rem_1rem_2rem_1rem] shadow-(--container-shadow)
            600px:p-[2rem_2rem_2rem_3rem] 800px:p-[2rem_3rem_3rem_3rem]
            1200px:m-[0_2rem] 1200px:p-[2rem_5rem_3rem_5rem]'
        >
            {children}
        </div>
    )
}
