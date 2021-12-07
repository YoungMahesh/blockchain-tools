import Head from 'next/head'
import {
  TextField, Box,
  Button, Stack, LinearProgress
} from '@mui/material'
import { getMultiSenderAddress, getSigner } from '../backend/common/web3Provider'
import { btnTextTable, messagesTable, processRecipientData } from '../backend/api/utils'
import { Send as SendIcon } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { convertAmountsToWei, getErc20Approval, transferErc20 } from '../backend/common/erc20'
import TxnLink from '../components/TxnLink'
import { getErc721Approval, transferErc721 } from '../backend/api/erc721'
import { getErc1155Approval, transferErc1155 } from '../backend/api/erc1155'
import TokenTypeSelector from '../components/TokenTypeSelector'
import useStore from '../backend/zustand/store'
import AlertMessages from '../components/AlertMessages'

export default function Home() {

  const chainId = useStore(state => state.chainId)
  const chainIdMsg = useStore(state => state.chainIdMsg)
  const setChainIdMsg = useStore(state => state.setChainIdMsg)

  const walletMsg = useStore(state => state.walletMsg)

  const [tokenType, setTokenType] = useState('erc20')
  const [tokenAddress, setTokenAddress] = useState('')
  const [recipientData, setRecipientData] = useState('')
  const [btnText, setBtnText] = useState(btnTextTable.SEND)

  const [message1, setMessage1] = useState('')
  const [txnHash, setTxnHash] = useState('')


  useEffect(() => {
    if (getMultiSenderAddress(chainId) === '') setChainIdMsg(messagesTable.NOT_SUPPORTED)
    else setChainIdMsg('')
  }, [chainId])


  const handleTokenTransfer = () => {
    setMessage1('')
    setTxnHash('')
    if (tokenType === 'erc20') {
      handleErc20Transfer()
    }
    else if (tokenType === 'erc721') {
      handleErc721Transfer()
    }
    else if (tokenType === 'erc1155') {
      handleErc1155Transfer()
    }
  }

  const handleErc20Transfer = async () => {
    try {
      const data1 = processRecipientData(recipientData, 'erc20')
      if (data1 === null) {
        setMessage1(messagesTable.INVALID_DATA)
        return
      }

      setBtnText(btnTextTable.APPROVING)
      const { recipients, tokenAmounts } = data1
      const data2 = await convertAmountsToWei(tokenAddress, tokenAmounts)
      const { amountsInWeiArr } = data2
      if (amountsInWeiArr.length === 0) {
        setMessage1(messagesTable.INVALID_DATA)
        setBtnText(btnTextTable.SEND)
        return
      }
      const isApproved = await getErc20Approval(tokenAddress, amountsInWeiArr)
      if (!isApproved) {
        setMessage1(messagesTable.APPROVAL_PROBLEM)
        setBtnText(btnTextTable.SEND)
        return
      }

      setBtnText(btnTextTable.SENDING)
      const { isTransferred, hash } = await transferErc20(tokenAddress, recipients, amountsInWeiArr)
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

  const handleErc721Transfer = async () => {
    try {
      const signer = getSigner()
      const data1 = processRecipientData(recipientData, 'erc721')
      if (data1 === null) {
        setMessage1(messagesTable.INVALID_DATA)
        return
      }

      setBtnText(btnTextTable.APPROVING)
      const { recipients, tokenIds } = data1
      const isApproved = await getErc721Approval(signer, tokenAddress)
      if (!isApproved) {
        setMessage1(messagesTable.APPROVAL_PROBLEM)
        setBtnText(btnTextTable.SEND)
        return
      }

      setBtnText(btnTextTable.SENDING)
      const { isTransferred, hash } = await transferErc721(signer, tokenAddress, recipients, tokenIds)
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

  const handleErc1155Transfer = async () => {
    try {
      const signer = getSigner()
      const data1 = processRecipientData(recipientData, 'erc1155')
      if (data1 === null) {
        setMessage1(messagesTable.INVALID_DATA)
        return
      }

      setBtnText(btnTextTable.APPROVING)
      const { recipients, tokenIds, tokenAmounts } = data1
      const isApproved = await getErc1155Approval(signer, tokenAddress)
      if (!isApproved) {
        setMessage1(messagesTable.APPROVAL_PROBLEM)
        setBtnText(btnTextTable.SEND)
        return
      }

      setBtnText(btnTextTable.SENDING)
      const { isTransferred, hash } = await transferErc1155(signer, tokenAddress, recipients, tokenIds, tokenAmounts)
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
        < meta name="description" content="Send, Transfer ERC20, ERC721, ERC1155 tokens in batch" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box>
        <Stack mx='auto' spacing={3}
          maxWidth='400px'>

          <TokenTypeSelector
            tokenType={tokenType} setTokenType={setTokenType} showEth={false}
          />


          <TextField
            fullWidth
            id="standard-basic"
            label="Token Address"
            variant="standard"
            value={tokenAddress}
            onChange={e => setTokenAddress(e.target.value)}
          />

          <TextField
            fullWidth
            id="standard-multiline-static"
            label="Recipients"
            multiline
            rows={4}
            // defaultValue="Default Value"
            variant="standard"
            value={recipientData}
            onChange={e => setRecipientData(e.target.value)}
          />

          <Button onClick={handleTokenTransfer}
            disabled={(
              chainIdMsg === messagesTable.NOT_INSTALLED
              || chainIdMsg === messagesTable.NOT_SUPPORTED
              || walletMsg === messagesTable.METAMASK_LOCKED
              || btnText === btnTextTable.APPROVING
              || btnText === btnTextTable.SENDING
            )}
            variant="contained" endIcon={<SendIcon />}>
            {btnText}
          </Button>
          {
            (btnText === btnTextTable.APPROVING || btnText === btnTextTable.SENDING) &&
            <LinearProgress />
          }

          <AlertMessages message1={message1} />

          {
            (txnHash.length > 0) &&
            <TxnLink
              chainId={chainId}
              txnHash={txnHash}
            />
          }
        </Stack>
      </Box>
    </div>
  )
}
