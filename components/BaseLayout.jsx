import { IconContext } from "react-icons";
import Link from "next/link";
import { SiGithub } from "react-icons/si";
import { IoIosArrowDropupCircle } from "react-icons/io";


function NavButton({ children, href, className }) {
    return (
        <Link href={href} passHref>
            <a className={`transition duration-100 bg-transparent shadow-md shadow-transparent rounded-lg hover:shadow-gray-900 hover:bg-gray-700 hover:underline hover:decoration-2 px-4 py-2 items-center ${className}`}>
                {children}
            </a>
        </Link>
    );
}

function NavLink({children, href, className}) {
    return (
        <Link href={href} passHref>
            <div className={`block px-4 py-2 rounded-lg hover:bg-gray-600 hover:underline hover:decoration-2 items-center justify-left ${className}`} >
                {children}
            </div>
        </Link>
    );
}

export default function BaseLayout({ children }) {
    return (
        <div className='flex flex-col min-h-screen bg-slate-700'>
            <header className='bg-gray-800 mb-8 py-1 text-gray-300 md:sticky top-0 left-0 right-0'>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/katex.min.css" integrity="sha384-KiWOvVjnN8qwAZbuQyWDIbfCLFhLXNETzBQjA/92pIowpC0d2O3nppDGQVgwd2nB" crossOrigin="anonymous" />

                <script defer src="https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/katex.min.js" integrity="sha384-0fdwu/T/EQMsQlrHCCHoH10pkPLlKA1jL5dFyUOvB3lfeT2540/2g6YgSi2BL14p" crossOrigin="anonymous"></script>

                <script defer src="https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/contrib/auto-render.min.js" integrity="sha384-+XBljXPPiv+OzfbB3cVmLHf4hdUFHlWNZN5spNQ7rmHTXpd7WvJum6fIACpNNfIR" crossOrigin="anonymous"
                    onLoad={() => renderMathInElement(document.body)}></script>
                <div className='container mx-auto flex flex-col md:flex-row gap-x-12 items-center justify-center'>
                    <NavButton className="font-semibold text-lg" href="/">Shariff Faleel</NavButton>
                    <NavButton href="/posts">Posts</NavButton>
                    <NavButton href={{ "pathname": "/posts", "query": { pub: true } }}>Publications</NavButton>
                    <NavButton className="group" href="">
                        <div>
                            Quick links
                            <svg fill="currentColor"
                                viewBox="0 0 20 20"
                                className="inline w-4 h-4 mt-1 ml-1 transition-transform duration-200 transform md:-mt-1 rotate-0 group-hover:rotate-180">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                            </svg>
                        </div>
                        <div
                            className="absolute w-full mt-2 origin-top-right rounded-md shadow-lg w-fit transition-transform transition-opacity ease-in-out duration-200 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100" >
                            <div className="p-2 bg-gray-700 rounded-md shadow dark-mode:bg-gray-700">
                                <NavLink href="https://gist.github.com/ahmed-shariff" className="flex flex-row space-x-2"> <div><SiGithub /></div><div>github-gists</div></NavLink>
                            </div>
                        </div>
                    </NavButton>
                </div >
            </header >
            <IconContext.Provider value={{ className: "fill-sky-400" }}>
                <main className='container mx-auto flex-1'>{children}</main>
                <div className="fixed bottom-4 right-4" >
                    <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
                        <IoIosArrowDropupCircle size={60} className="fill-gray-900 rounded-full bg-slate-600" />
                    </button>
                </div>
            </IconContext.Provider>
            <footer className='bg-gray-800 mt-8 py-4 text-gray-300'>
                <div className='container mx-auto flex justify-center text-sm'>
                    &copy; 2022 Shariff Faleel
                </div>
            </footer>
        </div >
    );
}
