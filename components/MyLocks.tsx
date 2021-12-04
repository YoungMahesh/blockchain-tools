import { Stack, Typography, Box, Button } from '@mui/material'
import { ethers } from 'ethers'
import { getLockerContract, getSigner } from '../backend/api/web3Provider'
import { LockerInfo2 } from '../backend/locker/erc20Lock'

interface ListProps {
	userLocks: LockerInfo2[]
	setMessage1: Function
}

export default function MyLocks({ userLocks, setMessage1 }: ListProps) {

	const getDate = (timeInSeconds: ethers.BigNumber) => {
		const timeInMilliSeconds = timeInSeconds.toNumber() * 1000
		const date1 = new Date()
		date1.setTime(timeInMilliSeconds)
		return date1.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
	}

	const withdrawTokens = async (_lockerId: ethers.BigNumber) => {
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

	return (

		<Stack mb={4}>
			<Typography variant='h5' mt={4}>My Locks</Typography>
			<Box>
				<Typography variant='h6'>
					ERC20 Tokens
				</Typography>
				{
					userLocks.filter(obj => !obj.isWithdrawn && obj.tokenType === 'erc20').map(({ tokenOwner, tokenType,
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
			</Box>
			<Box>
				<Typography variant='h6'>
					ERC721 Tokens
				</Typography>
				{
					userLocks.filter(obj => !obj.isWithdrawn && obj.tokenType === 'erc721').map(({ tokenOwner, tokenType,
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
			</Box>
			<Box>
				<Typography variant='h6'>
					ERC1155 Tokens
				</Typography>
				{
					userLocks.filter(obj => !obj.isWithdrawn && obj.tokenType === 'erc1155').map(({ tokenOwner, tokenType,
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
			</Box>
		</Stack>
	)
}