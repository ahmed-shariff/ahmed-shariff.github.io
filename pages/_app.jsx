import '../styles/globals.css'
import BlogLayout from  '../components/BlogLayout'

function MyApp({ Component, pageProps }) {
    
    return (
        <BlogLayout>
            <Component {...pageProps} />
        </BlogLayout>
    );
}

export default MyApp
