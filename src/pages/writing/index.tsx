import Link from 'next/link'

import {
  getBlogLink,
  getDateStr,
  postIsPublished,
} from '../../lib/blog-helpers'
import { textBlock } from '../../lib/notion/renderers'
import getNotionUsers from '../../lib/notion/getNotionUsers'
import getBlogIndex from '../../lib/notion/getBlogIndex'

export async function getStaticProps({ preview }) {
  const postsTable = await getBlogIndex()

  const authorsToGet: Set<string> = new Set()
  const posts: any[] = Object.keys(postsTable)
    .map(slug => {
      const post = postsTable[slug]
      // remove draft posts in production
      if (!preview && !postIsPublished(post)) {
        return null
      }
      post.Authors = post.Authors || []
      for (const author of post.Authors) {
        authorsToGet.add(author)
      }
      return post
    })
    .filter(Boolean)

  const { users } = await getNotionUsers([...authorsToGet])

  posts.map(post => {
    post.Authors = post.Authors.map(id => users[id].full_name)
  })

  let postsByYear = {}

  posts.map(post => {
    let year = new Date(post.Date).getFullYear()
    let array = postsByYear[year]

    if (!array || !array.length) {
      postsByYear[year] = []
    }

    postsByYear[year].push(post)
  })

  return {
    props: {
      preview: preview || false,
      posts: postsByYear,
    },
    unstable_revalidate: 10,
  }
}

export default ({ posts = {}, preview }) => {
  var postsByYear: any[] = Object.entries(posts)
  postsByYear.reverse()

  return (
    <>
      {preview && (
        <div>
          <div>
            <b>Note:</b>
            {` `}Viewing in preview mode{' '}
            <Link href={`/api/clear-preview`}>
              <button>Exit Preview</button>
            </Link>
          </div>
        </div>
      )}
      <section className="container">
        <h1 className="title">Writing</h1>
        {postsByYear.map(year => {
          return (
            <>
              <h2>{year[0]}</h2>
              <ul>
                {year[1].map(post => {
                  return (
                    <li key={post.Slug}>
                      <p>
                        <Link
                          href="/writing/[slug]"
                          as={getBlogLink(post.Slug)}
                        >
                          <a>{post.Page}</a>
                        </Link>
                      </p>
                    </li>
                  )
                })}
              </ul>
            </>
          )
        })}
      </section>
    </>
  )
}
