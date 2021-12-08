import Head from 'next/head'
import {
	TextField, Box, FormControl, FormLabel,
	Button, Stack, LinearProgress
} from '@mui/material'
import { BN, getLockerContractAddr, ZERO_ADDRESS } from '../backend/common/web3Provider'
import { btnTextTable, messagesTable } from '../backend/api/utils'
import { Send as SendIcon } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import MobileDateTimePicker from '@mui/lab/MobileDateTimePicker'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { getErc721Approval } from '../backend/common/erc721'
import { getErc1155Approval } from '../backend/common/erc1155'
import { transferTokensToLocker } from '../backend/api/locker'
import TokenTypeSelector from '../components/TokenTypeSelector'
import AlertMessages from '../components/AlertMessages'
import useStore from '../backend/zustand/store'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import { getErc20Decimals, getErc20Approval } from '../backend/common/erc20'

export default function Locker() {
	const router = useRouter()

	const chainId = useStore(state => state.chainId)
	const chainIdMsg = useStore(state => state.chainIdMsg)
	const setChainIdMsg = useStore(state => state.setChainIdMsg)

	const walletMsg = useStore(state => state.walletMsg)

	const [tokenType, setTokenType] = useState('erc20')
	const [tokenAddress, setTokenAddress] = useState('')
	const [tokenId, setTokenId] = useState('')
	const [lockAmount, setLockAmount] = useState('')
	const [unlockDate, setUnlockDate] = useState(new Date())

	const [btnText, setBtnText] = useState(btnTextTable.LOCK)
	const [message1, setMessage1] = useState('')

	useEffect(() => {
		if (getLockerContractAddr(chainId) === '') setChainIdMsg(messagesTable.NOT_SUPPORTED)
		else setChainIdMsg('')
	}, [chainId])


	const handleLocking = async () => {

		setMessage1('')
		try {

			let decimals = 0
			if (tokenType === 'eth') decimals = 18
			if (tokenType === 'erc20') {
				decimals = await getErc20Decimals(tokenAddress)
				if (decimals === -1) {
					setMessage1(messagesTable.INVALID_TOKENADDRESS)
					setBtnText(btnTextTable.LOCK)
					return
				}
			}

			setBtnText(btnTextTable.APPROVING)
			const lockAmount1 = (tokenType === 'erc721') ? '1' : lockAmount
			const amountInWei = ethers.utils.parseUnits(lockAmount1, decimals)
			const lockerAddr = getLockerContractAddr(chainId)
			let isApproved = true
			if (tokenType === 'erc20') {
				isApproved = await getErc20Approval(tokenAddress, lockerAddr, amountInWei)
			}
			else if (tokenType === 'erc721') {
				isApproved = await getErc721Approval(tokenAddress, lockerAddr)
			}
			else if (tokenType === 'erc1155') {
				console.log('before exe')
				isApproved = await getErc1155Approval(tokenAddress, lockerAddr)
				console.log('after exe')
			}
			if (!isApproved) {
				setMessage1(messagesTable.APPROVAL_PROBLEM)
				setBtnText(btnTextTable.LOCK)
				return
			}

			setBtnText(btnTextTable.LOCKING)
			const tokenId1 = (tokenType === 'erc721' || tokenType === 'erc1155') ? BN(tokenId) : BN('0')
			const tokenAddress1 = (tokenType === 'eth') ? ZERO_ADDRESS : tokenAddress
			const amountInWei1 = (tokenType === 'erc721') ? BN('1') : amountInWei
			console.log({ tokenType, tokenAddress1, tokenId1, amountInWei1, unlockDate })
			const { isLocked, hash } = await transferTokensToLocker(
				tokenType, tokenAddress1, tokenId1, amountInWei1, unlockDate
			)

			if (!isLocked) {
				setMessage1(messagesTable.LOCK_PROBLEM)
				setBtnText(btnTextTable.LOCK)
				return
			}
			router.push('/mylocks')
		} catch (err) {
			console.log(err)
			setMessage1(messagesTable.LOCK_PROBLEM)
			setBtnText(btnTextTable.LOCK)
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

					<TokenTypeSelector
						tokenType={tokenType} setTokenType={setTokenType} showEth={true}
					/>
					{
						(tokenType === 'erc20' || tokenType === 'erc721' || tokenType === 'erc1155') &&
						<TextField
							fullWidth
							id="standard-basic"
							label="Token Address"
							variant="standard"
							value={tokenAddress}
							onChange={e => setTokenAddress(e.target.value)}
						/>
					}

					{
						(tokenType === 'erc721' || tokenType === 'erc1155') &&
						<TextField
							id="standard-basic"
							label="Token Id"
							variant="standard"
							value={tokenId}
							onChange={e => setTokenId(e.target.value)}
						/>
					}

					{
						(tokenType === 'eth' || tokenType === 'erc20' || tokenType === 'erc1155') &&
						<TextField
							id="standard-basic"
							label="Lock Amount"
							variant="standard"
							value={lockAmount}
							onChange={e => setLockAmount(e.target.value)}
						/>
					}

					<FormControl component="fieldset">

						<FormLabel component="legend">Unlock Date: </FormLabel>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<MobileDateTimePicker
								renderInput={(params) => <TextField {...params} />}
								value={unlockDate}
								onChange={setUnlockDate}
							/>
						</LocalizationProvider>
					</FormControl>

					<Button onClick={handleLocking}
						disabled={(
							chainIdMsg === messagesTable.NOT_INSTALLED
							|| chainIdMsg === messagesTable.NOT_SUPPORTED
							|| walletMsg === messagesTable.METAMASK_LOCKED
							|| btnText === btnTextTable.APPROVING
							|| btnText === btnTextTable.LOCKING
						)}
						variant="contained" endIcon={<SendIcon />}>
						{btnText}
					</Button>
					{
						(btnText === btnTextTable.APPROVING || btnText === btnTextTable.SENDING) &&
						<LinearProgress />
					}

					<AlertMessages message1={message1} />

				</Stack>

			</Box>
		</div>
	)
}
