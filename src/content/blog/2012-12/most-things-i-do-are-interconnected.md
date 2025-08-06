---
title: "Most things I do are interconnected"
pubDate: 2012-12-28
blog: words
---


I work on a *lot* of different things. Sometimes I get asked [how I find the time](http://words.steveklabnik.com/how-do-you-find-the-time), but there’s another aspect not related to time management: most of my projects build off of each other.

## Draper and RequestStore

[This issue](https://github.com/drapergem/draper/issues/390) got filed in Draper. What Draper does isn’t important, but it did have this code in it:

```ruby
def self.current
  Thread.current[:current_view_context] ||= build_view_context
end

def self.current=(context)
  Thread.current[:current_view_context] = context
end
```

Basically, storing stuff in a `Thread` local variable. This is great, normally, except when you run one of those new hot servers like Thin or Puma. They have a different concurrency model, and so while you’d normally expect this `Thread` local to be `nil` on each request, it will persist between requests.

I *could* have just fixed this bug in Draper, but I figured that it might be useful to someone else, so I whipped up a little gem to do it: [request_store](https://rubygems.org/gems/request_store), and used the gem in Draper. I tweeted about it.

> @steveklabnik Holy shit. I love you.

— Dominic Dagradi (@dddagradi) December 17, 2012
> 

Turns out that one of my friends had *exactly* this problem, and wasn’t sure how to solve it. Now a bunch of people at Heroku are using my gem, and it’s helping them in their work.

I wouldn’t have bothered building it if it didn’t scratch my itch, but by making it easy for other people to use, I helped them scratch their itch too.

## Rust for Rubyists and Designing Hypermedia APIs

I’ve been working on a new iteration of [Designing Hypermedia APIs](http://designinghypermediaapis.com/) that is more linear and like a traditional book. The issue is that I’d built the entire platform for the project myself, and now spitting out ePUB and PDFs would be hard.

Enter [Rust for Rubyists](http://www.rustforrubyists.com/): I’d been learning Rust, and there are very few docs since it’s a new programming language. I had also seen Zed Shaw present at RuPy recently, and he showed off [Orkestrix](http://orkestrix.org/), which let him generate a site and a book for music stuff.

So I decided to write up what I’d learned as [a tutorial on programming in Rust](http://www.rustforrubyists.com/), and built it using the Orkestrix gear. I also tried out [DPD](http://getdpd.com/) after seeing others use it. It’s only been up for two days, but I really like the combo, and today I pushed my first update out to the people who bought a copy already.

This has given me the confidence that the tooling process is good enough to use for DHAs, so I’ll be doing all of that soon.

## Rails and Resque

I started working on Resque because we needed to have a few production implementations of the new ActiveQueue system going before Rails 4 was released. I was already working on Rails to help get 4 out the door, and Terence was obviously swamped by all the things he works on. So helping out with Resque would help out with Rails.

## bring_back_snowman and configuration

When I don’t know how to do something, I often look at a gem that does what I’m interested in doing, and copy how it does it. I had never built a gem that allowed you to configure it using the `config.something` pattern before, so I peeked at a few gems to learn how.

I had also been thinking a lot about the Rails 4 release, and what was new since Rails 3. I was teaching a new batch of people Rails with [Jumpstart Lab](http://jumpstartlab.com/), my employer, and was explaining why we have `form_for` generate a ✔. This gave me an idea: What if you could configure what Rails used in this case?

So I built [bring_back_snowman](https://github.com/steveklabnik/bring_back_snowman). It’s not very *useful*, but it is cute and fun, and more importantly, [it serves as a concise example of how to build a configurable option into your gems](https://github.com/steveklabnik/bring_back_snowman/blob/master/lib/bring_back_snowman.rb#L5-L13). I can always look at that code if I forget how this works, or point others to it if they ask.

## Many, many more

These are just the most recent examples I can think of. I’d really encourage you to try this sometime: if you want to learn something, make a new little project. Make it small. Make it focused. Make it help you out with something bigger.

Pretty soon, you’ll feel mega-productive too.
