import Head from 'next/head'
import { useRouter } from 'next/router'
import {
	Box, FormControl, FormLabel,
	Radio, RadioGroup, FormControlLabel,
	Button, Stack, LinearProgress, Typography
} from '@mui/material'
import { getFaucetContract, getLockerContractAddr, getSigner } from '../backend/api/web3Provider'
import { btnTextTable, messagesTable } from '../backend/api/utils'
import { useEffect, useState } from 'react'
import TxnLink from '../components/TxnLink'


export default function Home() {

	const router = useRouter()

	const [walletAddress, setWalletAddress] = useState('')
	const [currChain, setCurrChain] = useState(-1)
	const [tokenType, setTokenType] = useState('erc20')

	const [btnText, setBtnText] = useState(btnTextTable.GET_1000)
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
			const currWallet = await signer.getAddress()
			setWalletAddress(currWallet)
			if (getLockerContractAddr(chainId) === '') {
				setMessage1(messagesTable.NOT_SUPPORTED)
				return
			}
			setCurrChain(chainId)
		}
		loadWeb3()

	}, [])


	const get1000USDT = async () => {
		try {
			setBtnText(btnTextTable.SENDING)
			const signer = getSigner()
			const chainId = await signer.getChainId()
			const faucetContract = getFaucetContract(signer, chainId)
			const txn = await faucetContract.get1000Tokens()
			await txn.wait()
			setTxnHash(txn.hash)
			setBtnText(btnTextTable.GET_1000)
		} catch (err) {
			console.log(err)
			setMessage1(messagesTable.FAUCET_PROBLEM)
			setBtnText(btnTextTable.GET_1000)
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

					<FormControl component="fieldset">
						<FormLabel component="legend">Token Type: </FormLabel>
						<RadioGroup
							row aria-label="gender"
							name="row-radio-buttons-group"
							value={tokenType}
							onChange={e => setTokenType(e.target.value)}
						>
							<FormControlLabel value="erc20" control={<Radio />} label="ERC20" />
							{/* <FormControlLabel value="erc721" control={<Radio />} label="ERC721" /> */}
							{/* <FormControlLabel value="erc1155" control={<Radio />} label="ERC1155" /> */}
						</RadioGroup>
					</FormControl>


					<Typography>Your Address: {walletAddress}</Typography>
					<Typography>Current ChainId: {currChain}</Typography>

					<Typography>Token Name: USD Tether</Typography>
					<Typography>Token Symbol: USDT</Typography>
					<Typography>Token Decimals: 6</Typography>
					<Button
						disabled={(
							currChain === -1
							|| btnText === btnTextTable.SENDING
						)}
						variant='contained'
						onClick={get1000USDT}
					>{btnText}</Button>

					{
						(btnText === btnTextTable.SENDING) &&
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
