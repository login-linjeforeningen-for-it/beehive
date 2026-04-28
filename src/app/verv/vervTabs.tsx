'use client'

import { useState } from 'react'
import { TabContent, TabNavItem } from '@components/tabs/tabs'
import LogChamp from '@components/logchamp/logChamp'
import EvntkomLogo from '@components/svg/committeelogos/evntkomLogo'
import BedkomLogo from '@components/svg/committeelogos/bedkomLogo'
import TekkomLogo from '@components/svg/committeelogos/tekkomLogo'
import CtfkomLogo from '@components/svg/committeelogos/ctfkomLogo'
import SatkomLogo from '@components/svg/committeelogos/satkomLogo'
import BarkomLogo from '@components/svg/committeelogos/barkomLogo'
import PrLogo from '@components/svg/committeelogos/prLogo'
import config from '@config'
import en from '@text/verv/en.json'
import no from '@text/verv/no.json'
import board_no from '@text/board/no.json'
import board_en from '@text/board/en.json'
import data from '@text/board/data.json'
export default function VervTabs({ lang }: { lang: Lang }) {
    const [activeTab, setActiveTab] = useState('evnt')
    const text = lang === 'en' ? { ...en, ...board_en } : { ...no, ...board_no }


    return (
        <div className='mb-8 800px:mb-20 tabs page-section--without-gaps'>
            <ul className='grid grid-cols-4 gap-2 p-2 450px:grid-cols-7 1200px:px-8'>
                <TabNavItem title={<EvntkomLogo />} id='evnt' activeTab={activeTab} setActiveTab={setActiveTab}/>
                <TabNavItem title={<TekkomLogo />} id='tek' activeTab={activeTab} setActiveTab={setActiveTab}/>
                <TabNavItem title={<BedkomLogo />} id='bed' activeTab={activeTab} setActiveTab={setActiveTab}/>
                <TabNavItem title={<CtfkomLogo />} id='ctf' activeTab={activeTab} setActiveTab={setActiveTab}/>
                <TabNavItem title={<SatkomLogo />} id='sat' activeTab={activeTab} setActiveTab={setActiveTab}/>
                <TabNavItem title={<PrLogo />} id='pr' activeTab={activeTab} setActiveTab={setActiveTab}/>
                <TabNavItem title={<BarkomLogo />} id='bar' activeTab={activeTab} setActiveTab={setActiveTab}/>
            </ul>
            <TabContent id='evnt' activeTab={activeTab}>
                <h3 className='heading-3 flex items-center gap-2'>
                    <i className='logfont-evntkom text-4xl' /> {text.committeeSection.evntkom.title}
                </h3>
                <div className='grid grid-cols-1 gap-12 items-start 800px:grid-cols-[auto_11rem]'>
                    <div className='max-w-180'>
                        <p className='p-highlighted'>{text.committeeSection.evntkom.intro}</p>
                        <p className='p-regular' dangerouslySetInnerHTML={{__html: text.committeeSection.evntkom.body}} />
                    </div>
                    <LogChamp
                        img={`${config.url.portrait}/${data.evntkomLeader.img}`}
                        name={data.evntkomLeader.name}
                        position={text.evntkomLeader.title}
                        discord={data.evntkomLeader.dctag}
                        discordLink={data.evntkomLeader.dclink}
                    />
                </div>
            </TabContent>
            <TabContent id='tek' activeTab={activeTab}>
                <h3 className='heading-3 flex items-center gap-2'>
                    <i className='logfont-tekkom text-4xl' /> {text.committeeSection.tekkom.title}
                </h3>
                <div className='grid grid-cols-1 gap-12 items-start 800px:grid-cols-[auto_11rem]'>
                    <div className='max-w-180'>
                        <p className='p-highlighted'>{text.committeeSection.tekkom.intro}</p>
                        <p className='p-regular'>{text.committeeSection.tekkom.body}</p>
                    </div>
                    <LogChamp
                        img={`${config.url.portrait}/${data.tekkomLeader.img}`}
                        name={data.tekkomLeader.name}
                        position={text.tekkomLeader.title}
                        discord={data.tekkomLeader.dctag}
                        discordLink={data.tekkomLeader.dclink}
                    />
                </div>
            </TabContent>
            <TabContent id='bed' activeTab={activeTab}>
                <h3 className='heading-3 flex items-center gap-2'>
                    <i className='logfont-bedkom text-4xl' /> {text.committeeSection.bedkom.title}
                </h3>
                <div className='grid grid-cols-1 gap-12 items-start 800px:grid-cols-[auto_11rem]'>
                    <div className='max-w-180'>
                        <p className='p-highlighted'>{text.committeeSection.bedkom.intro}</p>
                        <p className='p-regular'>{text.committeeSection.bedkom.body}</p>
                    </div>
                    <LogChamp
                        img={`${config.url.portrait}/${data.bedkomLeader.img}`}
                        name={data.bedkomLeader.name}
                        position={text.bedkomLeader.title}
                        discord={data.bedkomLeader.dctag}
                        discordLink={data.bedkomLeader.dclink}
                    />
                </div>
            </TabContent>
            <TabContent id='ctf' activeTab={activeTab}>
                <h3 className='heading-3 flex items-center gap-2'>
                    <i className='logfont-ctfkom text-4xl' /> {text.committeeSection.ctfkom.title}
                </h3>
                <div className='grid grid-cols-1 gap-12 items-start 800px:grid-cols-[auto_11rem]'>
                    <div className='max-w-180'>
                        <p className='p-highlighted'>{text.committeeSection.ctfkom.intro}</p>
                        <p className='p-regular' dangerouslySetInnerHTML={{__html: text.committeeSection.ctfkom.body}}/>
                    </div>
                    <LogChamp
                        img={`${config.url.portrait}/${data.ctfkomLeader.img}`}
                        name={data.ctfkomLeader.name}
                        position={text.ctfkomLeader.title}
                        discord={data.ctfkomLeader.dctag}
                        discordLink={data.ctfkomLeader.dclink}
                    />
                </div>
            </TabContent>
            <TabContent id='sat' activeTab={activeTab}>
                <h3 className='heading-3 flex items-center gap-2'>
                    <i className='logfont-satkom-filled text-4xl' /> {text.committeeSection.satkom.title}
                </h3>
                <div className='grid grid-cols-1 gap-12 items-start 800px:grid-cols-[auto_11rem]'>
                    <div className='max-w-180'>
                        <p className='p-highlighted' dangerouslySetInnerHTML={{__html: text.committeeSection.satkom.intro}} />
                        <p className='p-regular'>{text.committeeSection.satkom.body}</p>
                    </div>
                    <LogChamp
                        img={`${config.url.portrait}/${data.satkomLeader.img}`}
                        name={data.satkomLeader.name}
                        position={text.satkomLeader.title}
                        discord={data.satkomLeader.dctag}
                        discordLink={data.satkomLeader.dclink}
                    />
                </div>
            </TabContent>
            <TabContent id='pr' activeTab={activeTab}>
                <h3 className='heading-3 flex items-center gap-2'>
                    <i className='logfont-pr text-4xl' /> {text.committeeSection.pr.title}
                </h3>
                <div className='grid grid-cols-1 gap-12 items-start 800px:grid-cols-[auto_11rem]'>
                    <div className='max-w-180'>
                        <p className='p-highlighted' dangerouslySetInnerHTML={{__html: text.committeeSection.pr.intro}} />
                        <p className='p-regular'>{text.committeeSection.pr.body}</p>
                    </div>
                    <LogChamp
                        img={`${config.url.portrait}/${data.prLeader.img}`}
                        name={data.prLeader.name}
                        position={text.prLeader.title}
                        discord={data.prLeader.dctag}
                        discordLink={data.prLeader.dclink}
                    />
                </div>
            </TabContent>
            <TabContent id='bar' activeTab={activeTab}>
                <h3 className='heading-3 flex items-center gap-2'>
                    <i className='logfont-barkom text-4xl' /> {text.committeeSection.barkom.title}
                </h3>
                <div className='grid grid-cols-1 gap-12 items-start 800px:grid-cols-[auto_11rem]'>
                    <div className='max-w-180'>
                        <p className='p-highlighted' dangerouslySetInnerHTML={{__html: text.committeeSection.barkom.intro}} />
                        <p className='p-regular'>{text.committeeSection.barkom.body}</p>
                    </div>
                    <LogChamp
                        img={`${config.url.portrait}/${data.barkomLeader.img}`}
                        name={data.barkomLeader.name}
                        position={text.barkomLeader.title}
                        discord={data.barkomLeader.dctag}
                        discordLink={data.barkomLeader.dclink}
                    />
                </div>
            </TabContent>
        </div>
    )
}
