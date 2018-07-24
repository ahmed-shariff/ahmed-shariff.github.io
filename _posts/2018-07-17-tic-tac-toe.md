---
layout: post
comments: true
title: Teaching a computer to play Tic-Tac-Toe.
tags: ["Random thoughts"]
tagline: A simple demonstration of teaching a computer to play tic-tac-toe. This is part of a demonstration made for the first year undergraduates.
---
I am writing this article accompanying the [demonstration](https://github.com/H-A-I-L/tic-tac-toe) prepared as part of a seminar for the first year undergraduates at the Department of Statistics and Computer Science, Faculty of Science, University of Peradeniya.

<div class="message">
	I will post an updated version of this article on the Hanthana AI Lab's website when it goes live.
</div>

## The web app

Before we dive into the 'teaching a computer' part, let's have a look at the interface, the web app, through which we'll be playing the game. In the repository, you'll see that I have implemented the back-end of the web app using python and the front end is simply the same old html and javascript. You should be able to launch the server by running the following command:
{% highlight bash %}
python3 simple_server.py
{% endhighlight %}

This will display the address of the server which is usually: <code>http://localhost:8080</code>. When you go this address you will get a simple interface for two players to play tic-tac-toe. If you open the <code>index.html</code> file in the repository, you can see a simple implementation of how a game is judged.

## The model: How the computer plays

Now to the meat of the article, how do we teach a computer to play this game. While there are various approaches, the approach we will be taking here is a machine learning approach. We are essentially trying to build a model that says what is the best possible next move which will ultimately lead to a win. We'll be using a simple neural network as the model here. Think of the model as a black box, it takes in the current status of the board and outputs the best next move. The implementation of this model is available in the python script at <code>models/deep_learning_feed_forward.py</code> in the repository. The model works as follows:
- **The input**:
  As the board of the game has 9 positions, the input is an array [^fn-arry_vs_tensor] of 9 elements, each representing one of the 9 boxes in the board. Each box can have one of the three values:
  - **0**: if the box is empty.
  - **1**: if the box is marked by the opposing player. (in this case the human player)
  - **2**: if the box is marked by the current player. (in this case the computer)
- **The output**:
  The output is also an array of 9 elements. Just like the input, each element represents a box on the board. The values are probabilities. Simply put, the box with the highest probability is the box that will be chosen next by the computer.
  
Note that the model we are using here does not have any form of memory. That is, it has not capacity to plan or remember it's previous moves. Hence, it purely predicts the next probable move based only on the current state of the board. [^fn-only_ff]
  
## Training: Teaching the computer to play

This model we define still doesn't know how to play on it's own. We have to teach how it how to play. In machine learning we can call this process training. That is we have to train the model to predict the best next move based on the current state of the board. We do this by letting the model to make a prediction based on a input we give model feedback on how correct/wrong the models output is. Based on this feedback the model will adjust it's internals to give a better output next time. We repeat this process until we are satisfied that the output of the model is consistently good. 

We break the train the model in two phases.
- How to predict valid positions: First we train the model to predict positions in the board that has not been marked by any of the player. For this, during each iteration of the training process, we generate a random board with positions partially filled and let the model predict a position. If the position is not empty, the feed back will be negative, where else if the position is not occupied, the feedback is positive.
- How to predict positions that can lead to a win: Now that the model can predict valid positions, we'll train it to predict positions that can lead to a win. We do this by making a copy of the model and pitting it against itself. The opponent in this case is a previous version of the model. If the opponent loses the match the feedback will be positive, if the opponent wins the feedback will be negative, where else if the match concludes in a draw, the feedback will be zero.

## Playing against the computer

To play with the opponent, you'll have to have [pytorch](http://www.pytorch.org) installed. Launch the server in the same way as described above and go to <code>http://localhost:8080/smart_player.html</code>. It is a similar interface as you'd have seen before, now the player 2 is the computer. As you make your move, the computer will make it's next move. 

[^fn-arry_vs_tensor]: Not necessaryily an array, it's a tensor, but for simplicity's sake I am calling it an array here. The definition of a tensor, broadly speaking, is a generalization of a matrix.

[^fn-only_ff]: Though the model can be expanded to include memory and planning, it is out of the scope of this article.
