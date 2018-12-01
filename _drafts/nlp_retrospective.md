---
layout: post
comments: true
title: Building a dialogue manager - A retrospective
tags: ["deep learning", "NLP"]
tagline: Lesons learnt and thoughts after working on the dialogue management model
---

My paper on the dialiogue manager I worked on as part of my undergraduate course was accepted. Meanwhile I had taken a break from the NLP scene and started working on it again only recently. In the spirit of how fast machine learning is progressing, the year-and-a-half-long break has seen alot of progress in this domain as well (I am still figuring out ho to keep up with all of it). So, here I am piecing together my thoughts. I'd be talking about what is it I had done, and why, and then discuss what is being done and the direction I intend to move in. 

I'll start by briefly describing what I had done. I developed a model for a dialogue manager. A dialogue manager is part of a spoken dialogue system (SDS). Generally, a spoken dialogue system has five components: Automated speech recognizer (ASR), Natural language understanding (NLU), dialogue manager (DM), Natural language generation (NLG) and Text to speech (TTS). Let me describe what these do through an example dialogue exchange. Say we have a SDS that simply turns on and off a set of lights on a users request. Lets say the user starts with saying "hey budd, switch on the light will you". First the ASR will process the utterance of the user and produce a textual representation of the utterance
