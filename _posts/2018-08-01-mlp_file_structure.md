---
layout: post
comments: true
title: Practices I follow with the machine learning pipeline
tags: ["deep learning"]
tagline: While the ml-pipeline solves some of the problems I encounter, it doesn't solve all of them. Here I describe my process beyond the pipeline.
---

*<small>Edit [01-01-2019]: Changed the reference to the old mlpipeline to the new</small>*

While the [ml-pipeline](https://github.com/ahmed-shariff/ml-pipeline) and [experiment log]({{ site.baseurl }}{% post_url 2018-06-11-Experiment-log%}) I use gives me a better control over my machine learning projects, they don't cover all the bases. Here I outline some of the practices I have grown to follow to make my life easier. Note that by no means is this a perfect process. I am simply documenting my current practices here, which I hope can help me as well as others, in the future. I also am listing down some of the problems when working on machine learning in [ML problems I run into]({{ site.baseurl }}{% post_url 2018-07-26-ml-problems%}).

I generally structure my machine learning project into four directories:
* Datasets: A directory that contains the data and related materials (meta-data, configuration files, data related scripts, etc.)
* Models: A directory that contains the code for the models and related tools. This directory will also contain the output files of the ml-pipeline. 
* Deployment: If the models I am working on is expected to go into a production environment, any code related to testing trained models in such context goes in here.
* Data_processing: Sometimes I can't use the data made available straight away. I use tend to write scripts to clean the data, which I store here.

In addition the projects root will contain the configuration files used by the ml-pipeline.

The function of the directories are divided such that, when training, only the `Datasets` and `Models` directories are used. When working on piecing together the trained model for deployment, only the `Datasets` and `Deployment` directories are used. Likewise, when I am working on the dataset, only the `Datasets` and `Data_processing` directories are used.

The above division of the workflow can be thought of as a lose *separation of concerns*. In machine learning defining clear boundaries for components, which then can be improved and tested in isolation like in a traditional software system, is very tricky. While this division of the workflow is not a perfect solution, it works well for me, *for now*. In the remainder of this article I will try to describe how I define and maintain the content of each of this directories (components).


## Datasets
This directory primarily contains the datasets and related content. That is, image files, video files, audio files, stored embedding, etc. This also contains the meta data of the datasets. Occasionally, if there are any tools/scripts, which are used to make necessary changes to the datasets, are also stored here. This allows for the use of a tool like [dvc][https://github.com/iterative/dvc] to maintain the data. In addition I also store any pre-trained weights in this directory. The pre-trained weights are stored here as it can be used in both the training process and deployment systems. As each dataset tends to have it's own annotation/meta data format, I prefer to convert the meta-data to a fixed [format]({{ site.baseurl }}{% post_url 2018-07-26-ml-problems%}#meta-data-models) which eases the work that needs to be done when defining data-loaders. As of now I am using a json format. In the future I'll be moving to a better meta-data model, that pulls from a properly maintained database of features. The coco annotation format is a solution I am looking at. The json format I use for now is as follows:
- class labels: a string, if images contain multiple classes, an array of strings.
  - eg: 
	- Single item: <code>car</code>
	- Multiple items:<code>[car, bike, person]</code>
- counts: similar to the above, but instead of strings, an object with one attribute - the name is a class label, the value is the count of that item.
  - eg: 
	- Single item: <code>{car:2}</code>
	- Multiple items: <code>[{car:2}, {bike:3}, {person: 10}]</code>
- Bounding boxes: a list of json objects (pretty much always there is more than one bounding box). Each containing 5 attributes - class labels and the coordinates.
  - eg: <code>[{name: car, x1:10, x2: 250, y1:22, y2: 320}, 
  {name: bike, x1:42, x2: 33, y1:67, y2: 53}]</code>
- Segmentation mask: a string pointing to the file containing the mask for the respective image.

## Models
Here I host the models and related content and this is where the core of my work takes place. For each model I am developing I have a separate script. To keep things cleaner, I prepend the id of the primary experiment the model in the script is related to. Also, the pipeline stores the outputs in this directory. This way this directory can be maintained as a separate repository using version control to keep track of the experiments conducted. I have made the habit of making a commit before and after a training session and record the commit's hash in the experiment_log (hoping to make this a feature in the ml-pipeline).

Some parts of the code in several models scripts can be shared. The code in the script can be divided into two segments:
- Code related to the construction of the model.
- Code related to the training and evaluation process of the model.

In most cases it is the second category of code that is shared among the scripts. When I export a model, I [make a copy of the script]({{ site.baseurl }}{% post_url 2018-07-26-ml-problems%}#model-code-and-weight) and store it along with the weights. For an exported model, the training and evaluation code is mostly irrelevant. Hence, only the code that falls into the second category is abstracted to a separate script which can be imported here. Any code that is related to the construction of a model will be available the respective script. As such, there are several components that I have delegated to a different script, such as the data-loaders and implantation details specific to a library (saving and loading weights, setting hyper-parameters, cleaning saved cache of previous iterations, etc.). Note that if using an intermediate format which exports both the weights and the graph (ONNX or tensorflow's *saved models*), this will not be issue.

## Deployment
Anything beyond training, this is the place where I have em all. Once I have a model I am comfortable with, I export it and build the necessary pieces needed to deploy/test the exported model. Generally I use the script I have saved along with the exported model to construct the model and set up other components around it.

## Data processing
Since 'machine learning', data is always a vital part. Almost always, all projects have new data. Even though deep learning might alleviate the need for feature engineering, the data generally needs to be cleaned and processed before being used for training. While I prefer storing the data itself in the `Datasets` directory, the scripts I use to process the data and the related intermediate states and meta-data, I store in this directory. This is mostly to avoid polluting the `Datasets` directory. This way, the dirty stuff is in here, while the `Datasets` directory will be holding the actual data and meta-data in it. 

## Content in the root directory
The root directory primarily would contain the configuration files used by the pipeline and the experiment log and the notes. The notes is something slimilar to my 
