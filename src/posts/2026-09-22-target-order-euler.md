---
layout: post
comments: true
title: "Using Euler's Circuit to Generate Order of Tasks in HCI Studies"
tags: ["hci"]
tagline: "Using Eulerian circuits and versions of it to balance task orders different target selection studies."
---

During some of my experiments with HPUI, I was collecting data on the time it takes to select or "click" a button in a target location given the previous button location selected in a sequential target selection task.
For this, I needed to make sure each `target x` → `target y` combination is seen by a given participant an equal number of times so that the data is balanced.
A latin-square based approach itself doesn't work for this as the same target is seen multiple times per participant.

To make sure each `target x` → `target y` combination is seen exactly N number of times, one could model this as a graph traversal problem: 
Treat each target location as a vertex in a fully connected directional graph.
An edge connecting `target x` to `target y` represents the transition between them.
Then, get a path in this graph that starts and ends at a given vertex, but traverses every single edge exactly once.
Repeating this path N times, would give the result I want.
An Eulerian circuit, covers exactly this use case - in a directed graph if each vertex has equal in degrees and out degrees and is strongly connected (there's a path from any vertex to any other vertex in the graph), that graph is said to have a Euler cycle or circuit. 
A fully connected directional graph easily clears this requirement.
I had ended up using the Hierholzer's algorithm to generate the circuits.
When I chain the circuit N number of times, I get what I needed - each `target x` → `target y` combination is seen N times by a given participant.

Some time later, we were running another study where we were measuring time to press down on a given target location and swipe or drag to another target location.
Here also we wanted to measure what happens given the last target the participant finished at.
What this means is, there are two components to consider: (1) make sure each swipe pair: swiping from `target x`  to `target y`, and (2) the transitions: the swipe ended in `target y` and the next swipe started at `target z`.
We decided to ensure there's an equal number of each [^1].
Here's the formulation I came up with: all the edges in the fully connected directional graph with all target locations as vertices are assigned one color - say red.
Then, all the edges in the graph are duplicated and assigned a different color - say green. 
If we say the red edges are representing swipes and green edges are representing the transition, then we can treat our ordering problem as a traversal problem that traverses all the edges, but with the caveat that two consecutive edges visited cannot be the same color.
The Hierholzer's algorithm for a Eulerian circuit keeps track of the edges from a given vertex that has not been traversed.
When a vertex is visited, the next vertex to visit is determined using this tracked list of untraveled edges.
I make a slight modification to achieve the two-color traversal formulation: for each vertex, keep track of two lists - one for each color.
Then, when traversing, you alternate between colors.
If the previous edge traversed was a green edge, you pick the next edge from the red list and vice versa.

Looking into the literature for this write-up, I learned that there's a paper [^2] that uses Eulerian circuits in the context of psychology and neuroscience to address first-order carryover effect in repeated-measures study designs - pretty much the approach we were using.
The alternating color approach I describe above is called alternating Eulerian circuits [^3].

[^1]: We considered the case where every combination of swipe pair and transition pair is considered, but that makes the study much longer than what would be viable.

[^2]: Brooks, J. L. (2012). Counterbalancing for serial order carryover effects in experimental condition orders. Psychological Methods, 17(4), 600–614. https://doi.org/10.1037/a0029310

[^3]: Benkouar, A., Manoussakis, Y., Paschos, V. T., & Saad, R. (1996). Hamiltonian problems in edge-colored complete graphs and Eulerian cycles in edge-colored graphs: some complexity results. RAIRO-Operations Research-Recherche Opérationnelle, 30(4), 417-438.
