---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Announcing request_store"
pubDate: 2012-12-17
blog: literate-programming
---


Last night I had some insomnia, so I wrote a gem.

Here it is: [https://github.com/steveklabnik/request_store](https://github.com/steveklabnik/request_store).

TL;DR:

If you’re using `Thread.current` in your Rails app to store global-ish data, don’t do it! If you use Thin or Puma or a threaded web server, it won’t get reset between requests, and you’ll end up with subtle bugs. So do this instead:

```ruby
gem "request_store"
```

and replace

```ruby
Thread.current[:foo] = 1
```

with

```ruby
RequestStore.store[:foo] = 1
```

And things will be peachy keen.

### No Rails?

If you’re not using Rails, `use RequestStore::Middleware` to make it work. If you are using Rails, a Railtie takes care of it for you.
