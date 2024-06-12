import '../public/web.css'
import '@tamagui/core/reset.css'
import '@tamagui/font-inter/css/400.css'
import '@tamagui/font-inter/css/700.css'
import { ColorScheme, NextThemeProvider, useRootTheme } from '@tamagui/next-theme'
import { Provider } from 'app/provider'
import { AuthProviderProps } from 'app/provider/auth'
import { api } from 'app/utils/api'
import { NextPage } from 'next'
import { Urbanist } from 'next/font/google'
import Head from 'next/head'
import 'raf/polyfill'
import { ReactElement, ReactNode } from 'react'
import type { SolitoAppProps } from 'solito'

if (process.env.NODE_ENV === 'production') {
  require('../public/tamagui.css')
}

const font = Urbanist({
  variable: '--my-font',
  subsets: ['latin'],
})

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

function MyApp({
  Component,
  pageProps,
}: SolitoAppProps<{ initialSession: AuthProviderProps['initialSession'] }>) {
  // reference: https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts
  const getLayout = Component.getLayout || ((page) => page)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_theme, setTheme] = useRootTheme()

  return (
    <>
      <div className={font.variable}>
        <Head>
          <title>Gemify</title>
          <meta name="Gemify" content="Steward Your Prohetic Words" />
          <link rel="icon" href="/favicon.svg" />
        </Head>
        <NextThemeProvider
          onChangeTheme={(next) => {
            setTheme(next as ColorScheme)
          }}
        >
          <Provider initialSession={pageProps.initialSession}>
            {getLayout(<Component {...pageProps} />)}
          </Provider>
        </NextThemeProvider>
      </div>
    </>
  )
}

export default api.withTRPC(MyApp)
