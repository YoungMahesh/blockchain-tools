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




export default function Faucet() {

	const [wallet, setWallet] = useState('')
	const [chainId, setChainId] = useState(-1)
	const [message1, setMessage1] = useState('')

	const [tokenType, setTokenType] = useState('erc20')


	useEffect(() => {
		async function loadData() {
			await loadWeb3(setWallet, setChainId, setMessage1, getFaucetAddress)
		}
		loadData()
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

					<Typography>Your Address: {wallet}</Typography>
					<Typography>Current ChainId: {chainId}</Typography>
					{
						chainId !== -1 &&
						<FaucetToken chainId={chainId} tokenType={tokenType} />
					}

					<Typography>{message1}</Typography>

				</Stack>

			</Box>
		</div>
	)
}
