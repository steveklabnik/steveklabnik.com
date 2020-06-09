import Link from 'next/link'
import Header from '../components/header'

export default () => (
  <>
    <header className="container header">
      <h1 className="title">Hi there!</h1>
      <h2 className="subtitle">I'm Steve.</h2>
    </header>
    <section className="container">
      <h2>Steve Klabnik, that is.</h2>
      <p>
        You may know me from my work on <a href="https://rust-lang.org">Rust</a>
        , or maybe even the stuff I did with{' '}
        <a href="https://contributors.rubyonrails.org/contributors/steve-klabnik/commits">
          Ruby on Rails
        </a>{' '}
        back in the day.
      </p>
      <p>
        You might have read{' '}
        <Link href="/writing">
          <a>a post I wrote</a>
        </Link>
        , or maybe even a chapter or two of{' '}
        <em>
          <a href="https://nostarch.com/Rust">The Rust Programming Language</a>
        </em>
        .
      </p>
      <p>
        Maybe you saw a conference talk of mine, or saw one of my (too many,
        frankly) <a href="https://twitter.com/steveklabnik">tweets</a>.
      </p>
      <p>
        It's also possible that you've used some code I've developed{' '}
        <a href="https://github.com/steveklabnik">on GitHub</a>.
      </p>
    </section>
  </>
)
