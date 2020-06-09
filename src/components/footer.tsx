import Link from 'next/link'
import Header from '../components/header'

export default () => (
  <>
    <footer className="container">
      <hr />
      <p>
        <Link href="/">
          <a>Home</a>
        </Link>{' '}
        •{' '}
        <Link href="/writing">
          <a>Writing</a>
        </Link>{' '}
        • <a href="mailto:steve@steveklabnik.com">Email</a> •{' '}
        <a href="https://twitter.com/steveklabnik">Twitter</a> •{' '}
        <a href="https://github.com/steveklabnik">GitHub</a>
      </p>
    </footer>
  </>
)
