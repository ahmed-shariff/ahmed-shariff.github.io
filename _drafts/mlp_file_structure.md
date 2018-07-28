---
layout: post
comments: true
title: Breaking down the process of machine learning pipeline
tags: ["deep learning", "NLP"]
tagline: While the ml-pipeline solves some of the problems I encounter, it doesn't solve all of them. Here I describe my process beyond the pipeline.
---

While the [ml-pipeline](https://github.com/ahmed-shariff/ml-pipeline) and [experiment log]({{ site.baseurl }}{% post_url 2018-06-11-Experiment-log%}) I use gives me a better control over my machine learning projects, they are not sufficient. Here I outline some of the practices I have grown to follow to make my life easier. Note that by no means is this a perfect accounting of the process. I am simply documenting my current practices here, which I hope can help me as well as others, in the future.

I generally structure my machine learning project into four directories:
* Datasets: A directory that contains the data and related materials (meta-data, configuration files, data related scripts, etc.)
* Models: A directory that contains the code for the models and related tools. This directory will also contain the output files of the ml-pipeline. 
* Deployment: If the models I am working on is expected to go into a production environment, any code related to testing trained models in such context goes in here.
* Data_processing: Sometimes I can't use the data made available straight away. I use tend to write scripts to clean the data, which I store here.
* (Optionally) ml-pipeline: A clone of the [ml-pipeline](https://github.com/ahmed-shariff/ml-pipeline) repository. To test the models in the development environment, I have a copy of the pipeline with the configurations set specific to the project at hand.


