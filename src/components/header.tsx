import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default () => {
  return (
    <header>
      <Head>
        <title>Steve Klabnik's website</title>
        <meta name="Steve Klabnik" content="Steve Klabnik's personal website" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS Feed for steveklabnik.com"
          href="/atom.rss"
        />
      </Head>
    </header>
  )
}
