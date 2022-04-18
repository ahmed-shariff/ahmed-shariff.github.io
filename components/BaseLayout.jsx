import { IconContext } from "react-icons";
import Link from 'next/link';

export default function BaseLayout({ children }) {
    return (
        <div className='flex flex-col min-h-screen'>
            <header className='bg-sky-100 mb-8 py-4'>
                <div className='container mx-auto flex justify-center'>
                    <Link href='/'>
                        Shariff Faleel
                    </Link>
                </div>
            </header>
            <IconContext.Provider value={{ className: "fill-sky-800" }}>
                <main className='container mx-auto flex-1'>{children}</main>
            </IconContext.Provider>
            <footer className='bg-sky-100 mt-8 py-4'>
                <div className='container mx-auto flex justify-center text-sm'>
                    &copy; 2022 Shariff Faleel
                </div>
            </footer>
        </div>
    );
}
