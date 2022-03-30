import Head from 'next/head'
import { utils } from 'ethers'
import { ReactElement, useEffect } from 'react'
import Box from '@mui/material/Box'
import Layout from '../components/common/Layout'
import useStore0 from '../components/common/store0'
import Decimals from '../components/converter/Decimals'
import UnixTime from '../components/converter/UnixTime'

export default function Converter() {
  const setHideNetworks = useStore0((state) => state.setHideNetworks)

  useEffect(() => {
    setHideNetworks(true)
  }, [])

  return (
    <>
      <Head>
        <title>Converter</title>
        <meta name="description" content="Convert to and from 18 decimals" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Decimals />

      <UnixTime />
    </>
  )
}

Converter.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
