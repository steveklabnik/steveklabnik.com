---
title: "Contributing to Ruby's documentation"
pubDate: 2011-05-20
blog: literate-programming
---


### Update!

I’m now making it even easier than this: [Read my new post about how I’ll do this for you](/2011/08/22/im-making-it-dead-simple-to-contribute-to-ruby-s-documentation.html). That said, if you want to do it yourself, the following will tell you how.

### Original Article

Ruby 1.9.3 is coming out soon! [drbrain has challenged the Ruby community to improve its documentation](http://blog.segment7.net/2011/05/09/ruby-1-9-3-documentation-challenge), but some people were asking about how to do so. So I made a video!

Some small errata: drbrain has informed me that he should edit the Changelog, not me. So don’t do that. :)

[How to contribute to Ruby’s documentation.](http://vimeo.com/23522731) from [Steve Klabnik](http://vimeo.com/steveklabnik) on [Vimeo](http://vimeo.com/).

If you don’t want to watch me talk about it, here’s the same info, in text:

Getting the Ruby source is pretty easy. You can find it on GitHub, here: [http://github.com/ruby/ruby](http://github.com/ruby/ruby) . Click the “fork” button and clone down your own fork:

```
$ git clone git@github.com:YOURUSERNAME/ruby.git
```

After that’s done, type `cd ruby` and add the main project as an upstream. This will let you keep up-to-date with the latest changes:

```
$ git remote add upstream https://github.com/ruby/ruby.git

$ git fetch upstream
```

Okay! Now that you’re all set up, poke around and find something that needs documented. I like to just look through the source, but you can also look [here](http://segment7.net/projects/ruby/documentation_coverage.txt) for a list of things that have no docs. Documentation is written in rdoc, and I’d check the recent commits that drbrain has been making to guide you in style. [This commit](https://github.com/ruby/ruby/commit/071a678a156dde974d8e470b659c89cb02b07b3b), for example, is a pretty good template. You can also check out the formatting guides [here](http://rdoc.rubyforge.org/RDoc/Markup.html). There’s also [this](http://rdoc.rubyforge.org/RDoc/Parser/Ruby.html) which explains some directives for .rb files and [this](http://rdoc.rubyforge.org/RDoc/Parser/C.html) which handles directives for .c files.

Now that you’ve made a change to the documentation, you can regenerate the docs by using rdoc. First, grab the latest version from rubygems:

$ gem install rdoc

Always best to have the latest tools. Now do this to generate the docs:

```
$ rdoc --o tmpdoc lib/rss*
```

I’m passing it in an output directory with op, since the doc directory is not an rdoc directory. rdoc will complain and refuse to overwrite those files, which is a good thing. I’m also passing in a pattern of what to compile documentation for, compiling all of it takes a few minutes! In this case, I chose to document the rss library.

Now you have a website in rdocout. Open up its index.html, and poke around for what you’ve changed. If it all looks good, you’re ready to make a patch!

```
$ rm -r tmpdoc

$ git add .

$ git commit -m "adding documentation for $SOMETHING"
```

Now, you have two options here. One is to simply push the change up to GitHub, and make a pull request.

```
$ git push origin
```

… aaand pull request. The core Ruby development doesn’t really happen on GitHub though, and so your patch may take a while to get included. If you really want to do it right, submit a patch to RedMine. We’ll use git to make this patch:

```
$ git format-patch HEAD~1
```

This says “make a patch out of the last commit.” It’ll tell you a file name, it should start with 000.

Now, sign up for the Ruby RedMine [here](http://bugs.ruby-lang.org/account/register). Once you’ve clicked the confirmation email, [open a new ticket](http://bugs.ruby-lang.org/projects/ruby-trunk/issues/new), and assign it to Eric Hodel, category DOC, and give it your Ruby version, even though it’s not a big deal here. Click ‘choose file’ and pick your patch, then ‘create and continue’ and BAM! You’re done!

Let’s all pitch in and make this the best documented Ruby release ever! In writing documentation, you might even find some things that you’d like to help improve. ;)
