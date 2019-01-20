---
layout: post
comments: true
title: Building a dialogue manager - A retrospective
tags: ["deep learning", "NLP"]
tagline: Lesons learnt and thoughts after working on the dialogue management model
---

My paper on the dialogue manager I worked on as part of my undergraduate course was accepted. I had taken a break from the NLP scene and only recently started working on it again. In the spirit of how fast machine learning is progressing, the year-and-a-half-long break has seen alot of progress in this domain as well (I am still figuring out ho to keep up with all of it). So, here I am, piecing together my thoughts. I'd be talking about what is it I had done, and why, and then discuss what is being done and the direction I intend to move in. 

## A Day in the Dialogue manager's life

A dialogue manager is part of a spoken dialogue system (SDS). Generally, a spoken dialogue system has five components: Automated speech recognizer (ASR), Natural language understanding (NLU), dialogue manager (DM), Natural language generation (NLG) and Text to speech (TTS). Let me describe what these do through an example dialogue exchange. Say we have a SDS that simply turns on and off a set of lights on a user's behest. Lets say the user starts with saying "hey budd, switch on the light will you". First the ASR will process the utterance and produce a textual representation of the utterance. The NLU will produce a representation understood by the DM. It can be anything from raw text, POS tags, dialogue act, word embedding, etc. The DM will take the processed utterance and decide what it should do or say. Once it has decided how to respond to what the user said it will send a signal to the NLG which would translate that to a textual representation which in turn will be produced as voice signal by the TTS. That would be the basic cycle the SDS will be taking on every turn. Now to the utterance the user provided: the DM gets the utterance (represented in a way the DM understands) and it understands that the user wants to switch on a light, but the user's input is vague as to which light needs to be switched on. So the DM will need to have to get that piece of information from the user. As such, the NLG gets a signal which it translates to something along the lines of "umm, which light are we talking about?". While the DM waits for the user to answer the query, it will be keeping tabs on what the user has said in the exchange so far, what has been done in the context of the dialogue exchange, what needs to be done and what the DM is expecting from the user. 

Lets consider two scenarios, first the simpler case: the user just says which light to switch on: "light number 3". Now the DM simply has to send a signal to "light number 3" to switch the light on; end of the dialogue exchange. The second scenario: the user does't know what lights are there or doesn't know how to refer to them, hence  asks: "what lights can you switch on?". The DM will now put on hold trying to switch on a light and infer what are the lights it can actually work with. Once it has inferred said information, it will relay the information to the user. Lets say the DM decides to say "I can handle the lights one, three, five and six". Like in scenario one, the user can say "light number three" bring the exchange to a conclusion same as before or say the "second one". The utterance "second one" on it's own can mean anything, the second world war? the second muffin? Only in the context of the dialogue does this make any sense to the DM. Hence, if I am the DM, this is what I will have to work out:

- "Second" of what? oh wait, I gave a list in the last turn didn't I! So the user is talking about the "light number three".
- What do I do with "light number three"? Ah, I believe I asked the user which light.
- Wait, why did I ask about a light? Right! The user asked to me to turn on a light.
- Now I know what to do, "Hey light number three! turn your self on will ya!"

How our minds manage to do this seamlessly, that's a whole other discussion. Now that the DM has inferred that the user meant to turn on the "light number three", the DM can send the signal to "light number three". To make sure it did get things right, it can ask the user for confirmation on that.

## My model

There are two core insights I am drawing from to build my model. 

- What an utterance means to the system: an action/operation the system can perform.
- Every operation a system can perform can be described using a function.

Before I dive into what an utterance means to the system, what does an utterance mean to a human? what is meaning? Well, language on it's own has no meaning, it's simply a collection of symbols and sounds. Meaning arises from what we relate these symbols and sounds to. Which explains why various parts of our brain lights up as we are engaging using language (CITE). Take for example the question "what is blue". If a child grows being taught that what we refer to as red is blue, and someday it meets someone out from the world and hear them say that the sky is blue, that child is going to be very confused. Another way of thinking of this is, how do you explain what blue is a to a blind person. In linguistics, among many theories that try to {------concede-----} meaning and language, the speech act theory has been used widely in the context of dialogue management. The speech act theory states that every utterance made by a human is an action in on itself. The concept of dialogue acts comes from the speech act theory. Broadly speaking, each and every utterance is identified as a dialogue act, such as an information providing act or information requesting act. If we look at the sample scenario discussed earlier, this would be more apparent. There are a few attempts at standardizing dialogue acts such as DIT++ and DAMSL. The problem with these existing standard dialogue acts is that they are prmarily modeled from the perspective of the human.
