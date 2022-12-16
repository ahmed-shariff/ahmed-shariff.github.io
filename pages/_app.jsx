import '../styles/globals.css'
import BaseLayout from  '../components/BaseLayout'

function PersonalWebsite({ Component, pageProps }) {
    return (
        <BaseLayout>
            <Component {...pageProps} />
        </BaseLayout>
    );
}

export default PersonalWebsite
