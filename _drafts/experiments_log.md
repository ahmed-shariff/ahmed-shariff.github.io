---
layout: post
comments: true
title: Experiment log - How I keep track of my ML experiments
tags: Machine-learning
---
For the past year I have been working on deep learning applications. As I was working I continuously automated various components of the development cycle/ experiments, which I finally pulled together as a basic [machine learning pipeline](https://github.com/ahmed-shariff/ml-pipeline) (there is still alot that needs to be done there). It didn't take me long to run into the <em>technical dept in machine learning </em>. While the pipeline I had solved a few problems, there were other concerns that I needed to address. One of the biggest of them was keeping track of what I have done so far, and decision process accompanying it. I did find myself running in circles butting heads with the same walls over and over. While I maintain extensive logs and use git keep track of the experiments I have done, they were not enough or inconvenient to keep track of the reasons and decision process behind the experiments. This lack of clarity was not only hampering my work flow, it was also quite annoying when I had to draw a progress report. I had to spend an unnecessarily huge chunk of time piecing together what I had done.

What I needed was a simple and coherent way to write down what I am doing and be able to refer to it from my logs or anywhere else. I use emacs for my daily work. Hence, I had org-mode at my disposal. I drew up a template to log experimenters, I'll describing what I do in the rest of this article.

Each experiment is formatted as follows:
{% highlight md%}
* TODO  --Brief description of the experiment-- [0%]   :@work:exp:
  :PROPERTIES:
  :ID:       --unique id, which can be used to identify this experiment with--
  :END:
- --A more detailed description of the experiment and notes also go here--

** TODO Experiments [/]
1. [ ] --A numbered list of steps or sub tasks to complete, also the hash of the commit which competes this step--
** TODO Conclusions
--When the expermient is complete--

{% endhighlight %}
