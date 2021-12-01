import { Stack, Typography, Box } from '@mui/material'

export default function MyLocks({ userLocks }) {
	return (
		<Stack mb={4}>
			<Typography variant='h5' mt={4}>My Locks</Typography>
			{
				userLocks.map(({ tokenOwner, tokenType,
					tokenAddress, tokenId, tokenAmount,
					lockTime, unlockTime, isWithdrawn,
					tokenName, tokenSymbol, tokenAmount2
				}, idx) => (
					<Box key={idx}>
						<Box>

						</Box>
						<div>
							<p>{tokenName}</p>
							<p>{tokenSymbol}</p>
							<p>{tokenAmount2}</p>
							<p>{tokenOwner}</p>
							<p>{tokenType}</p>
							<p>{tokenAddress}</p>
							<p>{tokenId.toString()}</p>
							<p>{tokenAmount.toString}</p>
							<p>{lockTime.toString()}</p>
							<p>{unlockTime.toString()}</p>
							<p>{isWithdrawn}</p>
						</div>
					</Box>
				))
			}
		</Stack>
	)
}