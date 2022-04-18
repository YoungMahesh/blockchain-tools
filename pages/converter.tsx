import Head from 'next/head'
import { utils } from 'ethers'
import { ReactElement, useEffect } from 'react'
import Box from '@mui/material/Box'
import Layout from '../components/common/Layout'
import useStore0 from '../components/common/store0'
import Decimals from '../components/converter/Decimals'
import UnixTime from '../components/converter/UnixTime'
import Ipfs from '../components/converter/Ipfs'

export default function Converter() {
  return (
    <>
      <Head>
        <title>Converter</title>
        <meta name="description" content="Convert to and from 18 decimals" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Decimals />
      <UnixTime />
      <Ipfs />
    </>
  )
}

Converter.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
