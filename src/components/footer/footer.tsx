import config from '@config'
import no from '@text/layout/no.json'
import en from '@text/layout/en.json'
import Image from 'next/image'
import {
    Footer as UibeeFooter,
    loginAddress,
    loginEmail,
    loginCopyright,
    loginSocialLinks,
    type FooterColumn,
} from 'uibee/components'

export default function Footer({ lang }: { lang: Lang }) {
    const text = lang === 'no' ? no : en

    const sites: FooterColumn = {
        heading: text.footer.sites.title,
        items: [
            { label: text.footer.sites.nav.policy, href: '/policy' },
            { label: text.footer.sites.nav.search, href: '/search' },
            { label: text.footer.sites.nav.pwned, href: '/pwned' },
            { label: text.footer.sites.nav.ai, href: '/ai' },
        ],
    }

    return (
        <UibeeFooter
            lang={lang}
            logo={
                <Image
                    src={`${config.url.cdn}/img/logo/logo-tekst-white.svg`}
                    className='block w-full'
                    alt='Login - Linjeforeningen for IT'
                    width={800}
                    height={200}
                />
            }
            sponsor={{
                node: (
                    <a href='https://www.mnemonic.io/' target='_blank' rel='noreferrer'>
                        <Image
                            src={`${config.url.cdn}/img/company/mnemonic-logo_light-nopayoff-2021.svg`}
                            className='block w-full'
                            alt='mnemonic'
                            width={800}
                            height={200}
                        />
                    </a>
                ),
                label: text.footer.sponsor,
            }}
            columns={[sites, loginAddress, loginEmail(config.url.mail)]}
            socialLinks={loginSocialLinks}
            copyright={loginCopyright}
            version={typeof config.version !== 'undefined' ? {
                tag: config.version,
                href: `${config.url.github}/beehive`,
            } : undefined}
        />
    )
}
