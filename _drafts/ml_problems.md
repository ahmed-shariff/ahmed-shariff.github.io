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

