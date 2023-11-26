---
layout: post
comments: true
title: Writely (Part 2) - Face the kraken
tags: ["course", "hci"]
tagline: Second iteration of the canhap project, where wrestle the haptic implementations on our system.
---

### Recap from [iteration 1](./2021-03-08-canhap_writely_i1):

Our goal was to train the non-dominant hand to write items. In the first iteration we had tried to narrow down what could be done for this project and identify the types of feedback we would want to render to the user, which were:
1. Partial feedback: Where the participants would receive a force feedback when they veer off too much from their path.
2. Full feedback: Where the user is guided throughout the writing process.
3. Anti-guiding: In this method, the system actively forces the user off the path the user is expected to follow.
4. Disturbance: Here the user is provided a random nudge now and then.

Consequently we had set out to build a foundational platform and the gather the necessary tools. Primarily, we built a [3D printed pen effector](https://bradleyrrr.github.io/sample/pi1.html#haply-modifications) the [UI component, tested out a pressure sensor](./2021-03-08-canhap_writely_i1) and did some preliminary exploration on [how to actually "write" using the haply](https://joshibibhushan.medium.com/writely-iteration-1-438068380fcc#4077).

### The Kraken

The goal of this iteration implement and test the different haptic feedback mechanisms. The biggest challenges were around two components. First, was around calculating how "correct" the current position of the user is. If it is just inside-the-letter-or-outside it would be pretty straightforward. But the way we had conceptualized this system, we need to know "how much" inside-the-letter-or-outside we are. The second was about how to render the force. I am going to start by talking about how we tackled the force rendering problem. Then discuss how the positions were calculated and wrap up with how we render the haptic feedbacks.

#### Rendering the force

Initially we thought we'd need the force calculation we had used for the [PID lab](./2021-02-26-canhap-lab4). We started by trying to set the values for the P, I and D to do what we wanted. It was only later we had realized that fisca (which we used in [lab 2](./2021-02-05-canhap-lab2) and then in [lab 3](./2021-03-12-canhap-lab3)) also basically uses a PID system internally to address the issue of positioning the end effector of the haply. After playing around with the library, to use the positioning functions used by fisca and also add an additional force, we simply had to manipulate the force fisca's physics engine calculates before rending it into haply. This also helped with my lab 3 submission, where I used fisca to render different types of haptic feedback to [convey a "word"](./2021-03-12-canhap-lab3). So we wound up completely stripping the PID code and refactoring the system to use fisca. 

#### Position calculations

Bibushan had done a pretty cool implementation of using the font files itself to generate the letters in the form of a `FPoly`. `FPloy` is one of the classes from fisca, so having the fonts as `FPoly` objects allows us to connect it with fisca. The following figure demonstrates this system which uses the `geommetric` library to generate the letters.

![01](/assets/2021-03-29/01_fonts.gif)

This method basically uses the outer vertices defined by the font to draw object. All except the disturbance feedback required knowing the center of the letter, i.e, the inner vertices. For the initial iteration, I tried moving horizontally and vertically from the position of the end effector on the screen and picking the closest edges on the screen (in this case, simply check for a change in color). And if I am inside the letter, which we can get using fisca's `isTouching` method. Following that, the idea was to calculate the closest edge and then get the edge on the opposite vector. The following shows the edge of the font being picked being marked by a red circle.

![02](/assets/2021-03-29/02_vh_border.gif)

Two problems stood out which blocked us from proceeding. First, this method is not always reliable, specially when considering letters that have anything other than vertical or horizontal lines. Checking diagonals also could have improved the approximation of the edge. But, the second issue was the showstopper: getting this method to work with letter that have "junctions", think the letter "T". Once, we realized it would be tricky to solve this problem, we went back to the drawing board. 

Building off Bibushans `Alphabets` system, I resorted to using the inner vertices for the font, and draw lines with a given thickness to render fonts. Which turned out to be a simpler solution, with a few caveats: First, the inner vertices cannot be drawn from the font files, which means we have to manually calculate and specify the vertices. Second, drawing smooth rounded lines is not possible. But this approaches allowed us to get started on trying out the haptic feedback, so we are using this approach for now. The following image demonstrates the basic idea.

![03](/assets/2021-03-29/03_graph.png)

The points provided would be P1, P2 and P3. As shown, using fisca's `FLine` lines are drawn with a certain thickness. Then to calculate the position the end effector (EE), project the position EE on the extended line of each line segment (blue arrows). Then get the line segment which is closest and also the projection calls inside the line segment. For example, in the above diagram, the EE falls outside the P2 to P3 line segment. Hence will not be used. Hence the problem of guiding or anti-guiding becomes rendering a force proportional to the distance from the EE to the projection on the line segment.

### The haptic feedback

Through this implementation, we were not able to clearly establish what partial feedback is. Hence for now, we are not considering the partial feedback. The other feedbacks are calculated as follows: For disturbance, Bradely tackled this one and also attempted a mini user study to understand what properties work best. The idea was to randomly generate a force in a random direction.

With the other two, as described in the previous section, we render a force proportional to distance to the closes line segment. We realized having this feedback while outside of the letter (i.e not in touch with the line segment) was not very useful or comfortable. Hence we restricted the force rendering only when the EE is touching any of the `FLine`s representing the line segments. Another issue we ran into was that when the user first touches the letter with the EE, the force rendered immediately can be too much it completely force the user off the letter. Dampeining didn't help much here. Hence, to avoid this we used a ramping function to ease in the force being rendered. To further smoothen  the force we , we used theFor guidance, it was force proportional to distance vector (blue arrows), and for the anti-guidance it was inversely proportional. The following demos show drawing on a random shape with visualizations of the force being rendered, the closest point picked up on the line, and the drawn letter. (ps: the force lines shown in the below diagram are in the direction of the vector calculated (blue arrrow in above diagram) and not the force itself)

For guiding, I am starting with showing the force being rendered when moving away from the center of the line segment. Then draw around by deliberately trying to go off the path:
![04](/assets/2021-03-29/04_full_guiding.gif)

For anti-guiding:
![05](/assets/2021-03-29/05_anti_guiding.gif)

### Reflections

As someone used to solving problem with code, it was interesting to see how hardware plays into this. Since the haply's "mood" plays a huge part in this system, relying just on code solution didn't work for us; as a result we had to try different approaches, particularly with calculating the relevant vector values. Naturally, I immensely enjoyed solving the different math and programming problems, figuring out to work with the hardware was much appreciated icing on the cake.

Another interesting observation that came about was with the different haptic feedback. The full guidance seems to take effort off of me, whereas the anti-guidance requires me to pt in more effort into the process to "write" properly. I was not expecting these different approaches to have such a distinct feeling from one another. I still haven't had the chance to watch someone else experience this. Which one would result in a training out motor skills would be the bulk of our third iteration. Bradely had already formulated a questionnaire and a study design, we'll be working off that to further tweak the system to identify which feedback mechanism works best.

Not to mention, we still have a few bugs and technical issues that needs solving (eg. the jittering in the anti-guidance approach). Overall, this has been a pleasant learning experience and I am looking forward to the final iteration of this project.
