import { useInView } from 'react-intersection-observer';

function AnimatedSection({ children, className }) {
    const [ref, inView, entry] = useInView({
        threshold: 0,
        triggerOnce: true
    });

    const animationClass = inView ? "translate-y-0 opacity-100" : "opacity-0 translate-y-16";

    return (
        <div ref={ref} className={`${className} transition transform duration-500 ${animationClass}`}>
            {children}
        </div >);
}

export default AnimatedSection;
