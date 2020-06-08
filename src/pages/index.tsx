import Link from 'next/link'
import Header from '../components/header'
import sharedStyles from '../styles/shared.module.css'

export default () => (
  <>
    <section className="container">
      <h1 className={sharedStyles.title}>Steve Klabnik's personal website</h1>
      <h2>About</h2>
      <p>
        Hi there! <code>/me waves</code>. I'm Steve.
      </p>
      <p>
        I'm generally known on the internet for tweeting way too much, speaking
        at conferences, writing books, open source work, and having radical
        politics.
      </p>
      <h2>Links</h2>
      <ul>
        <li>
          <Link href="mailto:steve@steveklabnik.com">Email</Link>
        </li>
        <li>
          <Link href="https://twitter.com/steveklabnik">Twitter</Link>
        </li>
        <li>
          <Link href="https://github.com/steveklabnik">GitHub</Link>
        </li>
        <li>
          <Link href="/blog">Writing</Link> (2020-present)
        </li>
        <li>
          "<Link href="https://words.steveklabnik.com">Words</Link>" a blog by
          me (2012-2020)
        </li>
        <li>
          "
          <Link href="https://blog.steveklabnik.com">Literate Programming</Link>
          " a blog by me (2009-2015)
        </li>
      </ul>
    </section>
  </>
)
