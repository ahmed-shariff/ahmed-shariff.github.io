import '../styles/globals.css'
import BaseLayout from '../components/BaseLayout'
import { DefaultSeo } from 'next-seo';

function PersonalWebsite({ Component, pageProps }) {
    return (
        <>
            <DefaultSeo
                openGraph={{
                    type: 'website',
                    locale: 'en_CA',
                    url: 'https://shariff-faleel.com/',
                    siteName: 'Personal website of Shariff Faleel',
                }}
                twitter={{
                    handle: '@_ahmedshariff_',
                    site: '@_ahmedshariff_',
                    cardType: 'summary_large_image',
                }}
            />
            <BaseLayout>
                <Component {...pageProps} />
            </BaseLayout>
        </>
    );
}

export default PersonalWebsite
