---
layout: post
comments: true
title: Using org mode for bibliography management
tags: ["emacs", "org", "reference-management"]
tagline: All hail emacs! All hail org-mode!
---

Maintaining and sorting all the papers you come across in a meaningful way and being able to refer to them when you need to access them used to drive me nuts: There's the bib file, all the notes on each paper, and then trying to track your notes and references while writing a paper/report. Being an emacs user, I wound up building a system around org-mode to manage all of this. This is basically a followup of the [reddit post](https://www.reddit.com/r/emacs/comments/dmlezv/reference_and_note_taking_using_orgref_and/) on this system. I've added quite a few additional pieces to this. 

The idea is as follows: When I come across a paper that I am interested, I add it to the database, which involves three things:
- Creates a bib entry in my master bib file
- Creates a org heading in my bib notes file
- Downloads and attaches the pdf file to the entry

When I want to take notes on the paper, I use [org-noter](https://github.com/weirdNox/org-noter), which stores all the notes as a entries under the org heading of the paper and is (kinda!) linked to the pdf file. When I want to reference a paper from a latex or org file, I'd use reftex and [org-ref](https://github.com/jkitchin/org-ref) which would be pointing to the master bib file when I am editing them. The most satisfying part is when I can directly open the pdf of a paper and the related notes directly from an `cite` entry in the latex file. On top of that, in order to classify and manage the different topics, I use [org-brain](https://github.com/Kungsgeten/org-brain) which is a variant of concept mapping which uses org-mode. On top of this I also have a org-mode based system for managing my projects and taking related notes. It also being part of org-mode and my `org-brain` setup, allows me to easily reference papers related to implementations or the other way around, which is a topic for another day.

## A few extra details
For brevity I am linking the functions to my dot files on github (Anyone who does go through that file, I apologize for the chaos it is; but then again, "a clean emacs config is an empty emacs config", so....). Since I constantly modifying this file, the links are to the most recent commit on github as of the date I am pushing the article.

A typical entry in the master org-file would look something like this:

```markdown
* (2013) Playing Atari With Deep Reinforcement Learning              :ATTACH:
  :PROPERTIES:
  :Custom_ID: mnih13_playin_atari_with_deep_reinf_learn
  :AUTHOR: Mnih, Kavukcuoglu, Silver, Graves, Antonoglou, Wierstra \& Riedmiller
  :JOURNAL: CoRR
  :YEAR: 2013
  :VOLUME: 
  :PAGES: 
  :DOI: 
  :URL: http://arxiv.org/abs/1312.5602v1
  :LINK:     https://arxiv.org/pdf/1312.5602v1.pdf
  :ATTACH_DIR: ~/Documents/org/bibliography/pdfs/
  :ID:       2e8e99e0-fc7a-4d41-add9-6737c186d87e
  :Attachment: mnih13_playin_atari_with_deep_reinf_learn.pdf
  :INTERLEAVE_PDF: ~/Documents/org/bibliography/pdfs/mnih13_playin_atari_with_deep_reinf_learn.pdf
  :BRAIN_PARENTS: 6bb2329c-2f8d-4c64-b880-fe1d3f47e0fe
  :END:
  - cite:mnih13_playin_atari_with_deep_reinf_learn
```

Typically, I use `org-ref`'s `crossref-add-bibtex-entry` to add a paper to the database. I still haven't figured out a consistant way to directly download papers through my networks, so I add the url as a `LINK` propoery. At this stage I have the paper in the bib file and the org file, to link the entry with `org-brain` and `org-noter` I execute the [`research-papers-configure`](https://github.com/ahmed-shariff/dotfiles/blob/c8bcf49703a66adf14469ab9b8a3d36c4c56bcb8/.emacs.d/customFiles/orgZ.el#L580) function. To attach the paper to any relevant topic in org-brain, I use the function [`org-brain-add-parent-topic`](https://github.com/ahmed-shariff/dotfiles/blob/c8bcf49703a66adf14469ab9b8a3d36c4c56bcb8/.emacs.d/customFiles/orgZ.el#L719) which filters the `org-brain` entries to topics. When I want to keep track of the papers I have worked on and the ones I want to work on, I use `org-mode`s todo lists, which I also expose to the `org-brain` interface which shows the todo state (more details on this can be found in [this issue](https://github.com/Kungsgeten/org-brain/issues/227)). On top of this I also have a few convenience functions for the following situations:
- Opening a pdf file directly from the `org-brain` window: [`org-brain-open-org-noter`](https://github.com/ahmed-shariff/dotfiles/blob/c8bcf49703a66adf14469ab9b8a3d36c4c56bcb8/.emacs.d/customFiles/orgZ.el#L357)
- Opening an child buttons entry in `org-brain` without going to the entry in `org-brain`: [`org-brain-goto-button-at-pt`](https://github.com/ahmed-shariff/dotfiles/blob/c8bcf49703a66adf14469ab9b8a3d36c4c56bcb8/.emacs.d/customFiles/orgZ.el#L729)
- List the topics assigned to a entry: [`org-brain-print-topics`](https://github.com/ahmed-shariff/dotfiles/blob/c8bcf49703a66adf14469ab9b8a3d36c4c56bcb8/.emacs.d/customFiles/orgZ.el#L734)
- Export all papers and notes related to a specific topic, which I use when I am sharing related papers with co-authors: [`copy-related-research-paper-notes`](https://github.com/ahmed-shariff/dotfiles/blob/c8bcf49703a66adf14469ab9b8a3d36c4c56bcb8/.emacs.d/customFiles/orgZ.el#L653) and [`copy-related-research-papers`](https://github.com/ahmed-shariff/dotfiles/blob/c8bcf49703a66adf14469ab9b8a3d36c4c56bcb8/.emacs.d/customFiles/orgZ.el#L626)
- Simplify adding papers from arxiv (because it's more consistent and free to download directly): [`arxiv-add-bibtex-entry-with-note`](https://github.com/ahmed-shariff/dotfiles/blob/c8bcf49703a66adf14469ab9b8a3d36c4c56bcb8/.emacs.d/customFiles/orgZ.el#L678)
- Abstract deletion of pdf file and related cleanup: [`org-brain-delete-interleve-entry`](https://github.com/ahmed-shariff/dotfiles/blob/c8bcf49703a66adf14469ab9b8a3d36c4c56bcb8/.emacs.d/customFiles/orgZ.el#L754)
- When reading a pdf file: 
  - Add highlighted text as quoted notes (alternative to highlighting on the pdf): [`org-noter-copy-text-as-note`](https://github.com/ahmed-shariff/dotfiles/blob/c8bcf49703a66adf14469ab9b8a3d36c4c56bcb8/.emacs.d/customFiles/orgZ.el#L541)
  - Crop a part of the pdf and store it as an image (parts of them still experimental): [`pdf-crop-image`](https://github.com/ahmed-shariff/dotfiles/blob/c8bcf49703a66adf14469ab9b8a3d36c4c56bcb8/.emacs.d/customFiles/orgZ.el#L493)
- Using `org-ql` for querying papers based on topics: [`org-brain-query-papers`](https://github.com/ahmed-shariff/dotfiles/blob/c8bcf49703a66adf14469ab9b8a3d36c4c56bcb8/.emacs.d/customFiles/orgZ.el#L466)


PS: Alot of the code I have in these configuration files are copied and modified from many others solutions to different problems.
