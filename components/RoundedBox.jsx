import AnimatedSection from './AnimatedSection';

export default function RoundedBox({ children, href }) {
    return (
        <AnimatedSection className='border border-gray-200 m-2 rounded-xl shadow-md shadow-gray-800 overflow-hidden flex flex-col text-ellipsis h-500'>
            <a className="flex w-100 text-left button" href={href}>
                {children}
            </a>
        </AnimatedSection>
    );
}
