---
layout: post
comments: true
title: "Using Euler's Circuit to Generate Order of Tasks in HCI Studies"
tags: ["hci"]
tagline: "Using Eulerian circuits and versions of it to balance task orders different target selection studies."
---

During some of my experiments with HPUI, I was collecting data on the time it takes to select or "click" a button in a target location given the previous button location.
For this, I needed to make sure each `target x` → `target y` combination is seen by a given participant an equal number of times.
A latinquare based approach itself doesn't work for this as the same target is seen multiple times per participant.

To make sure each `target x` → `target y` combination is seen exactly N number of times, one could model this as a graph traversal problem: 
Treat each target as a vertex, and the graph of interest is a fully connected graph.
Then, get a path in this graph that starts and ends at a given vertex, and traverses every single edge exactly one time.
Repeating this path N times, would give the result I want.
An Eulerian circuit, covers exactly this use case - in a directed graph if each vertex has equal in degree and out degree and is strongly connected (there's a path from any vertex to any other vertex in the graph), that graph is said to have a Euler cycle or circuit. 
A fully connected graph easily clears this requirement.
I had ended up using the Hierholzer's algorithm to generate the circuits.
When I chain the circuit N number of times, I get what I needed - each `target x` → `target y` combination is seen N times by a given participant.

Some time later, we were running another study where we were measuring time to press down on a given target and swipe or drag to another target location.
Here also we wanted to measure what happens given the last target you finished at.
What this means is, we now control two things: (1) make sure each swipe pair: swiping from `target x`  to `target y` is seen an equal number of times, and (2) the transitions: the swipe ended in `target y` and the next swipe started at `target z`.
Here's the formulation I came up with: the fully connected graph with all target locations as vertices are assigned one color - say red.
Then, all the edges in the graph are duplicated and assigned a different color - say green. 
If we say the red edges are representing swipes and green edges are representing the transition, then the traversal problem is a full circuit that visits all the edges, but two consecutive edges visited cannot be the same color.
The Hierholzer's algorithm for a Eulerian circuit keeps track of the edges from a given vertex that has not been traversed.
When a vertex is visited, the next vertex to visit is determined using this tracked list of untraveled edges.
I make a slight modification to achieve the two-color traversal formulation: for each vertex, keep track of two lists - one for each color.
Then, when traversing, you alternate between colors.
If the previous edge traversed was a green edge, you pick the next edge from the red list and vice versa.

Looking into the literature for this write-up, I learned that there's a paper [^1] that using Eulerian circuits in the context of psychology and neuroscience to address first-order carryover effect in repeated-measures study designs.
The alternating color approach I describe above is called alternating Eulerian circuits [^2].

[^1]: Brooks, J. L. (2012). Counterbalancing for serial order carryover effects in experimental condition orders. Psychological Methods, 17(4), 600–614. https://doi.org/10.1037/a0029310

[^2]: Benkouar, A., Manoussakis, Y., Paschos, V. T., & Saad, R. (1996). Hamiltonian problems in edge-colored complete graphs and Eulerian cycles in edge-colored graphs: some complexity results. RAIRO-Operations Research-Recherche Opérationnelle, 30(4), 417-438.
