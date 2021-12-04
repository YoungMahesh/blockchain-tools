import Head from 'next/head'
import {
	Box, FormControl, FormLabel,
	Radio, RadioGroup, FormControlLabel,
	Button, Stack, LinearProgress, Typography
} from '@mui/material'
import { getFaucetAddress, getFaucetContract, getSigner, loadWeb3 } from '../backend/api/web3Provider'
import { btnTextTable, messagesTable } from '../backend/api/utils'
import { useEffect, useState } from 'react'
import TxnLink from '../components/TxnLink'


export default function Faucet() {

	const [wallet, setWallet] = useState('')
	const [chainId, setChainId] = useState(-1)
	const [message1, setMessage1] = useState('')

	const [tokenType, setTokenType] = useState('erc20')

	const [btnText, setBtnText] = useState(btnTextTable.GET_ERC20)
	const [txnHash, setTxnHash] = useState('')


	useEffect(() => {
		async function loadData() {
			await loadWeb3(setWallet, setChainId, setMessage1, getFaucetAddress)
		}
		loadData()
	}, [])

	const get300RA = async () => {
		try {
			setBtnText(btnTextTable.SENDING)
			const signer = getSigner()
			const chainId = await signer.getChainId()
			const faucetContract = getFaucetContract(signer, chainId)
			const txn = await faucetContract.get300Erc20Tokens()
			await txn.wait()
			setTxnHash(txn.hash)
			setBtnText(btnTextTable.GET_ERC20)
		} catch (err) {
			console.log(err)
			setMessage1(messagesTable.FAUCET_PROBLEM)
			setBtnText(btnTextTable.GET_ERC20)
		}
	}


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

					{/* <FormControl component="fieldset">
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
					</FormControl> */}


					<Typography>Your Address: {wallet}</Typography>
					<Typography>Current ChainId: {chainId}</Typography>

					<Typography>Token Name: Ramanujan</Typography>
					<Typography>Token Symbol: RA</Typography>
					<Typography>Token Decimals: 18</Typography>
					<Button
						disabled={(
							message1 === messagesTable.NOT_SUPPORTED
							|| message1 === messagesTable.METAMASK_LOCKED
							|| btnText === btnTextTable.SENDING
						)}
						variant='contained'
						onClick={get300RA}
					>{btnText}</Button>

					{
						(btnText === btnTextTable.SENDING) &&
						<LinearProgress />
					}

					<p>{message1}</p>

					{
						(txnHash.length > 0) &&
						<TxnLink
							chainId={window.chainId}
							txnHash={txnHash}
						/>
					}
				</Stack>

			</Box>
		</div>
	)
}
