import Head from 'next/head'
// import Image from 'next/image'
import {
  TextField, Box, FormControl, FormLabel,
  Radio, RadioGroup, FormControlLabel,
  Button, Stack
} from '@mui/material'

import { Send as SendIcon } from '@mui/icons-material'
import { useEffect, useState } from 'react'

export default function Home() {

  const [tokenType, setTokenType] = useState('erc20')
  const [tokenAddress, setTokenAddress] = useState('')
  const [recipientData, setRecipientData] = useState('')

  useEffect(() => {

  }, [])

  return (
    <div>
      <Head>
        <title>Multi Sender</title>
        <meta name="description" content="Send ERC20, ERC721, ERC1155 in batch" />
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

          <Button variant="contained" endIcon={<SendIcon />}>
            Send
          </Button>
        </Stack>

      </Box>


    </div>
  )
}
