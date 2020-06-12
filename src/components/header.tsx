import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'

const navItems: { label: string; page?: string; link?: string }[] = [
  { label: 'Home', page: '/' },
  { label: 'Blog', page: '/blog' },
  { label: 'Contact', page: '/contact' },
  { label: 'Source Code', link: 'https://github.com/ijjk/notion-blog' },
]

const ogImageUrl = 'https://notion-blog.now.sh/og-image.png'

export default ({ titlePre = '' }) => {
  const { pathname } = useRouter()

  return (
    <header>
      <Head>
        <title>{titlePre ? `${titlePre} |` : ''} My Notion Blog</title>
        <meta name="Steve Klabnik" content="Steve Klabnik's personal website" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS Feed for steveklabnik.com"
          href="/atom.rss"
        />
      </Head>
      <ul>
        {navItems.map(({ label, page, link }) => (
          <li key={label}>
            {page ? (
              <Link href={page}>
                <a className={pathname === page ? 'active' : undefined}>
                  {label}
                </a>
              </Link>
            ) : (
              <Link href={link}>{label}</Link>
            )}
          </li>
        ))}
      </ul>
    </header>
  )
}
