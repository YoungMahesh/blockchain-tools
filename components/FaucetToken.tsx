import { useEffect, useState } from 'react'
import {
	Box, Button, Typography,
	Card, CardActions, CardContent
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { getFaucetContract, getFaucetErc20Details, getFaucetErc721Details, getFaucetTokensAddr, getSigner, getTokenUrlPrefix } from '../backend/common/web3Provider'
import { btnTextTable } from '../backend/api/utils';

export default function FaucetToken({ chainId, tokenType }) {

	const [tokenName, setTokenName] = useState('')
	const [tokenSymbol, setTokenSymbol] = useState('')
	const [tokenDecimals, setTokenDecimals] = useState('')
	const [tokenAddress, setTokenAddress] = useState('')
	const [btnText, setBtnText] = useState('')

	useEffect(() => {
		const faucetAddr = getFaucetTokensAddr(chainId)
		if (tokenType === 'erc20') {
			const erc20Details = getFaucetErc20Details(chainId)
			setTokenName(erc20Details.name)
			setTokenSymbol(erc20Details.symbol)
			setTokenDecimals(erc20Details.decimals)
			setTokenAddress(faucetAddr.erc20)
			setBtnText(btnTextTable.GET_ERC20)
		}
		else if (tokenType === 'erc721') {
			const erc721Details = getFaucetErc721Details(chainId)
			setTokenName(erc721Details.name)
			setTokenSymbol(erc721Details.symbol)
			setTokenDecimals('')
			setTokenAddress(faucetAddr.erc721)
			setBtnText(btnTextTable.GET_ERC721)
		}
		else if (tokenType === 'erc1155') {
			setTokenName('ERC1155')
			setTokenSymbol('')
			setTokenDecimals('')
			setTokenAddress(faucetAddr.erc1155)
			setBtnText(btnTextTable.GET_ERC1155)
		}
	}, [tokenType, chainId])



	const getTokens = () => {
		try {
			const signer = getSigner()
			const faucetContract = getFaucetContract(signer, chainId)
			if (tokenType === 'erc20') faucetContract.get300Erc20Tokens()
			else if (tokenType === 'erc721') faucetContract.get3Erc721Tokens()
			else if (tokenType === 'erc1155') faucetContract.get1000Erc1155Tokens()
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<Box sx={{ minWidth: 275 }}>
			<Card>
				<CardContent>
					{
						tokenName.length > 0 &&
						<Typography variant="h5" component="div">
							{tokenName}
						</Typography>
					}
					{
						tokenSymbol.length > 0 &&
						<Typography sx={{ mb: 1.5 }} color="text.secondary">
							Symbol: {tokenSymbol} {tokenDecimals.length > 0 && `, Decimals: ${tokenDecimals}`}
						</Typography>
					}
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<Typography variant="body2">
							Address: {tokenAddress}
						</Typography>
						<Button sx={{ cursor: 'pointer', color: 'black' }} onClick={() => {
							navigator.clipboard.writeText(tokenAddress)
							alert(`Copied: ${tokenAddress}`)
						}}>
							<ContentCopyIcon />
						</Button>
					</Box>
				</CardContent>
				<CardActions>
					<Button onClick={getTokens} size='medium'>{btnText}</Button>
					<Button onClick={() => window.open(`${getTokenUrlPrefix(chainId)}${tokenAddress}`)} size='medium'>View Details</Button>
				</CardActions>
			</Card>
		</Box>
	)
}