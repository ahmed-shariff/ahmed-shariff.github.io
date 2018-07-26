---
layout: post
comments: true
title: ML problems I run into
tags: ["Random thoughts"]
tagline: An ongoing list of problems I run into when using deep learning
---

This is an ongoing list of problems I keep running into when working on ML models. Some of them I address by adding a feature to my [machine learning pipeline](https://github.com/ahmed-shariff/ml-pipeline), others I note down as a 'best practice'

### Varying dataset classes count
While a relatively smaller and uncommon problem, I happen to run into this problem now and then. On occasions I only need to use a subset of the classes in a dataset. For example in a dataset with 100 classes, I  might use only 20 classes for a classification task. In this case, ideally, the number of outputs of the model output would be 20. But the annotations of the dataset is going to have the class labels in the range of 0 - 99. If the output has only 20 nodes, unless the classes are labeled 0-19, I'd run into <code>index  out of bounds</code> problems as the training loop will try to assess loss for labels beyond 20.

One solution is to remap the classes I am using to the range of the output of the model. But the problem with this is that I have to separately maintain the remapping to refer to the class an output node represents. The second solution is to make the number of output nodes to equal to the total number of classes in the dataset. While this adds a small overhead to the model, I find it easier to maintain the models.

It should be noted that the this is a manifestation of the strong relationship between data and code in machine learning.

### Model code and weight 
When I train a model, the model's graph itself is not stored. Only the weights are stored. Hence if the code is changed in any way, the trained weights become useless. I can think of two ways to solve this problem:

* Save the code with the weights.
* Use version control (git) and save a reference to the version along with the weights, and record which experiment the saved weights belong to.

Both feel like not so good approaches: If I want to reproduce results either save multiple copies of code or have to work through the version control tool while maintaining a separate log to know which saved files belong to which experiment. I use  [experiment logs]({{ site.baseurl }}{% post_url 2018-06-11-Experiment-log %}) in which I record the versions (commits hash, as I use git), which kinda eases the pain of maintaining experiment-code-weight-data combo. But I would like to have better control over things. For now I record the commit hash in the experiment log and save a copy of the code with the saved weights. In the future I hope to have the pipeline log the commit hash when it's saving weights. As an extension to that, perhaps I can run a diff between the current file and the file from the commit to assess of the code has changed, and use that output.

### Meta data models
Each dataset comes with it's own metadata model. This tends to get annoying when you have to build a data-loader separately for each dataset. A solution to this problem is to adopt a meta-data model. An interesting approach in this regard that I have come across is the *feature store* in Uber's *Michelangelo*. For now I am following a json format for image data. Where each dataset is represented as a json array. Each image is represented as a array, with the first element pointing to the name of the image. The remaining elements are structured based on what they represent:
- class labels: a string, if images contain multiple classes, an array of strings.
  - eg: [car, bike, person]
- counts: similar to the above, but instead of strings, an object with one attribute - the name is a class label, the value is the count of that item.
  - eg: [{car:2}, {bike:3}, {person: 10}]
- Bounding boxes: a list of json objects. Each containing 5 attributes - class labels and the coordinates.
  - eg: [{name: car, x1:10, x2: 250, y1:22, y2: 320}, {name: bike, x1:42, x2: 33, y1:67, y2: 53}]
- Segmentation mask: a string pointing to the file containing the mask for the respective image.

Generally, instead of having the class labels as strings, it's ideal to have them as integers. In such circumstances, I maintain a separate file for the mapping from class label to a unique integer.

Something like the pascal VOC format is another choice, but I am not a fan of having separate files for each image. Specially because the data annotation pipeline I have in place sometimes goes through several phases which can require multiple files for each image, which can become cumbersome to maintain.
