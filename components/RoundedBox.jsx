export default function RoundedBox({ children, href }) {
    return (
        <div className='border border-gray-200 m-2 rounded-xl shadow-md shadow-gray-800 overflow-hidden flex flex-col text-ellipsis h-500 transition duration-100 hover:bg-gray-800'>
            <a className="p-3 text-left button" href={href}>
                {children}
            </a>
        </div>);
}
