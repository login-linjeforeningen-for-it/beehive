import { getActivity } from '@utils/api'
import MusicPreviewClient from './previewClient'

export default async function MusicPreview({ lang }: { lang: Lang }) {
    const data = await getActivity()

    return <MusicPreviewClient test-id='music' initialData={data} lang={lang} />
}
