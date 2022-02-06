import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Typography,
  Card,
  CardActions,
  CardContent
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import {
  getEtherFaucetInfo,
  getFaucetContract,
  getFaucetErc20Details,
  getFaucetErc721Details,
  getFaucetTokensAddr
} from '../backend/api/faucet'
import { getTokenUrlPrefix } from '../backend/common/web3Provider'
import { btnTextTable } from '../backend/api/utils'

export default function FaucetToken({ chainId, tokenType, setMessage1 }) {
  const [tokenName, setTokenName] = useState('')
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [tokenDecimals, setTokenDecimals] = useState('')
  const [tokenAddress, setTokenAddress] = useState('')
  const [faucetLink1, setFaucetLink1] = useState('')
  const [btnText, setBtnText] = useState('')

  useEffect(() => {
    const faucetAddr = getFaucetTokensAddr(chainId)
    const { ethName, faucetLink } = getEtherFaucetInfo(chainId)
    if (tokenType === 'eth') {
      setTokenName(`${ethName} Faucet`)
      setTokenSymbol('')
      setTokenDecimals('')
      setTokenAddress('')
      setBtnText(btnTextTable.GET_ERC20)
      setFaucetLink1(faucetLink)
    } else if (tokenType === 'erc20') {
      const erc20Details = getFaucetErc20Details(chainId)
      setTokenName(erc20Details.name)
      setTokenSymbol(erc20Details.symbol)
      setTokenDecimals(erc20Details.decimals)
      setTokenAddress(faucetAddr.erc20)
      setBtnText(btnTextTable.GET_ERC20)
    } else if (tokenType === 'erc721') {
      const erc721Details = getFaucetErc721Details(chainId)
      setTokenName(erc721Details.name)
      setTokenSymbol(erc721Details.symbol)
      setTokenDecimals('')
      setTokenAddress(faucetAddr.erc721)
      setBtnText(btnTextTable.GET_ERC721)
    } else if (tokenType === 'erc1155') {
      setTokenName('ERC1155')
      setTokenSymbol('')
      setTokenDecimals('')
      setTokenAddress(faucetAddr.erc1155)
      setBtnText(btnTextTable.GET_ERC1155)
    }
  }, [tokenType, chainId])

  useEffect(() => {
    setMessage1('')
  }, [tokenType])

  const getTokens = async () => {
    setMessage1('')
    try {
      const faucetContract = getFaucetContract(chainId, true)
      if (tokenType === 'erc20') {
        await faucetContract.get300Erc20Tokens()
      } else if (tokenType === 'erc721') {
        const txn = await faucetContract.get3Erc721Tokens()
        const txn2 = await txn.wait()
        let tokenIdsTransferred = ''
        for (let i = 0; i < txn2.events.length; i++) {
          if (txn2.events[i].event === 'Transfer') {
            tokenIdsTransferred += txn2.events[i].args[2].toString() + ' '
          }
        }
        setMessage1(`Token Ids Transferred: ${tokenIdsTransferred}`)
      } else if (tokenType === 'erc1155') {
        const txn = await faucetContract.get1000Erc1155Tokens()
        const txn2 = await txn.wait()

        let tokenIdTransferred = ''
        for (let i = 0; i < txn2.events.length; i++) {
          if (txn2.events[i].event === 'TransferSingle') {
            tokenIdTransferred += txn2.events[i].args[3].toString() + ' '
          }
        }
        setMessage1(`1000 Tokens of TokenId ${tokenIdTransferred} Transferred`)
      }
    } catch (err) {
      console.log(err)
      setMessage1('Problem occurred while transferring tokens')
    }
  }

  return (
    <Box sx={{ minWidth: 275 }}>
      <Card>
        <CardContent>
          {tokenName.length > 0 && (
            <Typography variant="h5" component="div">
              {tokenName}
            </Typography>
          )}
          {tokenSymbol.length > 0 && (
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              Symbol: {tokenSymbol}{' '}
              {tokenDecimals.length > 0 && `, Decimals: ${tokenDecimals}`}
            </Typography>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {tokenAddress.length > 0 && (
              <>
                <Typography variant="body2">Address: {tokenAddress}</Typography>
                <Button
                  sx={{ cursor: 'pointer', color: 'black' }}
                  onClick={() => {
                    navigator.clipboard.writeText(tokenAddress)
                    alert(`Copied: ${tokenAddress}`)
                  }}
                >
                  <ContentCopyIcon />
                </Button>
              </>
            )}
            {tokenType === 'eth' && <></>}
          </Box>
        </CardContent>
        <CardActions>
          {tokenAddress.length > 0 && (
            <>
              <Button onClick={getTokens} size="medium">
                {btnText}
              </Button>
              <Button
                onClick={() =>
                  window.open(`${getTokenUrlPrefix(chainId)}${tokenAddress}`)
                }
                size="medium"
              >
                View Details
              </Button>
            </>
          )}
          {tokenType === 'eth' && faucetLink1.length > 0 && (
            <Button onClick={() => window.open(faucetLink1)} size="medium">
              VISIT
            </Button>
          )}
        </CardActions>
      </Card>
    </Box>
  )
}
