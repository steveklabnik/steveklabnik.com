---
title: "How to not rely on rubygems.org for development"
pubDate: 2013-01-31
blog: words
---


Due to the recent [situation with Rubygems.org](https://status.heroku.com/incidents/489), a lot of people noticed that they rely on Rubygems.org when deploying. A lot of people advocate [“vendor everything”](http://ryan.mcgeary.org/2011/02/09/vendor-everything-still-applies/), and while that’s one approach, I actually don’t think it’s necessary. I think a lot of people *think* they rely on Rubygems.org more than they actually do, or, at least, aren’t deploying with Bundler correctly. So let’s talk about it.

## Deploying with Bundler

Bundler has a `--deployment` flag to help you deploy code. [Here’s the documentation](http://gembundler.com/v1.2/deploying.html). If you use Bundler, and you don’t use `--deployment` when deploying, you are probably Doing It Wrong. Let’s try a brand new app, and see what happens:

```
$ rails _3.2.11_ new foo --skip-bundle
      create  
      create  README.rdoc
      create  Rakefile
      create  config.ru
      create  .gitignore
      create  Gemfile
      create  app
      create  app/assets/images/rails.png
      create  app/assets/javascripts/application.js
      create  app/assets/stylesheets/application.css
      create  app/controllers/application_controller.rb
      create  app/helpers/application_helper.rb
      create  app/views/layouts/application.html.erb
      create  app/mailers/.gitkeep
      create  app/models/.gitkeep
      create  config
      create  config/routes.rb
      create  config/application.rb
      create  config/environment.rb
      create  config/environments
      create  config/environments/development.rb
      create  config/environments/production.rb
      create  config/environments/test.rb
      create  config/initializers
      create  config/initializers/backtrace_silencers.rb
      create  config/initializers/inflections.rb
      create  config/initializers/mime_types.rb
      create  config/initializers/secret_token.rb
      create  config/initializers/session_store.rb
      create  config/initializers/wrap_parameters.rb
      create  config/locales
      create  config/locales/en.yml
      create  config/boot.rb
      create  config/database.yml
      create  db
      create  db/seeds.rb
      create  doc
      create  doc/README_FOR_APP
      create  lib
      create  lib/tasks
      create  lib/tasks/.gitkeep
      create  lib/assets
      create  lib/assets/.gitkeep
      create  log
      create  log/.gitkeep
      create  public
      create  public/404.html
      create  public/422.html
      create  public/500.html
      create  public/favicon.ico
      create  public/index.html
      create  public/robots.txt
      create  script
      create  script/rails
      create  test/fixtures
      create  test/fixtures/.gitkeep
      create  test/functional
      create  test/functional/.gitkeep
      create  test/integration
      create  test/integration/.gitkeep
      create  test/unit
      create  test/unit/.gitkeep
      create  test/performance/browsing_test.rb
      create  test/test_helper.rb
      create  tmp/cache
      create  tmp/cache/assets
      create  vendor/assets/javascripts
      create  vendor/assets/javascripts/.gitkeep
      create  vendor/assets/stylesheets
      create  vendor/assets/stylesheets/.gitkeep
      create  vendor/plugins
      create  vendor/plugins/.gitkeep

steve at thoth in ~/tmp
$ cd foo

steve at thoth in ~/tmp/foo
$ cat .bundle/config 
cat: .bundle/config: No such file or directory
```

We have no configuration for bundler. Makes sense, we never bundled. If we try to use `--deployment` now, we get an error:

```
steve at thoth in ~/tmp/foo
[1] $ bundle install --deployment                                             ✘
The --deployment flag requires a Gemfile.lock. Please make sure you have checked your Gemfile.lock into version control before deploying.
```

This is because `--deployment` checks the lock. So let’s make one:

```
steve at thoth in ~/tmp/foo
[16] $ bundle                                                                 ✘
Fetching gem metadata from https://rubygems.org/...........
Fetching gem metadata from https://rubygems.org/..
Using rake (10.0.3) 
Using i18n (0.6.1) 
Using multi_json (1.5.0) 
Using activesupport (3.2.11) 
Using builder (3.0.4) 
Using activemodel (3.2.11) 
Using erubis (2.7.0) 
Using journey (1.0.4) 
Using rack (1.4.4) 
Using rack-cache (1.2) 
Using rack-test (0.6.2) 
Using hike (1.2.1) 
Using tilt (1.3.3) 
Using sprockets (2.2.2) 
Using actionpack (3.2.11) 
Using mime-types (1.19) 
Using polyglot (0.3.3) 
Using treetop (1.4.12) 
Using mail (2.4.4) 
Using actionmailer (3.2.11) 
Using arel (3.0.2) 
Using tzinfo (0.3.35) 
Using activerecord (3.2.11) 
Using activeresource (3.2.11) 
Using bundler (1.3.0.pre.5) 
Using coffee-script-source (1.4.0) 
Using execjs (1.4.0) 
Using coffee-script (2.2.0) 
Installing rack-ssl (1.3.3) 
Using json (1.7.6) 
Using rdoc (3.12) 
Using thor (0.17.0) 
Using railties (3.2.11) 
Using coffee-rails (3.2.2) 
Using jquery-rails (2.2.0) 
Using rails (3.2.11) 
Using sass (3.2.5) 
Using sass-rails (3.2.6) 
Using sqlite3 (1.3.7) 
Using uglifier (1.3.0) 
Your bundle is complete! Use `bundle show [gemname]` to see where a bundled gem is installed.
```

This of course does hit the network, and does all the usual things. Your application normally has a lock already and has it checked in. We still don’t have a config:

```
steve at thoth in ~/tmp/foo
$ cat .bundle/config
cat: .bundle/config: No such file or directory
```

So, this is the state our app would be in before deploying. At this point, it’s just like we did a `git pull` or an `scp` to our server. So let’s install for deployment:

```
steve at thoth in ~/tmp/foo
$ bundle install --deployment
Fetching gem metadata from https://rubygems.org/.........
Fetching gem metadata from https://rubygems.org/..
Installing rake (10.0.3) 
Installing i18n (0.6.1) 
Installing multi_json (1.5.0) 
Installing activesupport (3.2.11) 
Installing builder (3.0.4) 
Installing activemodel (3.2.11) 
Installing erubis (2.7.0) 
Installing journey (1.0.4) 
Installing rack (1.4.4) 
Installing rack-cache (1.2) 
Installing rack-test (0.6.2) 
Installing hike (1.2.1) 
Installing tilt (1.3.3) 
Installing sprockets (2.2.2) 
Installing actionpack (3.2.11) 
Installing mime-types (1.19) 
Installing polyglot (0.3.3) 
Installing treetop (1.4.12) 
Installing mail (2.4.4) 
Installing actionmailer (3.2.11) 
Installing arel (3.0.2) 
Installing tzinfo (0.3.35) 
Installing activerecord (3.2.11) 
Installing activeresource (3.2.11) 
Installing coffee-script-source (1.4.0) 
Installing execjs (1.4.0) 
Installing coffee-script (2.2.0) 
Installing rack-ssl (1.3.3) 
Installing json (1.7.6) 
Installing rdoc (3.12) 
Installing thor (0.17.0) 
Installing railties (3.2.11) 
Installing coffee-rails (3.2.2) 
Installing jquery-rails (2.2.0) 
Using bundler (1.3.0.pre.5) 
Installing rails (3.2.11) 
Installing sass (3.2.5) 
Installing sass-rails (3.2.6) 
Installing sqlite3 (1.3.7) 
Installing uglifier (1.3.0) 
Your bundle is complete! It was installed into ./vendor/bundle
Post-install message from rdoc:
Depending on your version of ruby, you may need to install ruby rdoc/ri data:

<= 1.8.6 : unsupported
 = 1.8.7 : gem install rdoc-data; rdoc-data --install
 = 1.9.1 : gem install rdoc-data; rdoc-data --install
>= 1.9.2 : nothing to do! Yay!

```

We still hit Rubygems.org, but note now that it said “Installing” rather than using. That’s because we now have everything vendored:

```
$ cat .bundle/config
---
BUNDLE_FROZEN: '1'
BUNDLE_PATH: vendor/bundle
BUNDLE_DISABLE_SHARED_GEMS: '1'

steve at thoth in ~/tmp/foo
$ ls vendor/bundle/ruby/1.9.1
bin            cache          doc            gems           specifications

steve at thoth in ~/tmp/foo
$ ls vendor/bundle/ruby/1.9.1/gems
actionmailer-3.2.11        multi_json-1.5.0
actionpack-3.2.11          polyglot-0.3.3
activemodel-3.2.11         rack-1.4.4
activerecord-3.2.11        rack-cache-1.2
activeresource-3.2.11      rack-ssl-1.3.3
activesupport-3.2.11       rack-test-0.6.2
arel-3.0.2                 rails-3.2.11
builder-3.0.4              railties-3.2.11
coffee-rails-3.2.2         rake-10.0.3
coffee-script-2.2.0        rdoc-3.12
coffee-script-source-1.4.0 sass-3.2.5
erubis-2.7.0               sass-rails-3.2.6
execjs-1.4.0               sprockets-2.2.2
hike-1.2.1                 sqlite3-1.3.7
i18n-0.6.1                 thor-0.17.0
journey-1.0.4              tilt-1.3.3
jquery-rails-2.2.0         treetop-1.4.12
json-1.7.6                 tzinfo-0.3.35
mail-2.4.4                 uglifier-1.3.0
mime-types-1.19
```

Okay! Neat. So we’ve Vendored Everything… what happens if we `bundle` again?

```
steve at thoth in ~/tmp/foo
$ bundle
Using rake (10.0.3) 
Using i18n (0.6.1) 
Using multi_json (1.5.0) 
Using activesupport (3.2.11) 
Using builder (3.0.4) 
Using activemodel (3.2.11) 
Using erubis (2.7.0) 
Using journey (1.0.4) 
Using rack (1.4.4) 
Using rack-cache (1.2) 
Using rack-test (0.6.2) 
Using hike (1.2.1) 
Using tilt (1.3.3) 
Using sprockets (2.2.2) 
Using actionpack (3.2.11) 
Using mime-types (1.19) 
Using polyglot (0.3.3) 
Using treetop (1.4.12) 
Using mail (2.4.4) 
Using actionmailer (3.2.11) 
Using arel (3.0.2) 
Using tzinfo (0.3.35) 
Using activerecord (3.2.11) 
Using activeresource (3.2.11) 
Using coffee-script-source (1.4.0) 
Using execjs (1.4.0) 
Using coffee-script (2.2.0) 
Using rack-ssl (1.3.3) 
Using json (1.7.6) 
Using rdoc (3.12) 
Using thor (0.17.0) 
Using railties (3.2.11) 
Using coffee-rails (3.2.2) 
Using jquery-rails (2.2.0) 
Using bundler (1.3.0.pre.5) 
Using rails (3.2.11) 
Using sass (3.2.5) 
Using sass-rails (3.2.6) 
Using sqlite3 (1.3.7) 
Using uglifier (1.3.0) 
Your bundle is complete! It was installed into ./vendor/bundle

```

The `bundle` command uses our config settings in `.bundle/config`, which re-runs with the vendored bundle.

## Wait, I thought you said NO to Vendor Everything!!!

Well, here’s the deal: you can Vendor Everything *on your server*, which means that we’re not committing gems into source control, and then pushing that huge mess over the network.

Let’s re-examine `--deployment` in the context of our two strategies: `scp` and `git`.

### git

If you deploy with git, it’s two ways: `ssh`ing into the server and running a `git pull`, or by doing a `git push`. In both cases, you’ll have some sort of post-deploy hook that manages the rest of the deploy.

This scenario is exactly as shown above: just make sure that your first `bundle` on deploy is using `--deployment`, and you’re Good To Go. Each next deploy won’t hit the network. Rock on.

### scp

If you use scp in some way to deploy, then you’re getting a new copy of the application every time, so that bundle full of gems won’t work. You need one more flag: `--path`

```
steve at thoth in ~/tmp/foo
$ rm -rf vendor       

steve at thoth in ~/tmp/foo
$ bundle install --deployment --path ../vendor/bundle
Fetching gem metadata from https://rubygems.org/.........
Fetching gem metadata from https://rubygems.org/..
Installing rake (10.0.3) 
Installing i18n (0.6.1) 
Installing multi_json (1.5.0) 
Installing activesupport (3.2.11) 
Installing builder (3.0.4) 
Installing activemodel (3.2.11) 
Installing erubis (2.7.0) 
Installing journey (1.0.4) 
Installing rack (1.4.4) 
Installing rack-cache (1.2) 
Installing rack-test (0.6.2) 
Installing hike (1.2.1) 
Installing tilt (1.3.3) 
Installing sprockets (2.2.2) 
Installing actionpack (3.2.11) 
Installing mime-types (1.19) 
Installing polyglot (0.3.3) 
Installing treetop (1.4.12) 
Installing mail (2.4.4) 
Installing actionmailer (3.2.11) 
Installing arel (3.0.2) 
Installing tzinfo (0.3.35) 
Installing activerecord (3.2.11) 
Installing activeresource (3.2.11) 
Installing coffee-script-source (1.4.0) 
Installing execjs (1.4.0) 
Installing coffee-script (2.2.0) 
Installing rack-ssl (1.3.3) 
Installing json (1.7.6) 
Installing rdoc (3.12) 
Installing thor (0.17.0) 
Installing railties (3.2.11) 
Installing coffee-rails (3.2.2) 
Installing jquery-rails (2.2.0) 
Using bundler (1.3.0.pre.5) 
Installing rails (3.2.11) 
Installing sass (3.2.5) 
Installing sass-rails (3.2.6) 
Installing sqlite3 (1.3.7) 
Installing uglifier (1.3.0) 
Your bundle is complete! It was installed into /Users/steve/tmp/vendor/bundle
Post-install message from rdoc:
Depending on your version of ruby, you may need to install ruby rdoc/ri data:

<= 1.8.6 : unsupported
 = 1.8.7 : gem install rdoc-data; rdoc-data --install
 = 1.9.1 : gem install rdoc-data; rdoc-data --install
>= 1.9.2 : nothing to do! Yay!

steve at thoth in ~/tmp/foo
$ cat .bundle/config 
---
BUNDLE_FROZEN: '1'
BUNDLE_PATH: ../vendor/bundle
BUNDLE_DISABLE_SHARED_GEMS: '1'

steve at thoth in ~/tmp/foo
$ ls vendor
ls: vendor: No such file or directory

steve at thoth in ~/tmp/foo
[1] $ ls ../vendor                                                            ✘
bundle

steve at thoth in ~/tmp/foo
$ bundle
Using rake (10.0.3) 
Using i18n (0.6.1) 
Using multi_json (1.5.0) 
Using activesupport (3.2.11) 
Using builder (3.0.4) 
Using activemodel (3.2.11) 
Using erubis (2.7.0) 
Using journey (1.0.4) 
Using rack (1.4.4) 
Using rack-cache (1.2) 
Using rack-test (0.6.2) 
Using hike (1.2.1) 
Using tilt (1.3.3) 
Using sprockets (2.2.2) 
Using actionpack (3.2.11) 
Using mime-types (1.19) 
Using polyglot (0.3.3) 
Using treetop (1.4.12) 
Using mail (2.4.4) 
Using actionmailer (3.2.11) 
Using arel (3.0.2) 
Using tzinfo (0.3.35) 
Using activerecord (3.2.11) 
Using activeresource (3.2.11) 
Using coffee-script-source (1.4.0) 
Using execjs (1.4.0) 
Using coffee-script (2.2.0) 
Using rack-ssl (1.3.3) 
Using json (1.7.6) 
Using rdoc (3.12) 
Using thor (0.17.0) 
Using railties (3.2.11) 
Using coffee-rails (3.2.2) 
Using jquery-rails (2.2.0) 
Using bundler (1.3.0.pre.5) 
Using rails (3.2.11) 
Using sass (3.2.5) 
Using sass-rails (3.2.6) 
Using sqlite3 (1.3.7) 
Using uglifier (1.3.0) 
Your bundle is complete! It was installed into /Users/steve/tmp/vendor/bundle
```

The `--path` flag controls where the bundle is located. In this case, we store it one directory up. Now, when we copy new versions of the code over, it will use the bundle location that stays the same, and all is peachy keen.

I am told by several people that this is what the Capistrano/bundler recipe does by default, so if you’re using that, you’re already doing this.

## One Tiny Weakness

There is one small weakness of this approach compared to Vendor Everything: as an engineer, it’s your tradeoff to make.

This way of using bundler *will* hit the network *when you deploy for the first time after updating your bundle*. The cache on the server has to update in this case, so it will go fetch the new gems. So here’s the scenario:

1. I update my bundle. It gets the new versions of the gems.
2. Rubygems.org goes down.
3. I need to deploy a branch that has the new versions in it.

In this case, if you had Vendored Everything, the hit to Rubygems.org would have happened during step 1, and so things would work. If you used this strategy, it would have hit locally, so you could have developed, but then when deploying, it’d hit again to update the bundle on the server, and so it wouldn’t.

In these situations, you can temporarily switch to Vendor Everything, since you have the bundle installed locally: just copy your local gems over to `vendor/bundle` and you’re done. This may or may not be too much of a hassle. When I examine the downtime of Rubygems.org, I think it’s worth it to not mess up my git repository with all that gem code. You might not. Do whatever you need to do, but now you know how to not rely on Rubygems.org for every deployment.

---

### An addendum

I got an email mentioning one more issue with the ‘vendor everything’ strategy:

```
$ ls vendor/bundle/ruby/1.9.1/gems/nokogiri-1.5.6/ext/nokogiri/*.o
vendor/bundle/ruby/1.9.1/gems/nokogiri-1.5.6/ext/nokogiri/html_document.o
vendor/bundle/ruby/1.9.1/gems/nokogiri-1.5.6/ext/nokogiri/html_element_description.o
vendor/bundle/ruby/1.9.1/gems/nokogiri-1.5.6/ext/nokogiri/html_entity_lookup.o
vendor/bundle/ruby/1.9.1/gems/nokogiri-1.5.6/ext/nokogiri/html_sax_parser_context.o
vendor/bundle/ruby/1.9.1/gems/nokogiri-1.5.6/ext/nokogiri/html_sax_push_parser.o
vendor/bundle/ruby/1.9.1/gems/nokogiri-1.5.6/ext/nokogiri/nokogiri.o
vendor/bundle/ruby/1.9.1/gems/nokogiri-1.5.6/ext/nokogiri/xml_attr.o
vendor/bundle/ruby/1.9.1/gems/nokogiri-1.5.6/ext/nokogiri/xml_attribute_decl.o
vendor/bundle/ruby/1.9.1/gems/nokogiri-1.5.6/ext/nokogiri/xml_cdata.o
vendor/bundle/ruby/1.9.1/gems/nokogiri-1.5.6/ext/nokogiri/xml_comment.o
vendor/bundle/ruby/1.9.1/gems/nokogiri-1.5.6/ext/nokogiri/xml_document.o
vendor/bundle/ruby/1.9.1/gems/nokogiri-1.5.6/ext/nokogiri/xml_document_fragment.o
vendor/bundle/ruby/1.9.1/gems/nokogiri-1.5.6/ext/nokogiri/xml_dtd.o
vendor/bundle/ruby/1.9.1/gems/nokogiri-1.5.6/ext/nokogiri/xml_element_content.o
vendor/bundle/ruby/1.9.1/gems/nokogiri-1.5.6/ext/nokogiri/xml_element_decl.o
vendor/bundle/ruby/1.9.1/gems/nokogiri-1.5.6/ext/nokogiri/xml_encoding_handler.o
vendor/bundle/ruby/1.9.1/gems/nokogiri-1.5.6/ext/nokogiri/xml_entity_decl.o
vendor/bundle/ruby/1.9.1/gems/nokogiri-1.5.6/ext/nokogiri/xml_entity_reference.o
vendor/bundle/ruby/1.9.1/gems/nokogiri-1.5.6/ext/nokogiri/xml_io.o
vendor/bundle/ruby/1.9.1/gems/nokogiri-1.5.6/ext/nokogiri/xml_libxml2_hacks.o
vendor/bundle/ruby/1.9.1/gems/nokogiri-1.5.6/ext/nokogiri/xml_namespace.o
vendor/bundle/ruby/1.9.1/gems/nokogiri-1.5.6/ext/nokogiri/xml_node.o
vendor/bundle/ruby/1.9.1/gems/nokogiri-1.5.6/ext/nokogiri/xml_node_set.o
vendor/bundle/ruby/1.9.1/gems/nokogiri-1.5.6/ext/nokogiri/xml_processing_instruction.o
vendor/bundle/ruby/1.9.1/gems/nokogiri-1.5.6/ext/nokogiri/xml_reader.o
vendor/bundle/ruby/1.9.1/gems/nokogiri-1.5.6/ext/nokogiri/xml_relax_ng.o
vendor/bundle/ruby/1.9.1/gems/nokogiri-1.5.6/ext/nokogiri/xml_sax_parser.o
vendor/bundle/ruby/1.9.1/gems/nokogiri-1.5.6/ext/nokogiri/xml_sax_parser_context.o
vendor/bundle/ruby/1.9.1/gems/nokogiri-1.5.6/ext/nokogiri/xml_sax_push_parser.o
vendor/bundle/ruby/1.9.1/gems/nokogiri-1.5.6/ext/nokogiri/xml_schema.o
vendor/bundle/ruby/1.9.1/gems/nokogiri-1.5.6/ext/nokogiri/xml_syntax_error.o
vendor/bundle/ruby/1.9.1/gems/nokogiri-1.5.6/ext/nokogiri/xml_text.o
vendor/bundle/ruby/1.9.1/gems/nokogiri-1.5.6/ext/nokogiri/xml_xpath_context.o
vendor/bundle/ruby/1.9.1/gems/nokogiri-1.5.6/ext/nokogiri/xslt_stylesheet.o
```

Basically, your compiled files get vendored, so if you’re, say, developing on Mac and deploying on Linux, you might end up with compiled native extensions for the totally wrong architecture.
