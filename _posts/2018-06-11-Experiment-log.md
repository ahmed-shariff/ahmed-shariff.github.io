---
layout: post
comments: true
title: Experiment log - How I keep track of my ML experiments
tags: Machine-learning
tagline: In order to reduce the clutter, I keep track of the experiments using a emacs org-mode.
---
For the past year I have been working on deep learning applications. As I was working I continuously automated various components of the development cycle/ experiments, which I finally pulled together as a basic [machine learning pipeline](https://github.com/ahmed-shariff/ml-pipeline) (there is still alot that needs to be done there). It didn't take me long to run into the <em>technical dept in machine learning </em>[^fn-tech-debt-paper]<sup>,</sup>[^fn-reproduce-article]. While the pipeline I had solved a few problems, there were other concerns that I needed to address. One of the biggest of them was keeping track of what I have done so far, and the decision process accompanying it. I did find myself running in circles butting heads with the same walls over and over. While I maintain extensive logs and use git keep track of the experiments I have done, they were not enough or inconvenient to keep track of the reasons and decision process behind the experiments. This lack of clarity was not only hampering my work flow, it was also quite annoying when I had to draw a progress report. I had to spend an unnecessarily huge chunk of time piecing together what I had done.

What I needed was a simple and coherent way to write down what I am doing and be able to refer to it from my logs or anywhere else. I use emacs for my daily work. Hence, I had org-mode at my disposal. I drew up a template to log experiments, I'll describing what I do in the rest of this article.

Each experiment is formatted as follows:
{% highlight md%}
* TODO  [--ID property value--]--Brief description of the experiment-- [0%]   :@work:exp:
  :PROPERTIES:
  :ID:       --unique id, which can be used to identify this experiment with--
  :END:
  --Time stamp: indicting when the entry was created--
- --A more detailed description of the experiment and notes also go here--

** TODO Experiments [/]
1. [ ] --A numbered list of steps or sub tasks to complete, also the hash of the commit which competes this step--

** TODO Conclusions
--When the experiment is complete--

{% endhighlight %}

Example log:
{% highlight md %}
* TODO [201] ABC in XYZ model [0%]   :@work:exp:
  :PROPERTIES:
  :ID:       201
  :END:
  [2018-06-06 Wed 16:16]


- Test if adding ABC to XYZ improves results.

** TODO Experiments [1/2]
1. [x] Test XYZ without ABC (83d45cd) 
2. [ ] Test XYZ with ABC

** TODO Conclusions

{% endhighlight %}

An accompanying git log for the experiment will look as follows:
{% highlight git %}
commit 83d45cd1128a8feda93af551ba099234fa52c48b
Author: Ahmed Shariff <ahmed.shariff@live.com>
Date:   Wed Jun 6 01:56:44 2018 +0530

    [e201.1] Results- XYZ without ABC
	
	Re trained the model XYZ with a modified data 
	pipeline for [e201]. The changes to the pipeline
	haven't made much of a difference in the model.

{% endhighlight %}

- Each experiment is a TODO entry. The entry's heading contains a brief description of the experiment and tags. The tags I am using here are used by org for filtering when querying. The  <code>@work</code> tag I use for work related entries and <code>exp</code> for an entry that is related to experiments. 
- The properties drawer holds the ID of the experiment. I use this ID to refer to this entry. The commit message above refers to this entry in the experiment log as <code>[e201]</code>. 
- I use plain lists to take notes under the heading of the experiment. Usually the first bullet point explains the experiment.
- The subheading <em>Experiments</em> is also a TODO entry. Under this heading I list the sub tasks I want to complete. I use a numbered list to allow me to refer to each sub task from an external source. The commit message refers to the first sub task as <code>[e201.1]</code>. Once I have completed a sub task I add the hash of the commit where the results were added.
- The next subheading is the <em>Conclusions</em>, where I add the final results and related information.
- Also as a habit, each time I implement something related to an experiment I add a commit with a reference to the related experiment before and after the training. Note that only the results and related code are added to git.
- org mode helps with updating the TODO status and update completed percentage and sub tasks. 
- Whenever I am taking notes, under the Notes section or under the subtasks, I generally add an inactive timestamp and a related commit hash before the note. 

To help me with this process, I included a few snippets to my <code>.emacs</code>:
{% highlight emacs-lisp %}
;;I use capture to setup the template for any new experiment
(setq org-capture-templates
	'(... ;other capture templates
	  ("e" 
	   "Add experiment"
	   entry 
	   (file "~/Research/FoodClassification/experiment_log.org")
	 "\n* TODO [%^{ID}] %^{Experiment} [%] :@work:exp:%^g\n:PROPERTIES:
  :ID:       %\\1
  :END:\n- %^{Description}\n\n** Notes\n\n** TODO Experiments [/]\n%?\n** TODO Conclusions")))


;;Custom agenda to query experiments
(setq org-agenda-custom-commands
  '(("c" . "My custom queries")
	("ci" tags-todo "LEVEL=1&+exp/!INPROGRESS"
	 ((org-agenda-files `("~/experiment_log.org"))
	  (org-agenda-filter-by-top-headline)))
	("ct" tags-todo "LEVEL=1&+exp/!TODO|WAIT"
	 ((org-agenda-files `("~/experiment_log.org"))
	  (org-agenda-filter-by-top-headline)))
	("ca" tags-todo "LEVEL=1&+exp"
	 ((org-agenda-files `("~/experiment_log.org"))
	  (org-agenda-filter-by-top-headline)))
	("cd" tags-todo "LEVEL=1&+exp/!DONE"
	 ((org-agenda-files `("~/experiment_log.org"))
	  (org-agenda-filter-by-top-headline)))))
{% endhighlight %}

[^fn-tech-debt-paper]: [Hidden Technical Debt in Machine Learning Systems](https://papers.nips.cc/paper/5656-hidden-technical-debt-in-machine-learning-systems.pdf)

[^fn-reproduce-article]: [The Machine Learning Reproducibility Crisis](https://petewarden.com/2018/03/19/the-machine-learning-reproducibility-crisis/)
