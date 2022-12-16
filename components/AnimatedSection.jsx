/* import { useInView } from 'react-intersection-observer'; */
import { keyframes } from "@emotion/react";
import { Reveal } from "react-awesome-reveal";


const revealAnimation = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0px, -20px, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

function AnimatedSection({ children, className }) {
    /* const [ref, inView, entry] = useInView({
*     threshold: 0,
*     triggerOnce: true
* });

* const animationClass = inView ? "translate-y-0 opacity-100" : "opacity-0 translate-y-16"; */

    return (
        <Reveal keyframes={revealAnimation} className={className}>
            {children}
        </Reveal>);
}

export default AnimatedSection;
