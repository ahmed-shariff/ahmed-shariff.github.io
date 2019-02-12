---
layout: post
comments: true
title: The game of labeling
tags: ["machine learning"]
tagline: A summery of the labeing process I follow
---

Given the data hungry models we have it is no wonder labeling is a significant potion of the process. Working on the restaurant automation project for one and a half year, I constantly had to add more data to the dataset. My workflow primarily consisted of image data, I had data that was collected from different data sources: Web scraping, collected by visiting restaurants, collected in the prototype live environment etc. Me being me, I wound up implementing the labeling pipeline using opencv and python. Initially it was quite simple, with time it started getting more and more complex. I started only needing to add labels, as the project progressed I needed to annotate the data with count, bounding box and segments. The script started getting more and more complex, and we all know how much fun it is to maintain large python scripts. So I took a break and restructured the whole labeling pipeline, which I have iterated upon. At one point, labeling roughly 1000 images with the label and the count for each item in the image took me about 4 hours; which is not fun (forget about the sore fingers, looking at food that long dives me nuts). Now, my current record is, labeling 5136 images with label and counts in 2 hours and 22 minutes, which is about 36 images per minute! Boom!. **Here I outline the process I follow to collect and label data**. I have the metadata framework I use in [ml problems]({{ site.baseurl }}{% post_url 2018-07-26-ml-problems %}). 

### Collecting Images
The current setup I have has four cameras that I use to capture the images. I name the images in a manor that the names can be sorted in the order they are captured. The advantage of this is, since we are capturing images from the same scene, the images of the scene are bound to have similar labels. This allows to label these images faster by saying that the image's labels are the same as the image that was labeled before this. In addition to that I've made a habit to follow a pattern when capturing images. For example, if I am starting with capturing images that have rolls and cupcakes, then next I will be capturing images with rolls, cupcakes and pastries. Since the images are named in way to allow sorting in the order they were captured, similar scenes are going to be close by, this also allows to label faster by saying that this scene has labels similar to the scene I labeled before this. The naming convention I follow for the names of the images is as follows:

```
	<time-stamp>_<scene-number>_<camera-number>.jpg
```

The time stamp will be the time-stamp of the time the particular image collection session started. And then we have the scene number and camera number. This naming convention, not only allows for the optimizations I mentioned above, but also lets me identify where the image might be coming from. One example of this is when I had to separate the dataset into two based on when it was captured. Due to some mistakes by my hand, the metadata of the files had changed. The fact that I had the time-stamp of the session in which the images were captured saved the day.

Another minor detail that gave me a headache was that if there are no leading zeros to the numbers when they are turned into a string, the sorting by the name would result in order like 199, 20, 21, ..., 200. It is possible to just extract the number from the name and sort based on that (which I implemented just for the kicks of it), but having leading zeros is a lot more convenient. I generally add leading zeros such that the scene numbers are 4 characters and the camera number 2 characters long. 

### The labeling pipeline

Initially with labeling pipeline I had, I would be labeling each image for count, label, crop, and then bounding box.
