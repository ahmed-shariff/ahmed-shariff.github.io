---
ispub: true
title: "What's the Thumb Doing? Improving Precision for Thumb-to-Finger Interactions on Hand Proximate User Interfaces"
date: '2025-05-26'
authors: "<b>Shariff AM Faleel</b>, Rishav Banerjee, Omang Baheti, Khalad Hasan, and Pourang Irani"
venue: "GI '25"
type: 'Conference'
pdf:  https://dl.acm.org/doi/10.1145/3769872.3769893?cid=99659534363
citation: "Sharif AM Faleel, Rishav Banerjee, Omang Baheti, Khalad Hasan, and Pourang Irani. 2025. What’s the Thumb Doing? Improving Precision for Thumb-to-Finger Interactions on Hand Proximate User Interfaces. In Graphics Interface 2025 (GI ’25), May 26–29, 2025, Okanagan, BC, Canada. ACM, New York, NY, USA, 14 pages. https://doi.org/10.1145/3769872.3769893"
doi: 10.1145/3769872.3769893
paperurl: https://doi.org/10.1145/3769872.3769893
abstract: "Hand Proximate User Interfaces (HPUI) on Head Mounted Displays (HMD) leverage hand tracking to anchor content on the hand and interact with it using thumb-to-finger interactions. Similar to many other interaction techniques on HMDs, HPUI realizes these interactions by combining simple geometry in game engines. This, in turn, leads to accidental triggers, akin to the 'fat-finger problem' on touch screens. To address this, we explore and provide insight into how the thumb's surface interacts when using HPUI by approximating the thumb's surface with a large number of raycasts. We observe that different regions of the thumb are used when interacting with different parts of the hand. The results also highlight the need to consider the temporal component. We then propose approaches to improving the precision of thumb-to-finger interactions on HPUI and show that these improve target selection accuracy with denser target layouts."
tags: ["HPUI"]
thumbnail: "2025-05-26/teaser.png"
thumbnailDescription: "Shows the interaction of thumb-to-finger interactions with two targets on the distal phalanx of the index finger on HPUI. (a) Shows using the collision volume that represents the thumb in a physic engine. In this example, the collision volume of the thumb is colliding with both targets. (b) To better understand what happens, the spherical collision volume is replaced with raycasts. The figure shows the cross-section of the raycasts and highlights the rays that are interacting with the targets in green. This raycast-based approach is also further used to improve the accuracy of target selection. (c) Shows the number of participants who had utilized a given ray when selecting the respective targets during the data collection study."
---

For using the raycast based approach for interactions, see the [HPUI-Core unity package](https://ovi-lab.github.io/HPUI-Docs/HPUI-Core.html)

```latex
   @inproceedings{10.1145/3769872.3769893,
   author = {Faleel, Shariff Am and Banerjee, Rishav and Baheti, Omang and Hasan, Khalad and Irani, Pourang},
   title = {What's the Thumb Doing? Improving Precision for Thumb-to-Finger Interactions on Hand Proximate User Interfaces},
   year = {2026},
   isbn = {9798400718762},
   publisher = {Association for Computing Machinery},
   address = {New York, NY, USA},
   url = {https://doi.org/10.1145/3769872.3769893},
   doi = {10.1145/3769872.3769893},
   abstract = {Hand Proximate User Interfaces (HPUI) on Head Mounted Displays (HMD) leverage hand tracking to anchor content on the hand and interact with it using thumb-to-finger interactions. Similar to many other interaction techniques on HMDs, HPUI realizes these interactions by combining simple geometry in game engines. This, in turn, leads to accidental triggers, akin to the "fat-finger problem" on touch screens. To address this, we explore and provide insight into how the thumb’s surface interacts when using HPUI by approximating the thumb’s surface with a large number of raycasts. We observe that different regions of the thumb are used when interacting with different parts of the hand. The results also highlight the need to consider the temporal component. We then propose approaches to improving the precision of thumb-to-finger interactions on HPUI and show that these improve target selection accuracy with denser target layouts.},
   booktitle = {Proceedings of the 51st Graphics Interface Conference 2025},
   articleno = {21},
   numpages = {14},
   keywords = {virtual reality, game engines, fat-finger, hand proximate user interfaces, thumb-to-finger interactions},
   location = {},
   series = {GI '25}
}
```
