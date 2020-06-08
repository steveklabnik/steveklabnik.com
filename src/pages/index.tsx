import Link from 'next/link'
import Header from '../components/header'

export default () => (
  <>
    <section className="container">
      <h1 className="title">Steve Klabnik's personal website</h1>
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
          <a href="mailto:steve@steveklabnik.com">Email</a>
        </li>
        <li>
          <a href="https://twitter.com/steveklabnik">Twitter</a>
        </li>
        <li>
          <a href="https://github.com/steveklabnik">GitHub</a>
        </li>
        <li>
          <Link href="/blog">Writing</Link> (2020-present)
        </li>
        <li>
          "<a href="https://words.steveklabnik.com">Words</a>" a blog by me
          (2012-2020)
        </li>
        <li>
          "<a href="https://blog.steveklabnik.com">Literate Programming</a>" a
          blog by me (2009-2015)
        </li>
      </ul>
    </section>
  </>
)
