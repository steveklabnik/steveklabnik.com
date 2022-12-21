---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Removing Turbolinks from Rails 4"
pubDate: 2013-06-25
blog: literate-programming
---


If you don’t want to use Turbolinks with your Rails 4 application, it’s easy! Just do this:

1. Remove the `gem 'turbolinks'` line from your Gemfile.
2. Remove the `//= require turbolinks` from your `app/assets/javascripts/application.js`.
3. Remove the two `"data-turbolinks-track" => true` hash key/value pairs from your `app/views/layouts/application.html.erb`.

Done!
