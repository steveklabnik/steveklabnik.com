---
title: "An early Christmas present for you"
pubDate: 2012-12-19
blog: literate-programming
topic: technology
---


Normally, I’m a bit of a grinch. I’ll admit it, I really hate Christmas. It reminds me of all of the worst parts of America: You know, how the baby Jesus commands us to [literally shop until we kill each other](http://www.ajc.com/news/news/crime-law/alleged-shoplifter-dies-after-being-subdued-by-wal/nTFPx/)…

Anyway, today, I was teaching a bunch of brand new Rails devs, and I had to explain the mysterious hidden input that `form_for` generates:

```html
<input name="utf8" type="hidden" value="✔">
```

That, combined with the impending release of Rails 4, made me think about the charming little Snowman that Rails originally had: ☃.

## So?

And what happened, then? Well, in Whoville they say - that @steveklabnik’s small heart grew three sizes that day. So he decided to make you a present:

```ruby
gem install bring_back_snowman
```

Just do it, and your forms will submit `_snowman=☃` to ensure that your data is encoded in UTF-8.

It is configurable, if you prefer something else. Add this to your `application.rb`:

```ruby
config.snowman = {:emoji => "😢"}
```

You may also need to add the ‘magic comment’ at the top of the file:

```ruby
# encoding: UTF-8
```

Please remember that if you don’t use something that’s UTF-8, this won’t actually work to fix the bug.

You can find the [source of bring_back_snowman on GitHub](https://github.com/steveklabnik/bring_back_snowman), of course.

Merry Christmas!
