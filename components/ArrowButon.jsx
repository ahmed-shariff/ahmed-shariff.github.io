import Link from "next/link";

export default function ArrowButon({text, href}) {
    return (
        <Link href={href} passHref>
            <a className="button relative group overflow-hidden px-6 h-12 rounded-full flex space-x-2 items-center border border-gray-200 shadow-md shadow-gray-800 hover:bg-gray-800">
                <span className="relative text-sm text-white">{text}</span>
                <div className="flex items-center -space-x-3 translate-x-3">
                    <div className="w-2.5 h-[1.6px] rounded bg-white origin-left scale-x-0 transition duration-300 group-hover:scale-x-100"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 stroke-white -translate-x-2 transition duration-300 group-hover:translate-x-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </a>
        </Link>
    );
}
