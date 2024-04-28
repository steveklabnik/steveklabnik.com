---
title: "How to be an open source gardener"
pubDate: 2014-04-14
blog: words
---


I do a lot of work on open source, but my most valuable contributions haven’t been code. Writing a patch is the easiest part of open source. The truly hard stuff is all of the *rest*: bug trackers, mailing lists, documentation, and other management tasks. Here’s some things I’ve learned along the way.

It was RailsConf 2012. I sat in on a panel discussion, and the number of issues open on [rails/rails](https://github.com/rails/rails) came up. There were about 800 issues at the time, and had been for a while. Inquiring minds wished to know if that number was ever going to drop, and how the community could help. It was brought up that there was an ‘Issues team,’ whose job would be to triage issues. I enthusiastically volunteered.

But what does ‘issue triage’ *mean*, exactly? Well, on a project as large as Rails, there are a ton of issues that are incomplete, stale, need more information… and nobody was tending to them. It’s kind of like a garden: you need someone to pull weeds, and do it often and regularly.

But before we talk about how to pull the weeds, let’s figure out what kind of garden we even have on our hands!

## What are Issues?

The very first thing your project needs to do is to figure out what Issues are supposed to be for. Each project is different. For example, in Rails, we keep Issues strictly for bugs only. Help questions go to Stack Overflow, and new feature discussion and requests go to the rails-core mailing list. For Rust, we have issues for feature requests, meta-issues… everything. For some repositories, closing all of the issues is not feasible, and for others, you’re shooting for zero. (If you don’t believe that this is even possible, check out [Sequel](https://github.com/jeremyevans/sequel/issues). Issues are rarely even open for more than a few days!)

My personal favorite is to follow the Rails way. Ideally, you’d be at zero defects, and you can still have a place to discuss features. But really, having *some* plan is a necessary first step here.

## Regular tending

So how do you tackle 800 issues? The only way I knew how: read all of them. Yep. Here’s what I did: I took a Saturday (and a Sunday), and I went to [the list of open Issues](https://github.com/rails/rails/issues?state=open), then control-clicked on each one in turn to open them in a new tab. Finally, I also control-clicked on page 2. Then I closed this tab. Now I had 31 open tabs: 30 issues, and the next page. I read through the whole issue, including comments. When I got to the last tab, I was ready to repeat the process: open 30 issues, open page 3, click close. Next!

See, people think working on open source is glamorous, but it’s actually not. Working on open source is reading 800 issues over the course of a weekend.

Anyway, once I read all of those issues, I was significantly more informed about the kinds of problems Rails was facing. I had a whole bunch of common questions, comments, and problems.

The next step was to do it all again.

Wait, again? Why? Well, now that I had a handle on things, I could actually take on the task of triage-ing the issues. If I’d tried to do it before I had the context, I might not have seen the duplicate issues, I wouldn’t know what the normal kinds of comments were on issues, I wouldn’t have known some common questions that maintainers had on pull requests, and in general, things would have just been worse.

This time, when reading the issue, I went through a little algorithm to sort them out. It looked a little like this:

1. Is this issue a feature request? If so, copy/paste an answer I wrote that pointed them to the mailing list, and click close.
2. Is this issue a request for help? If so, copy/paste an answer I wrote that pointed them to StackOverflow, and click close.
3. Was this issue for an older version of Rails than is currently supported? If so, copy/paste an answer I wrote that asks if anyone knows if this affects a supported version of Rails.
4. Did this issue provide enough information to reproduce the error? If no, copy/paste an answer I wrote that asks if they can provide a reproduction.
5. If the issue has a reproduction, and it wasn’t on the latest Rails, try it against HEAD. If it still happened, leave a comment that it was still an issue.
6. If we got to this point, this issue was pretty solid. Leave a comment that I had triaged it, and cc the maintainer of that relevant sub-system of Rails, so they could find issues that pertain to the things they work on.

At the same time I did this, I clicked this button on the GitHub interface:

![https://svbtleusercontent.com/e2rhsedvszk54q_small.png](https://svbtleusercontent.com/e2rhsedvszk54q_small.png)

And then set up a Gmail filter to filter all of the emails into their own tag, and to skip my inbox:

![https://svbtleusercontent.com/oyuljxmbfqieia_small.png](https://svbtleusercontent.com/oyuljxmbfqieia_small.png)

Why do this? Well, I didn’t do all 800 immediately. I decided to do one page per day. This kept it a bit more manageable, rather than taking up entire days of my time. I need these emails and filters for the important second part of the process: tending to the garden regularly.

Each morning, before I go to work, I pour a cup of coffee and check my emails. I don’t handle all of them before work, but I made an effort to tackle Rails’ emails first. There would usually be about 20 or 25 new emails each morning, and since it was largely just one new comment, they’d be pretty fast to get through. 15 minutes later, I was back to current on all issues. At lunch, I’d do it again: ten minutes to handle the ten or so emails by lunch, and then, before I’d go to bed, I’d do it again: 15 more minutes to handle the next 20 notifications. Basically, I was spending a little under an hour each day, but by doing it *every* day, it never got out of hand.

Once I got through all of the issues, we were down to more like 600. A whole fourth of the issues shouldn’t even have been open in the first place. Two weeks in is when the next big gain kicked in. Why two weeks? Well, two weeks is the grace period we decided before marking an issue as stale. Why two weeks? Well, that’s kind of arbitrary, but two weeks feels like enough time for someone to respond if they’re actively interested in getting an issue fixed. See, issues often need the help of the reporter to truly fix, as there just isn’t enough information in many bug reports to be able to reproduce and fix the problem.

So, after two weeks, I did one more thing each evening: I filtered by ‘least recently updated,’ and checked to see if any of those issues were stale. You just go back until they say ‘two weeks,’ and then, if you haven’t heard from the reporter, mention that it’s stale and give the issue a close. This is one of the other things I had to kind of let go of when working on a real project: closing an issue isn’t forever. You can always re-open the issue later if it turns out you were wrong. So when trying to get a handle on 800 open issues, I defaulted to ‘guilty until proven innocent.’ Terminate issues with extreme prejudice. Leaving old, inconclusive issues doesn’t help anyone. If it’s a real bug that matters to someone, they’ll come along and help reproduce it. If not, maybe someone else will later.

After a month or two, keeping on it, we got down to 450 or so issues. Members of the core team joked that they had to set up extra email filters from me, because they could tell exactly when I was doing triage. Slow and steady wins the race!

At this point, I knew enough about Rails to actually start writing some patches. And I happened to be familiar with basically every open bug. So it was easy to start picking some of them and try to reproduce them locally. So I’d do that, and then try to write a patch. If I couldn’t, I’d at least upload my reproduction of the issue, and then leave a note on the Issue, pointing to my reproduction. That way, another team member could simply clone my repository and get to it. The only thing better than reproduction instructions are when those instructions say `git clone`.

But I managed to get a few patches in, and then a few more. Doing all of this janitorial work directly led the way towards attaining a commit bit on Rails. It was a long slog at first, but it just got easier the more I did it. A lot of work in open source is this way: it’s really easy once you’ve done it a lot, but is hard for newbies. I’m not yet sure how to tackle this problem…

I’ve since taken this approach on basically every repository I’ve worked on, and it’s worked really well. But it only works if you keep at it: if you don’t tend your garden, you’ll get weeds. I haven’t had as much time for Rails over the last few months, and it’s back to 800 issues again. I’m not sure if these are real issues or not, as I’ve stopped tending. But without someone actively paying attention, it’s only a matter of time before things get unseemly. If you’re looking to help out an open source project, it’s not a glamorous job, but all it takes is a little bit of work, and developing a habit.

(Oh, and I should take a moment to mention [Code Triage](http://www.codetriage.com/) here. It’s super useful, and can also help you find projects that need help.)
