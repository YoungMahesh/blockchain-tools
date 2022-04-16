import { useEffect, useState } from 'react'
import Head from 'next/head'
import type { ReactElement } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import LinearProgress from '@mui/material/LinearProgress'
import SendIcon from '@mui/icons-material/Send'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { getMultiSenderAddress } from '../backend/api/multisender'
import {
  btnTextTable,
  messagesTable,
  multisenderTable,
  processRecipientData
} from '../backend/api/utils'
import {
  getErc20Approval,
  getErc20Decimals,
  getTotalSumOfBignumbers
} from '../backend/common/erc20'
import TxnLink from '../components/TxnLink'
import { getErc721Approval } from '../backend/common/erc721'
import { getErc1155Approval } from '../backend/common/erc1155'
import TokenTypeSelector from '../components/TokenTypeSelector'
import useStore from '../backend/zustand/store'
import AlertMessages from '../components/AlertMessages'
import { transferToMultiSender } from '../backend/api/multisender'
import Layout from '../components/common/Layout'
import useStore0 from '../components/common/store0'
import Header from '../components/common/Header'

export default function MultiSender() {
  const theme = useTheme()

  const aboveLarge = useMediaQuery(theme.breakpoints.up('lg'))

  const chainId = useStore((state) => state.chainId)
  const chainIdMsg = useStore((state) => state.chainIdMsg)
  const setChainIdMsg = useStore((state) => state.setChainIdMsg)

  const walletMsg = useStore((state) => state.walletMsg)

  const [tokenType, setTokenType] = useState('erc20')
  const [tokenAddress, setTokenAddress] = useState('')
  const [recipientData, setRecipientData] = useState('')
  const [btnText, setBtnText] = useState(btnTextTable.SEND)

  const [message1, setMessage1] = useState('')
  const [txnHash, setTxnHash] = useState('')

  const setHideNetworks = useStore0((state) => state.setHideNetworks)
  useEffect(() => {
    setHideNetworks(false)
  }, [])

  useEffect(() => {
    if (getMultiSenderAddress(chainId) === '')
      setChainIdMsg(messagesTable.NOT_SUPPORTED)
    else setChainIdMsg('')
  }, [chainId])

  useEffect(() => {
    setTxnHash('')
  }, [tokenType])

  const handleTokenTransfer = async () => {
    setMessage1('')
    setTxnHash('')

    try {
      let decimals = 0
      if (tokenType === 'eth') decimals = 18
      else if (tokenType === 'erc20') {
        const decimals1 = await getErc20Decimals(tokenAddress)
        if (decimals1 === -1) {
          setMessage1(messagesTable.INVALID_TOKENADDRESS)
          return
        }
        decimals = decimals1
      }
      const { done, recipientsArr, tokenIdsArr, tokenAmountsInWeiArr } =
        processRecipientData(recipientData, tokenType, decimals)
      if (!done) {
        setMessage1(messagesTable.INVALID_DATA)
        return
      }

      setBtnText(btnTextTable.APPROVING)
      const totalAmountInWei = getTotalSumOfBignumbers(tokenAmountsInWeiArr)
      const multiSenderAddr = getMultiSenderAddress(chainId)
      let isApproved = true
      if (tokenType === 'erc20') {
        isApproved = await getErc20Approval(
          tokenAddress,
          multiSenderAddr,
          totalAmountInWei
        )
      } else if (tokenType === 'erc721') {
        isApproved = await getErc721Approval(tokenAddress, multiSenderAddr)
      } else if (tokenType === 'erc1155') {
        isApproved = await getErc1155Approval(tokenAddress, multiSenderAddr)
      }
      if (!isApproved) {
        setMessage1(messagesTable.APPROVAL_PROBLEM)
        setBtnText(btnTextTable.SEND)
        return
      }
      setBtnText(btnTextTable.SENDING)
      // console.log({ tokenType, tokenAddress, recipientsArr, tokenIdsArr, tokenAmountsInWeiArr })
      const { isTransferred, hash } = await transferToMultiSender(
        tokenType,
        tokenAddress,
        recipientsArr,
        tokenIdsArr,
        tokenAmountsInWeiArr
      )
      if (!isTransferred) {
        setMessage1(messagesTable.TRANSFER_PROBLEM)
        setBtnText(btnTextTable.SEND)
        return
      }
      setTxnHash(hash)
      setBtnText(btnTextTable.SEND)
    } catch (err) {
      console.log(err)
      setMessage1(messagesTable.TRANSFER_PROBLEM)
      setBtnText(btnTextTable.SEND)
    }
  }

  return (
    <div>
      <Head>
        <title>Multi Sender </title>
        <meta
          name="description"
          content="Send, Transfer ERC20, ERC721, ERC1155 tokens in batch"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header
        title="MultiSender"
        harmony
        songbird
        polygon
        fantom
        fantomTestnet
      />
      <Stack mx="auto" spacing={3} minWidth={aboveLarge ? '600px' : '400px'}>
        <TokenTypeSelector
          tokenType={tokenType}
          setTokenType={setTokenType}
          showEth={true}
        />

        {tokenType !== 'eth' && (
          <TextField
            fullWidth
            id="standard-basic"
            label="Token Address"
            variant="standard"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
          />
        )}

        <TextField
          fullWidth
          id="standard-multiline-static"
          label={(() => {
            if (tokenType === 'eth' || tokenType === 'erc20') {
              return multisenderTable.REC_AMT_TXT
            } else if (tokenType === 'erc721') {
              return multisenderTable.REC_ID_TXT
            } else if (tokenType === 'erc1155') {
              return multisenderTable.REC_ID_AMT_TXT
            }
          })()}
          multiline
          rows={4}
          variant="standard"
          placeholder={(() => {
            if (tokenType === 'eth' || tokenType === 'erc20') {
              return multisenderTable.REC_AMT_VAL
            } else if (tokenType === 'erc721') {
              return multisenderTable.REC_ID_VAL
            } else if (tokenType === 'erc1155') {
              return multisenderTable.REC_ID_AMT_VAL
            }
          })()}
          value={recipientData}
          onChange={(e) => setRecipientData(e.target.value)}
        />

        <Button
          onClick={handleTokenTransfer}
          disabled={
            chainIdMsg === messagesTable.NOT_INSTALLED ||
            chainIdMsg === messagesTable.NOT_SUPPORTED ||
            walletMsg === messagesTable.METAMASK_LOCKED ||
            btnText === btnTextTable.APPROVING ||
            btnText === btnTextTable.SENDING
          }
          variant="contained"
          endIcon={<SendIcon />}
        >
          {btnText}
        </Button>
        {(btnText === btnTextTable.APPROVING ||
          btnText === btnTextTable.SENDING) && <LinearProgress />}

        <AlertMessages message1={message1} />

        {txnHash.length > 0 && <TxnLink chainId={chainId} txnHash={txnHash} />}
      </Stack>
    </div>
  )
}

MultiSender.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
