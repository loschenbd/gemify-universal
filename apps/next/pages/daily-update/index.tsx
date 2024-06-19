import { DailyUpdateScreen } from 'app/features/daily-update/daily-update-screen'
import Head from 'next/head'

import { NextPageWithLayout } from 'pages/_app'

export const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Daily Update</title>
      </Head>
      <DailyUpdateScreen />
    </>
  )
}

// Page.getLayout = (page) => <YourLayout>{page}</YourLayout>



export default Page
