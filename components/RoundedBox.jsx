import Link from 'next/link';
import { useRouter } from 'next/router';
import AnimatedSection from './AnimatedSection';

export default function RoundedBox({ children, href }) {
    const router = useRouter();

    return (
        <AnimatedSection className='border border-gray-200 m-2 rounded-xl shadow-md shadow-gray-800 overflow-hidden flex flex-col text-ellipsis min-h-24 max-h-64'>
            <button onClick={() => router.push(href)} className='flex w-100 text-left button h-full'>
                {children}
            </button>
        </AnimatedSection >
    );
}
