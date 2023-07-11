import './globals.css'
import '@mantine/core/styles.css';

import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import BaseLayout from './BaseLayout'

export const metadata = {
    title:"Home Page for Shariff Faleel's website",
    description:"Home Page for Shariff Faleel's website. You can see his blog posts, publication and more information about him.",
    canonical:"https://shariff-faleel.com/"
}

export default function RootLayout({ children }) {
  return (
      <html lang="en">
          <head>
              <ColorSchemeScript />
          </head>
          <body>
              <MantineProvider>
                  {children}
              </MantineProvider>
          </body>
      </html>
    );
}
