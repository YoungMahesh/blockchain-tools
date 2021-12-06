import { Stack, Typography, Box, Button, CircularProgress } from '@mui/material'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { getLockerContract, getSigner } from '../backend/api/web3Provider'
import { getUserLockers, LockerInfo2 } from '../backend/locker/erc20Lock'
import useStore from '../backend/zustand/store'
import AlertMessages from '../components/AlertMessages'


export default function MyLocks() {

	const chainId = useStore(state => state.chainId)
	const wallet = useStore(state => state.wallet)

	const [message1, setMessage1] = useState('')

	const [isFetching, setIsFetching] = useState(false)
	const [erc20Locks, setErc20Locks] = useState<LockerInfo2[]>([])
	const [erc721Locks, setErc721Locks] = useState<LockerInfo2[]>([])
	const [erc1155Locks, setErc1155Locks] = useState<LockerInfo2[]>([])

	useEffect(() => {
		async function loadLockers() {
			if (window.ethereum) {
				setIsFetching(true)
				const { fetchedLockers, userLockersInfoArr } = await getUserLockers()
				if (fetchedLockers) {
					const erc20Locks1 = userLockersInfoArr.filter(obj => !obj.isWithdrawn && obj.tokenType === 'erc20')
					setErc20Locks(erc20Locks1)
					const erc721Locks1 = userLockersInfoArr.filter(obj => !obj.isWithdrawn && obj.tokenType === 'erc721')
					setErc721Locks(erc721Locks1)
					const erc1155Locks1 = userLockersInfoArr.filter(obj => !obj.isWithdrawn && obj.tokenType === 'erc1155')
					setErc1155Locks(erc1155Locks1)
				}
				setIsFetching(false)
			}
		}
		loadLockers()
	}, [chainId, wallet])

	const getDate = (timeInSeconds: ethers.BigNumber) => {
		const timeInMilliSeconds = timeInSeconds.toNumber() * 1000
		const date1 = new Date()
		date1.setTime(timeInMilliSeconds)
		return date1.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
	}

	const withdrawTokens = async (_lockerId: ethers.BigNumber) => {
		setMessage1('')
		try {
			const signer = getSigner()
			const chainId = await signer.getChainId()
			const lockerContract = getLockerContract(signer, chainId)
			const txn = await lockerContract.destroyLocker(_lockerId)
			await txn.wait()
		} catch (err) {
			console.log(err)
			setMessage1('Problem occurred while unlocking tokens.')
		}
	}

	const ERC20Locks = () => {
		return (
			<>
				{
					erc20Locks.map(({ tokenOwner, tokenType,
						tokenAddress, tokenId, tokenAmount,
						lockTime, unlockTime, isWithdrawn,
						tokenName, tokenSymbol, tokenAmount2, lockerId
					}, idx) => (
						<Box key={idx} display='flex' flexDirection='row'
							justifyContent='space-between' flexWrap='wrap'
						>
							<Box>
								<p>{tokenName} - {tokenAmount2} {tokenSymbol}</p>
								<p>Locked {getDate(lockTime)} . Unlocks {getDate(unlockTime)}</p>
							</Box>

							<Box>
								<Button variant='contained'
									onClick={() => withdrawTokens(lockerId)}
									disabled={Date.now() < (unlockTime.toNumber() * 1000)}>
									Withdraw
								</Button>
							</Box>
						</Box>
					))
				}
			</>
		)
	}

	const ERC721Locks = () => {
		return (
			<>
				{
					erc721Locks.map(({ tokenOwner, tokenType,
						tokenAddress, tokenId, tokenAmount,
						lockTime, unlockTime, isWithdrawn,
						tokenName, tokenSymbol, tokenAmount2, lockerId
					}, idx) => (
						<Box key={idx} display='flex' flexDirection='row'
							justifyContent='space-between' flexWrap='wrap'
						>
							<Box>
								<p>{tokenName} - Id: {tokenId.toString()} Symbol: {tokenSymbol}</p>
								<p>Locked {getDate(lockTime)} . Unlocks {getDate(unlockTime)}</p>
							</Box>

							<Box>
								<Button variant='contained'
									onClick={() => withdrawTokens(lockerId)}
									disabled={Date.now() < (unlockTime.toNumber() * 1000)}>
									Withdraw
								</Button>
							</Box>
						</Box>
					))
				}
			</>
		)
	}

	const ERC1155Locks = () => {
		return (
			<>
				{
					erc1155Locks.map(({ tokenOwner, tokenType,
						tokenAddress, tokenId, tokenAmount,
						lockTime, unlockTime, isWithdrawn,
						tokenName, tokenSymbol, tokenAmount2, lockerId
					}, idx) => (
						<Box key={idx} display='flex' flexDirection='row'
							justifyContent='space-between' flexWrap='wrap'
						>
							<Box>
								<p>{tokenName} - Id: {tokenId.toString()} Amount: {tokenAmount2.toString()}</p>
								<p>TokenAddress: {tokenAddress}</p>
								<p>Locked {getDate(lockTime)} . Unlocks {getDate(unlockTime)}</p>
							</Box>

							<Box>
								<Button variant='contained'
									onClick={() => withdrawTokens(lockerId)}
									disabled={Date.now() < (unlockTime.toNumber() * 1000)}>
									Withdraw
								</Button>
							</Box>
						</Box>
					))
				}
			</>
		)
	}


	return (


		<Stack mb={4}>

			<AlertMessages message1={message1} />

			<Typography variant='h5' mt={4}>My Locks</Typography>
			<Box>
				<Typography variant='h6'>
					ERC20 Tokens
				</Typography>
				{isFetching ? <CircularProgress /> : <ERC20Locks />}
			</Box>
			<Box>
				<Typography variant='h6'>
					ERC721 Tokens
				</Typography>
				{isFetching ? <CircularProgress /> : <ERC721Locks />}
			</Box>
			<Box>
				<Typography variant='h6'>
					ERC1155 Tokens
				</Typography>
				{isFetching ? <CircularProgress /> : <ERC1155Locks />}
			</Box>
		</Stack>

	)
}