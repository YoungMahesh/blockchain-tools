import Head from 'next/head'
import {
  TextField, Box,
  Button, Stack, LinearProgress
} from '@mui/material'
import { getMultiSenderAddress } from '../backend/api/multisender'
import { btnTextTable, messagesTable, processRecipientData } from '../backend/api/utils'
import { Send as SendIcon } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { getErc20Approval, getErc20Decimals, getTotalSumOfBignumbers } from '../backend/common/erc20'
import TxnLink from '../components/TxnLink'
import { getErc721Approval } from '../backend/common/erc721'
import { getErc1155Approval } from '../backend/common/erc1155'
import TokenTypeSelector from '../components/TokenTypeSelector'
import useStore from '../backend/zustand/store'
import AlertMessages from '../components/AlertMessages'
import { transferToMultiSender } from '../backend/api/multisender'


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

  useEffect(() => { setTxnHash('') }, [tokenType])

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
      const { done, recipientsArr, tokenIdsArr, tokenAmountsInWeiArr } = processRecipientData(recipientData, tokenType, decimals)
      if (!done) {
        setMessage1(messagesTable.INVALID_DATA)
        return
      }

      setBtnText(btnTextTable.APPROVING)
      const totalAmountInWei = getTotalSumOfBignumbers(tokenAmountsInWeiArr)
      const multiSenderAddr = getMultiSenderAddress(chainId)
      let isApproved = true
      if (tokenType === 'erc20') {
        isApproved = await getErc20Approval(tokenAddress, multiSenderAddr, totalAmountInWei)
      }
      else if (tokenType === 'erc721') {
        isApproved = await getErc721Approval(tokenAddress, multiSenderAddr)
      }
      else if (tokenType === 'erc1155') {
        isApproved = await getErc1155Approval(tokenAddress, multiSenderAddr)
      }
      if (!isApproved) {
        setMessage1(messagesTable.APPROVAL_PROBLEM)
        setBtnText(btnTextTable.SEND)
        return
      }
      setBtnText(btnTextTable.SENDING)
      // console.log({ tokenType, tokenAddress, recipientsArr, tokenIdsArr, tokenAmountsInWeiArr })
      const { isTransferred, hash } = await transferToMultiSender(tokenType, tokenAddress, recipientsArr, tokenIdsArr, tokenAmountsInWeiArr)
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
            tokenType={tokenType} setTokenType={setTokenType} showEth={true}
          />

          {(tokenType !== 'eth') &&
            <TextField
              fullWidth
              id="standard-basic"
              label="Token Address"
              variant="standard"
              value={tokenAddress}
              onChange={e => setTokenAddress(e.target.value)}
            />
          }

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
