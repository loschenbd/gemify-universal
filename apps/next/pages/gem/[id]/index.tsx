import { IdScreen } from 'app/features/gem/id-screen'
import Head from 'next/head'

import { NextPageWithLayout } from 'pages/_app'

export const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Id</title>
      </Head>
      <IdScreen />
    </>
  )
}

// Page.getLayout = (page) => <YourLayout>{page}</YourLayout>

export default Page
