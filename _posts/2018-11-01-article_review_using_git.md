---
layout: post
comments: true
title: Article review using git
tags: ["Random thoughts"]
tagline: Implementing a review system for articles using git
---

When we started implementing the website for HAIL(Hanthana Artificial Intelligence Lab), a feature requested was a blog which allows students to post articles after going through a review process. Of-course, this can be implemented with the website, but it requires a few components to be integrated to the website, like a user management system and a complete content management systems with an editor with atleast basic features which also allows comparing different version. This seemed like an overkill for a simple website. 

As computer scientists we use git on a regular basis. I for one use git more than I use email. Since we already use git to collaborate on code it's not a stretch to use git to collaborate on text documents. In fact people have attempted this: use git to collaborate on text documents; [The HoTT book](http://math.andrej.com/2013/06/20/the-hott-book/) was collaboratively written by 40 mathematicians using git. Git can be daunting for someone not familiar with it. The contributors to the blog will be computer scientists and students who are studying computer science. Hence, the technical barrier will not be a major problem. Using markdown to compose articles will simplify the process of writing an article and allows git and diff to be used to keep track of the changes and the feedback made on the articles.

Github is perhaps the goto place for code sharing and collaborating. For obvious reasons, I am not going to list down why github is so sought after by developers and coders. We also plan on using github to host all the projects under the lab. Hence, github seems like a logical place to host the contents of the blog, where the collaboration will take place. Anyone who wants to submit an article can simply add their article and submit a pull request. The moderators of the repository can go through the submitted article, recommend changes and accept the pull request.

The use of github and markdown solves the collaboration aspect we wanted. To integrate the produced articles with the site, we used jekyll. Jekyll generates html based on the markdown files. We simply had to serve the generated file. The website will have a process that monitors the master branch of the blog repository. Any changes made will prompt the website to pull the changes and generate the pages. Mathjax and the flexibility of jekyll, with the fact that this was simple enough, further reinforced the choice of github + markdown for this process. The website is built using laravel. I will describe the specifics of how we combined laravel and jekyll for the blog.
