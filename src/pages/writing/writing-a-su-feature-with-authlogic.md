---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Writing a su feature with Authlogic"
pubDate: 2010-03-05
blog: literate-programming
---


Sometimes, when responding to a support request, it’s nice to see what your users see. At the same time, you don’t want to ask your users for their passwords, out of respect for their privacy. So what do you do?

Well, *NIX systems have a program called su. Here’s what man su has to say:

```
NAME
       su - run a shell with substitute user and group IDs

SYNOPSIS
       su [OPTION]... [-] [USER [ARG]...]

DESCRIPTION
       Change the effective user id and group id to that of USER.
```

su can be thought of as “substitute user” or “switch user.” It’s a command system administrators use to assume the identity of one of their users, or a way for someone with the root password on the system to switch to the root account itself. So how can we incorporate this into a web application?

Well, we want to first log ourselves out, and then log in as the user we’re su-ing to. That’s it. The tricky part, however, comes in when we’re logging in: as we said before, we don’t want to ask for their password. Luckily, Authlogic provides a way to create our UserSession object directly from a User object by just passing it to create.

This lets us write a controller method to do this pretty easily:

```ruby
def su
  @user = User.find params[:id]
  current_user_session.destroy
  UserSession.create!(@user)
  flash[:notice] = "You've been su-d to that user."
  redirect_to dashboard_path
end
```

Add in a route:

```ruby
map.admin_su "/admin/su/:id", :controller => "admin", :action => "su"
```

And to a view somewhere in your administrative tools:

```ruby
<%= link_to "log in as this user", admin_su_path(@user) %>
```

And we’re good to go!

One last thing about this, though: You don’t want to let anyone who’s not an administrator do this, for obvious reasons. My administrative controllers always include a block like this:

```ruby
access_control do
  allow :admin
end
```

acl9 makes this really easy, but it’s really important.

So there you have it. Easy as pie.

EDIT: This post made the Rails subreddit, and [brettbender posted his code](http://www.reddit.com/r/rails/comments/cb0da/writing_a_su_feature_with_authlogic/c0rf26w) to get you back to admin.
