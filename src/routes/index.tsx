import { createFileRoute } from '@tanstack/react-router'
import { GuidePage } from '../modules/guide/GuidePage'
import guideCss from '../modules/guide/styles.css?url'

export const Route = createFileRoute('/')({
  head: () => ({
    links: [{ rel: 'stylesheet', href: guideCss }],
  }),
  component: GuidePage,
})
