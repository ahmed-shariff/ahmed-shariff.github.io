import { IconContext } from "react-icons";
import { useRouter } from "next/router";


function NavButton({children, onClick, className}) {
    return (
        <button className={`hover:rounded-lg hover:bg-gray-700 hover:underline hover:decoration-2 px-4 py-2 items-center${className}`} onClick={onClick}>
            {children}
        </button>
    )
}

export default function BaseLayout({ children }) {
    const router = useRouter();

    return (
        <div className='flex flex-col min-h-screen bg-slate-700'>
            <header className='bg-gray-800 mb-8 py-1 text-gray-300'>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/katex.min.css" integrity="sha384-KiWOvVjnN8qwAZbuQyWDIbfCLFhLXNETzBQjA/92pIowpC0d2O3nppDGQVgwd2nB" crossOrigin="anonymous" />

                <script defer src="https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/katex.min.js" integrity="sha384-0fdwu/T/EQMsQlrHCCHoH10pkPLlKA1jL5dFyUOvB3lfeT2540/2g6YgSi2BL14p" crossOrigin="anonymous"></script>

                <script defer src="https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/contrib/auto-render.min.js" integrity="sha384-+XBljXPPiv+OzfbB3cVmLHf4hdUFHlWNZN5spNQ7rmHTXpd7WvJum6fIACpNNfIR" crossOrigin="anonymous"
                    onLoad={() => renderMathInElement(document.body)}></script>
                <div className='container mx-auto flex flex-wrap space-x-12 items-center justify-center'>
                    <NavButton className="font-semibold text-xl" onClick={() => router.push("/")}>Shariff Faleel</NavButton>
                    <NavButton onClick={() => router.push("/posts")}>Posts</NavButton>
                </div >
            </header >
            <IconContext.Provider value={{ className: "fill-sky-400" }}>
                <main className='container mx-auto flex-1'>{children}</main>
            </IconContext.Provider>
            <footer className='bg-gray-800 mt-8 py-4 text-gray-300'>
                <div className='container mx-auto flex justify-center text-sm'>
                    &copy; 2022 Shariff Faleel
                </div>
            </footer>
        </div >
    );
}
