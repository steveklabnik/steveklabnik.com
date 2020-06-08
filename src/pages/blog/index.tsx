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

  return {
    props: {
      preview: preview || false,
      posts,
    },
    unstable_revalidate: 10,
  }
}

export default ({ posts = [], preview }) => {
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
        <h1>My Notion Blog</h1>
        {posts.length === 0 && <p>There are no posts yet</p>}
        {posts.map(post => {
          return (
            <div key={post.Slug}>
              <h3>
                <Link href="/blog/[slug]" as={getBlogLink(post.Slug)}>
                  <div>
                    {!post.Published && <span>Draft</span>}
                    <a>{post.Page}</a>
                  </div>
                </Link>
              </h3>
              {post.Authors.length > 0 && (
                <div className="authors">By: {post.Authors.join(' ')}</div>
              )}
              {post.Date && (
                <div className="posted">Posted: {getDateStr(post.Date)}</div>
              )}
              <p>
                {(!post.preview || post.preview.length === 0) &&
                  'No preview available'}
                {(post.preview || []).map((block, idx) =>
                  textBlock(block, true, `${post.Slug}${idx}`)
                )}
              </p>
            </div>
          )
        })}
      </section>
    </>
  )
}
