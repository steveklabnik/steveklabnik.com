---
title: "Rails has two default stacks"
pubDate: 2013-01-14
blog: words
---


Rails’ greatest strength is “Convention over Configuration.” Basically, Rails makes a ton of default choices for you about how things should be named, where they should go, and other things. This is why working with Rails is so productive for an experienced developer: just follow the Golden Path and everything comes together quickly. It’s second greatest strength is its ‘full stack’ nature: Rails includes everything that you need to get going. It does not attempt to be ‘minimal’ in any way. Put these two things together, and a Rails app makes lots of assumptions about **everything** in your app.

But what happens when a significant number of people don’t use those defaults?

First, let’s talk about the actual default stack. Since [Rails is omakase](http://david.heinemeierhansson.com/2012/rails-is-omakase.html), I’m going to call this the ‘Omakase Stack.’ Roughly, this stack contains:

- ERB for view templates
- MySQL for databases
- MiniTest for testing
- Fat Models, Skinny Controllers

There has been a ‘second default stack’ brewing for a while now. I’m going to call this the “[Prime](http://en.wikipedia.org/wiki/Prime_(symbol)%23Use_in_mathematics.2C_statistics.2C_and_science) stack”. This stack’s approximate choices are:

- Haml for view templates
- PostgreSQL for databases
- Rspec/Cucumber for testing
- Skinny models, controllers, and a service layer

This is great! As David says:

> That doesn’t mean patrons can’t express exceptions. Substitutions are allowed, within reason. So you don’t like test/unit? No problem, bring your own rspec. Don’t care for CoffeeScript as a dessert? Delete a single line from your Gemfile.
> 

A considerable minority uses a stack like this. It’s important that the Prime Stack isn’t exact: you might not use Cucumber at all, for example, or maybe you don’t have a service layer. The important part, though, is that this is the new default you build preferences off of: a big group of people assumes that you don’t use MiniTest, you use Rspec, and the choice is Cukes or Capybara. This creates the ‘secondary default’ effect.

## Dual Stack Ecology

So where’s the beef? Well, before I get into it, I want to make one thing explicit: I am *not* taking a position on which stack, if any, is ‘better.’ I’m not interested, at least in this post, at placing them into any kind of order. That’s for another time. What I want to talk about here is about the effect that a second default stack has on the overall Rails ecosystem.

Looking at history, the Prime Stack was born from the Omakase Stack. A certain group of people noticed that they were changing a significant amount of the stack most of the time, and so the Prime Stack came into existence. Since this is a historical progression, many blog posts got written describing the delta: take “[Waiting for a Factory Girl](http://robots.thoughtbot.com/post/159807023/waiting-for-a-factory-girl)”, for example.

> Here at thoughtbot, we’ve had it with fixtures.
> 

But wait! Then, years later, you get a discussion on how factories are bad. My own “[Why I don’t like factory_girl](http://blog.steveklabnik.com/posts/2012-07-14-why-i-don-t-like-factory_girl)” is an example:

> So that’s what it really boils down to: the convenience of factories has set Rails testing strategies and software design back two years.
> 

Maybe a bit strongly worded. Anyway, the people who have created the Prime Stack also happen to be those who are vocal, blog a lot, and speak at a lot of conferences. Everybody loves a polemic. If I submitted a talk to RailsConf called “Why Fixtures are :metal:” this year, people would assume that I was being sarcastic. People always assume that things are slowly getting better: If the original advice was “use fixtures” and the new advice is “use Factories” and the *newest* advice is “use neither”… there’s no way that the “right answer” is “use fixtures,” right? Isn’t that so 2007?

For those of us who’ve been around Rails for a long time, this discussion is good, and interesting. I was able to search for that Factory Girl post by memory, because I remember reading it when it was posted. I’ve written tons of Rails apps in the past 6ish years, and formed my own opinions on what tools I want to use due to that experience.

But what about someone starting Rails today?

## Beginners lose out

Someone told me earlier today that “Starting Rails today is like starting to watch a soap opera in the 7th season.” Like most witty statements, there’s both truth and falsehood here. But, as a newcomer, how do you pick between the Omakase Stack and the Prime Stack?

This is the crux of the matter for me. If today, you tweeted that you were building a Rails app with fixtures, people would tell you to [Stop It](http://www.youtube.com/watch?v=n-Tej0297wk). I saw it happen this morning. This is again, because a very vocal minority of Rails developers use the Prime Stack, and are really passionate about their choice over the Omakase Stack. That’s great.

The problem is this: it puts a pretty heavy burden on a new developer: they have to learn the Omakase Stack **and** the delta. At the moment when someone is new, and barely knows anything, we throw them into making *more* choices. This is the moment when they’re least likely to be able to properly evaluate which option they need to choose. It’s not just “You’re new to Ruby, now learn Rails,” it’s now “You’re new to Ruby, now learn Rails, and RSpec, and Cucumber, and use this advanced modeling technique that we agree Rails discourages. Oh, and your only help is all these blog posts. Have fun!”

As I said at the beginning of this post, Convention over Configuration is Rails’ greatest strength. So when a new person starts, the first thing we do is tell them to do a bunch of configuration. Any reasonable developer could easily ask “If these options really are so superior, why do I have to include them? And which do I choose? I’m drowning!”

## Helping People Build Better Apps

We all want to write better, more maintainable apps. And many people (including me) are trying to push the state of the art forward in this regard. But we’re leaving the majority in the dust. Rather than trying to push the boundaries by choosing new techniques, maybe we should be helping people get better at existing ones, too. Because we need both approaches. There’s already so much to learn when building a Rails application, adding more gems and techniques to the pile just isn’t going to help.

Once those beginners become intermediate, then they can figure out how new techniques solve the particular pains that they feel while going with the default flow. But skipping straight to the tool that solves my pain without feeling that pain the first place doesn’t help, it just confuses.

Let’s keep pushing those boundaries, but let’s not *require* someone to catch up on a few hundred episodes before they can understand what’s going on.

---

If you read this post previously, the “Omakase Stack” was called the “37signals stack,” but David has pointed out [that even if he didn’t work with 37signals, he’d use this stack, so calling it that would be wrong](https://twitter.com/dhh/status/293108811219230720). I’ve since changed the name.
