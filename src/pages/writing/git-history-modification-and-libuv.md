---
layout: ../../layouts/MarkdownPostLayout.astro
title: "git, history modification, and libuv"
pubDate: 2013-11-30
blog: words
---


There has been a recent kerfuffle over a [pull request to libuv](https://github.com/joyent/libuv/pull/1015): it was rejected, applied, reverted, and re-applied. There was some question as to the authorship of that commit, and I wanted to show you why that was, because it illustrates how git handles history.

At first, the pull request was closed. Then, it was committed in [47d98b6](https://github.com/joyent/libuv/commit/47d98b64c45db8335bf7e065351e385cae32323d). Then [804d40ee](https://github.com/joyent/libuv/commit/804d40ee14dc0f82c482dcc8d1c41c14333fcb48) reverted that 47d98b6. But when you look at 804d40ee on GitHub, you’ll see no indication of which branch it’s on. That’s because it’s not on any branch. If you clone down libuv, and try to find the commit, you’ll see it’s not there:

```
~/libuv(master)$ git log 804d40e                                                                                                                
fatal: ambiguous argument '804d40e': unknown revision or path not in the working tree.  
```

What gives?

Let’s make a test repository:

```
$ mkdir test                                                                                                                                                       
$ cd test                                                                                                                                                          
$ git init                                                                                                                                                         
Initialized empty Git repository in /home/action/test/.git/                                                                                                        
$ touch HELLO.md                                                                                                                                                   
$ git add HELLO.md                                                                                                                                                 
$ git commit -m "initial commit"                                                                                                                                   
[master (root-commit) 646567b] initial commit                                                                                                                      
 1 file changed, 0 insertions(+), 0 deletions(-)                                                                                                                   
 create mode 100644 HELLO.md                                                                                                                                       
```

Okay, now let’s make a second commit:

```
$ touch WHATEVER.md                                                                                                                                                
$ git add WHATEVER.md                                                                                                                                              
$ git commit -m "adding whatever"                                                                                                                                  
[master 7c232cc] adding whatever                                                                                                                                   
 1 file changed, 0 insertions(+), 0 deletions(-)                                                                                                                   
 create mode 100644 WHATEVER.md                                                                                                                                    
```

Actually, that commit was a mistake. Since we haven’t pushed anywhere yet, let’s just use `git reset --hard` to just throw it out.

```
$ git reset --hard HEAD~1                                                                                                                                          
HEAD is now at 646567b initial commit                      
```

But what about that commit? Where is it?

```
$ git show 7c232cc                                                                                                                                                 
commit 7c232cceb94a2e7cdd95c526de785efe08da2325                                                                                                                    
Author: Steve Klabnik <steve@steveklabnik.com>                                                                                                                     
Date:   Sat Nov 30 20:19:26 2013 +0000                                                                                                                             
                                                                                                                                                                   
    adding whatever                                                                                                                                                
                                                                                                                                                                   
diff --git a/WHATEVER.md b/WHATEVER.md                                                                                                                             
new file mode 100644                                                                                                                                               
index 0000000..e69de29 
```

It’s still in the repository. We can use `git reflog` to see our changes:

```
$ git reflog                                                                                                                                                       
646567b HEAD@{0}: reset: moving to HEAD~1                                                                                                                          
7c232cc HEAD@{1}: commit: adding whatever                                                                                                                          
646567b HEAD@{2}: commit (initial): initial commit 
```

Git calls these kinds of commits ‘unreachable’ because, while they exist in your repository, you can’t find them unless you know their SHA. They’re not connected to any tag or branch. We can use `git fsck` to find these for us automatically:

```
$ git fsck --no-reflogs --unreachable                                                                                                                              
Checking object directories: 100% (256/256), done.                                                                                                                 
unreachable tree 1536f028d8051a63f7f39951f06b7180a96faff5                                                                                                          
unreachable commit 7c232cceb94a2e7cdd95c526de785efe08da2325
```

Some Git commands will run `git gc`, the Git garbage collector, as part of their normal operation. However, if we run `git gc` ourselves, it doesn’t look like anything happens:

```
$ git gc                                                                                                                                                           
Counting objects: 5, done.                                                                                                                                         
Delta compression using up to 8 threads.                                                                                                                           
Compressing objects: 100% (3/3), done.                                                                                                                             
Writing objects: 100% (5/5), done.                                                                                                                                 
Total 5 (delta 0), reused 0 (delta 0)                                                                                                                              
$ git fsck --no-reflogs --unreachable                                                                                                                              
Checking object directories: 100% (256/256), done.                                                                                                                 
Checking objects: 100% (5/5), done.                                                                                                                                
unreachable tree 1536f028d8051a63f7f39951f06b7180a96faff5                                                                                                          
unreachable commit 7c232cceb94a2e7cdd95c526de785efe08da2325    
```

What gives? Well, `git gc` has some settings that indicate how long it will let an unreachable commit lay around in your repository. The `gc.pruneExpire` configuration variable controls this behavior, and it defaults to 14 days. So even if we try to throw away a commit, and even if we manually run the garbage collector, we’ll still have the commit for two weeks.

We can, of course, tell `git gc` to ignore the setting:

```
$ git gc --prune=now                                                                                                                                 
Counting objects: 5, done.                                                                                                                                         
Delta compression using up to 8 threads.                                                                                                                           
Compressing objects: 100% (3/3), done.                                                                                                                             
Writing objects: 100% (5/5), done.                                                                                                                                 
Total 5 (delta 0), reused 5 (delta 0)                                                                                                                              
$ git fsck --no-reflogs --unreachable                                                                                                                              
Checking object directories: 100% (256/256), done.                                                                                                                 
Checking objects: 100% (5/5), done.                                                                                                                                
unreachable tree 1536f028d8051a63f7f39951f06b7180a96faff5                                                                                                          
unreachable commit 7c232cceb94a2e7cdd95c526de785efe08da2325   
```

Uhhhh what? It turns out that `git gc` won’t touch commits that are still in our reflog. So let’s clear that:

```
$ git reflog expire --expire=now --all                                                                                                                             
$ git reflog        
$
```

Good. And now, let’s take out the garbage:

```
$ git gc --prune=now                                                                                                                                               
Counting objects: 3, done.                                                                                                                                         
Writing objects: 100% (3/3), done.                                                                                                                                 
Total 3 (delta 0), reused 3 (delta 0)                                                                                                                              
$ git fsck --no-reflogs --unreachable                                                                                                                              
Checking object directories: 100% (256/256), done.                                                                                                                 
Checking objects: 100% (3/3), done. 
```

Easy! When you fetch from a remote repository, Git does not include unreachable commits. That’s why when we cloned down libuv earlier, we didn’t get the orphaned commit.

Anyway, as you can see, it’s actually really hard to lose your data with Git, even if you explicitly try to throw it away. This is why you can rebase with… well, maybe not reckless abandon, but you don’t have to worry about your data. All it takes is a quick `git reset --hard HEAD@{1}` (read: reset me to the last entry in the reflog) and you’re back to where you were before that operation you screwed up.

So, what happened with that commit on GitHub? Basically, one committer pushed 804d40ee, and then another did a `git reset --hard` to remove it, and then force pushed up to the repository. That commit still lives on GitHub, and is still viewable in their interface, but in some time, when GitHub runs `git gc` on the repository, it will go away.
