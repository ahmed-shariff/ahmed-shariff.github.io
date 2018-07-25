---
layout: post
comments: true
title: ML problems I run into
tags: ["Random thoughts"]
tagline: An ongoing list of problems I run into when using deep learning
---

This is an ongoing list of problems I keep running into when working on ML models. Some of them I address by adding a feature to my [machine learning pipeline](https://github.com/ahmed-shariff/ml-pipeline), others I note down as a 'best practice'

### Varying dataset classes count
<small>Best practice</small>
<p>While a relatively smaller and uncommon problem, I happen to run into this problem now and then. On occasions I only need to use a subset of the classes in a dataset. For example in a dataset with 100 classes, I  might use only 20 classes for a classification task. In this case, ideally, the number of outputs of the model output would be 20. But the annotations of the dataset is going to have the class labels in the range of 0 - 99. If the output has only 20 nodes, unless the classes are labeled 0-19, I'd run into <code>index  out of bounds</code> problems as the training loop will try to assess loss for labels beyond 20. </p>
<p>
One solution is to remap the classes I am using to the range of the output of the model. But the problem with this is that I have to separately maintain the remapping to refer to the class an output node represents. The second solution is to make the number of output nodes to equal to the total number of classes in the dataset. While this adds a small overhead to the model, I find it easier to maintain the models.
</p>
<p> It should be noted that the this is a manifestation of the strong relationship between data and code in machine learning.</p>

### Model code and weight 
<small>Best practice</small>
<p>
When I train a model, the model's graph itself is not stored. Only the weights are stored. Hence if the code is changed in any way, the trained weights become useless. I can think of two ways to solve this problem:</p>
* Save the code with the weights.
* Use version control (git) and save a reference to the version along with the weights, and record which experiment the saved weights belong to.
<p>
Both feel like not so good approaches: If I want to reproduce results either save multiple copies of code or have to work through the version control tool while maintaining a separate log to know which saved files belong to which experiment. I use [experiment logs]({{ site.baseurl }}{% post_url 2018-06-11-Experiment-log %}) in which I record the versions (commits hash, as I use git), which kinda eases the pain of maintaining experiment-code-weight-data combo. But I would like to have better control over things. For now I record the commit hash in the experiment log and save a copy of the code with the saved weights. In the future I hope to have the pipeline log the commit hash when it's saving weights. As an extension to that, perhaps I can run a diff between the current file and the file from the commit to assess of the code has changed, and use that output.</p>
