import Head from 'next/head'
// import Image from 'next/image'
import { useRouter } from 'next/router'
import {
	TextField, Box, FormControl, FormLabel,
	Radio, RadioGroup, FormControlLabel,
	Button, Stack, LinearProgress, Typography
} from '@mui/material'
import { getLockerContractAddr, getSigner } from '../backend/api/web3Provider'
import { btnTextTable, messagesTable } from '../backend/api/utils'
import { Send as SendIcon } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { convertAmountsToWei } from '../backend/api/erc20'
import TxnLink from '../components/TxnLink'
import DateTimePicker from '@mui/lab/DateTimePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { approveErc20ForLocker, getUserLockers, lockErc20Tokens, LockerInfo, LockerInfo2 } from '../backend/locker/erc20Lock'
import MyLocks from '../components/MyLocks'
import { approveErc721ForLocker, transferErc721ToLocker } from '../backend/common/erc721'
import { approveErc1155ForLocker } from '../backend/common/erc1155'
import { transferTokensToLocker } from '../backend/locker/lockerWeb3'


export default function Home() {

	const router = useRouter()

	const [tokenType, setTokenType] = useState('erc20')
	const [tokenAddress, setTokenAddress] = useState('')
	const [tokenId, setTokenId] = useState('')
	const [lockAmount, setLockAmount] = useState('')
	const [unlockDate, setUnlockDate] = useState(new Date())
	const [userLocks, setUserLocks] = useState<LockerInfo2[]>([])

	const [btnText, setBtnText] = useState(btnTextTable.LOCK)
	const [currChain, setCurrChain] = useState(-1)
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
			if (getLockerContractAddr(chainId) === '') {
				setMessage1(messagesTable.NOT_SUPPORTED)
				return
			}

			setCurrChain(chainId)


			const { fetchedLockers, userLockersInfoArr } = await getUserLockers()
			if (fetchedLockers) {
				setUserLocks(userLockersInfoArr)
			}
		}
		loadWeb3()

	}, [])

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
			setTxnHash(hash)
			setBtnText(btnTextTable.LOCK)
			setMessage1('')
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
			setTxnHash(hash)
			setBtnText(btnTextTable.LOCK)
			setMessage1('')
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
			setTxnHash(hash)
			setBtnText(btnTextTable.LOCK)
			setMessage1('')
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
							{/* <FormControlLabel value="erc1155" control={<Radio />} label="ERC1155" /> */}
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
							currChain === -1
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

					<p>{message1}</p>

					{
						(txnHash.length > 0) &&
						<TxnLink
							chainId={currChain}
							txnHash={txnHash}
						/>
					}
				</Stack>


				<MyLocks userLocks={userLocks} setMessage1={setMessage1} />
			</Box>
		</div>
	)
}
