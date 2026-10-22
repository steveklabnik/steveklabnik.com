# steveklabnik.com

It's my website.

## RSS subscriptions

`/feed.xml` includes the latest 20 posts, newest first, with full article HTML
and stable permalink GUIDs. Each `/topics/<topic>/feed.xml` includes the latest
20 posts **within that topic**, even when they are older than the main feed's
entries. Topics with fewer than 20 posts include all of them.

Older articles remain available on the website and in the writing/topic
archives. Entries leave the feed as newer ones arrive; a reader subscribing
or backfilling from RSS sees only that recent window. Existing readers control
whether they retain previously downloaded entries. RSS is not a full-history
archive endpoint.

Feeds advertise a 15-minute polling/cache interval. Readers honoring it may
see new articles or corrections up to 15 minutes later. Conditional requests
continue to use Netlify's ETags; full content uses CDATA to reduce XML size.
