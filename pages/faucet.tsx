import Head from 'next/head'
import {
	Box, FormControl, FormLabel,
	Radio, RadioGroup, FormControlLabel,
	Button, Stack, LinearProgress, Typography,
	Card,
} from '@mui/material'
import { getFaucetAddress, getFaucetContract, getSigner, loadWeb3 } from '../backend/api/web3Provider'
import { btnTextTable, messagesTable } from '../backend/api/utils'
import { useEffect, useState } from 'react'
import TxnLink from '../components/TxnLink'
import FaucetToken from '../components/FaucetToken'
import TokenTypeSelector from '../components/TokenTypeSelector'




export default function Faucet() {

	const [wallet, setWallet] = useState('')
	const [chainId, setChainId] = useState(-1)
	const [message1, setMessage1] = useState('')

	const [tokenType, setTokenType] = useState('erc20')


	useEffect(() => {
		loadWeb3(setWallet, setChainId, setMessage1, getFaucetAddress)
	}, [])

	return (
		<div>
			<Head>
				<title>Locker</title>
				< meta name="description" content="Lock ERC20, ERC721, ERC1155 Tokens" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Box>
				<Stack mx='auto' spacing={3}
					maxWidth='400px'>


					{
						(message1 !== messagesTable.NOT_SUPPORTED && message1 !== messagesTable.NOT_INSTALLED) &&
						<>
							<TokenTypeSelector
								tokenType={tokenType} setTokenType={setTokenType}
							/>
							<Typography>Your Address: {wallet}</Typography>
							<Typography>Current ChainId: {chainId}</Typography>
							<FaucetToken chainId={chainId} tokenType={tokenType} />
						</>
					}

					<Typography>{message1}</Typography>

				</Stack>

			</Box>
		</div>
	)
}
