import Head from 'next/head'
import {
	TextField, Box, FormControl, FormLabel,
	Button, Stack, LinearProgress
} from '@mui/material'
import { getLockerContractAddr } from '../backend/api/web3Provider'
import { btnTextTable, messagesTable } from '../backend/api/utils'
import { Send as SendIcon } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { convertAmountsToWei } from '../backend/api/erc20'
import TxnLink from '../components/TxnLink'
import DateTimePicker from '@mui/lab/DateTimePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { approveErc20ForLocker, getUserLockers, lockErc20Tokens, LockerInfo, LockerInfo2 } from '../backend/locker/erc20Lock'
import { approveErc721ForLocker, transferErc721ToLocker } from '../backend/common/erc721'
import { approveErc1155ForLocker } from '../backend/common/erc1155'
import { transferTokensToLocker } from '../backend/locker/lockerWeb3'
import TokenTypeSelector from '../components/TokenTypeSelector'
import AlertMessages from '../components/AlertMessages'
import useStore from '../backend/zustand/store'
import { useRouter } from 'next/router'


export default function Locker() {
	const router = useRouter()

	const chainId = useStore(state => state.chainId)
	const chainIdMsg = useStore(state => state.chainIdMsg)
	const setChainIdMsg = useStore(state => state.setChainIdMsg)

	const wallet = useStore(state => state.wallet)
	const walletMsg = useStore(state => state.walletMsg)

	const [tokenType, setTokenType] = useState('erc20')
	const [tokenAddress, setTokenAddress] = useState('')
	const [tokenId, setTokenId] = useState('')
	const [lockAmount, setLockAmount] = useState('')
	const [unlockDate, setUnlockDate] = useState(new Date())

	const [btnText, setBtnText] = useState(btnTextTable.LOCK)
	const [txnHash, setTxnHash] = useState('')
	const [message1, setMessage1] = useState('')

	useEffect(() => {
		if (getLockerContractAddr(chainId) === '') setChainIdMsg(messagesTable.NOT_SUPPORTED)
		else setChainIdMsg('')
	}, [chainId])



	const handleLocking = () => {
		if (tokenType === 'erc20') {
			handleErc20Lock()
		}
		else if (tokenType === 'erc721') {
			handleErc721Lock()
		}
		else if (tokenType === 'erc1155') {
			handleErc1155Lock()
		}
	}

	const handleErc20Lock = async () => {
		setMessage1('')
		try {
			const { amountsInWeiArr } = await convertAmountsToWei(tokenAddress, [lockAmount])
			if (amountsInWeiArr.length === 0) {
				setMessage1(messagesTable.INVALID_DATA)
				setBtnText(btnTextTable.LOCK)
				return
			}
			const amountInWei = amountsInWeiArr[0].toString()

			setBtnText(btnTextTable.APPROVING)
			const isApproved = await approveErc20ForLocker(tokenAddress, amountsInWeiArr[0])
			if (!isApproved) {
				setMessage1(messagesTable.APPROVAL_PROBLEM)
				setBtnText(btnTextTable.LOCK)
				return
			}

			setBtnText(btnTextTable.LOCKING)
			const unlockTime = Math.floor(unlockDate.getTime() / 1000).toString()
			const { isLocked, hash } = await lockErc20Tokens(tokenType, tokenAddress, '0', amountInWei, unlockTime)
			if (!isLocked) {
				setMessage1(messagesTable.LOCK_PROBLEM)
				setBtnText(btnTextTable.LOCK)
				return
			}
			// setTxnHash(hash)
			// setBtnText(btnTextTable.LOCK)
			// setMessage1('')
			router.push('/mylocks')
		} catch (err) {
			console.log(err)
			setMessage1(messagesTable.LOCK_PROBLEM)
			setBtnText(btnTextTable.LOCK)
		}
	}

	const handleErc721Lock = async () => {
		setMessage1('')
		try {

			setBtnText(btnTextTable.APPROVING)
			const isApproved = await approveErc721ForLocker(tokenAddress)
			if (!isApproved) {
				setMessage1(messagesTable.APPROVAL_PROBLEM)
				setBtnText(btnTextTable.LOCK)
				return
			}

			setBtnText(btnTextTable.LOCKING)
			const unlockTime = Math.floor(unlockDate.getTime() / 1000).toString()
			const { isLocked, hash } = await transferErc721ToLocker('erc721', tokenAddress, tokenId, '1', unlockTime)
			if (!isLocked) {
				setMessage1(messagesTable.LOCK_PROBLEM)
				setBtnText(btnTextTable.LOCK)
				return
			}
			// setTxnHash(hash)
			// setBtnText(btnTextTable.LOCK)
			// setMessage1('')
			router.push('/mylocks')
		} catch (err) {
			console.log(err)
			setMessage1(messagesTable.LOCK_PROBLEM)
			setBtnText(btnTextTable.LOCK)
		}
	}

	const handleErc1155Lock = async () => {
		setMessage1('')
		try {

			setBtnText(btnTextTable.APPROVING)
			const isApproved = await approveErc1155ForLocker(tokenAddress)
			if (!isApproved) {
				setMessage1(messagesTable.APPROVAL_PROBLEM)
				setBtnText(btnTextTable.LOCK)
				return
			}

			setBtnText(btnTextTable.LOCKING)
			const unlockTime = Math.floor(unlockDate.getTime() / 1000).toString()
			const { isLocked, hash } = await transferTokensToLocker(
				'erc1155', tokenAddress, tokenId, lockAmount, unlockTime
			)
			if (!isLocked) {
				setMessage1(messagesTable.LOCK_PROBLEM)
				setBtnText(btnTextTable.LOCK)
				return
			}
			// setTxnHash(hash)
			// setBtnText(btnTextTable.LOCK)
			// setMessage1('')
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
						tokenType={tokenType} setTokenType={setTokenType}
					/>

					<TextField
						fullWidth
						id="standard-basic"
						label="Token Address"
						variant="standard"
						value={tokenAddress}
						onChange={e => setTokenAddress(e.target.value)}
					/>


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
						(tokenType === 'erc20' || tokenType === 'erc1155') &&
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
							<DateTimePicker
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
