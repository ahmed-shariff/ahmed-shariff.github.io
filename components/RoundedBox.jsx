import { useRouter } from 'next/router'

export default function RoundedBox({ children, href }) {
    const router = useRouter();
    
    return (
        <div className='border border-gray-200 m-2 rounded-xl shadow-md shadow-gray-800 overflow-hidden flex flex-col text-ellipsis h-500 transition duration-100 hover:bg-gray-800'>
            <button className="p-3 text-left" onClick={() => router.push(href)}>
                {children}
            </button>
        </div>);
}
