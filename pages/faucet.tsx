import Head from 'next/head'
import type { ReactElement } from 'react'
import Layout from '../components/common/Layout'
import { getFaucetAddress } from '../backend/api/faucet'
import { messagesTable } from '../backend/api/utils'
import { useEffect, useState } from 'react'
import Stack from '@mui/material/Stack'
import FaucetToken from '../components/FaucetToken'
import TokenTypeSelector from '../components/TokenTypeSelector'
import useStore from '../backend/zustand/store'
import AlertMessages from '../components/AlertMessages'
import useStore0 from '../components/common/store0'

export default function Faucet() {
  const chainId = useStore((state) => state.chainId)
  const chainIdMsg = useStore((state) => state.chainIdMsg)
  const setChainIdMsg = useStore((state) => state.setChainIdMsg)
  const setHideNetworks = useStore0((state) => state.setHideNetworks)
  const walletMsg = useStore((state) => state.walletMsg)

  const [tokenType, setTokenType] = useState('erc20')
  const [message1, setMessage1] = useState('')

  useEffect(() => {
    if (getFaucetAddress(chainId) === '')
      setChainIdMsg(messagesTable.NOT_SUPPORTED)
    else setChainIdMsg('')
  }, [chainId])

  useEffect(() => {
    setHideNetworks(false)
  }, [])

  return (
    <div>
      <Head>
        <title>Faucet</title>
        <meta name="description" content="Lock ERC20, ERC721, ERC1155 Tokens" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Stack mx="auto" spacing={3} maxWidth="400px">
        {!(
          chainIdMsg === messagesTable.NOT_INSTALLED ||
          chainIdMsg === messagesTable.NOT_SUPPORTED ||
          walletMsg === messagesTable.METAMASK_LOCKED
        ) && (
          <>
            <TokenTypeSelector
              tokenType={tokenType}
              setTokenType={setTokenType}
              showEth={true}
            />
            <FaucetToken
              chainId={chainId}
              tokenType={tokenType}
              setMessage1={setMessage1}
            />
          </>
        )}
        <AlertMessages message1={message1} />
      </Stack>
    </div>
  )
}

Faucet.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
