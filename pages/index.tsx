import Head from 'next/head'
// import Image from 'next/image'
import { useRouter } from 'next/router'
import {
  TextField, Box, FormControl, FormLabel,
  Radio, RadioGroup, FormControlLabel,
  Button, Stack, LinearProgress
} from '@mui/material'
import { getMultiSenderAddress, getSigner } from '../backend/api/web3Provider'
import { btnTextTable, messagesTable, processRecipientData } from '../backend/api/utils'
import { Send as SendIcon } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { convertAmountsToWei, getErc20Approval, getErc20Contract, transferErc20 } from '../backend/api/erc20'
import TxnLink from '../components/TxnLink'
import { getErc721Approval, transferErc721 } from '../backend/api/erc721'
import { getErc1155Approval, transferErc1155 } from '../backend/api/erc1155'

export default function Home() {

  const router = useRouter()

  const [tokenType, setTokenType] = useState('erc20')
  const [tokenAddress, setTokenAddress] = useState('')
  const [recipientData, setRecipientData] = useState('')
  const [btnText, setBtnText] = useState(btnTextTable.SEND)

  const [currChain, setCurrChain] = useState(-1)
  const [isNetworkSupported, setIsNetworkSupported] = useState(false)
  const [message1, setMessage1] = useState('')
  const [txnHash, setTxnHash] = useState('')


  useEffect(() => {
    async function loadWeb3() {
      if (!window.ethereum) {
        setMessage1(messagesTable.NOT_INSTALLED)
        return
      }

      window.ethereum.on('chainChanged', () => router.reload())

      const signer = getSigner()
      const chainId = await signer.getChainId()
      if (!getMultiSenderAddress(chainId)) {
        setMessage1(messagesTable.NOT_SUPPORTED)
        return
      }

      setIsNetworkSupported(true)
      setCurrChain(chainId)
    }
    loadWeb3()

  }, [])



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
      const signer = getSigner()
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
          maxWidth='400px' marginTop='150px'>

          <FormControl component="fieldset">
            <FormLabel component="legend">Token Type: </FormLabel>
            <RadioGroup
              row aria-label="gender"
              name="row-radio-buttons-group"
              value={tokenType}
              onChange={e => setTokenType(e.target.value)}
            >
              <FormControlLabel value="erc20" control={<Radio />} label="ERC20" />
              <FormControlLabel value="erc721" control={<Radio />} label="ERC721" />
              <FormControlLabel value="erc1155" control={<Radio />} label="ERC1155" />
            </RadioGroup>
          </FormControl>


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
              !isNetworkSupported
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

          <p>{message1}</p>

          {
            (txnHash.length > 0) &&
            <TxnLink
              chainId={currChain}
              txnHash={txnHash}
            />
          }
        </Stack>
      </Box>
    </div>
  )
}
