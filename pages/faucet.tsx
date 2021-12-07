import Head from 'next/head'
import {
	Box, Stack, Typography,
} from '@mui/material'
import { getFaucetAddress } from '../backend/common/web3Provider'
import { messagesTable } from '../backend/api/utils'
import { useEffect, useState } from 'react'
import FaucetToken from '../components/FaucetToken'
import TokenTypeSelector from '../components/TokenTypeSelector'
import useStore from '../backend/zustand/store'
import AlertMessages from '../components/AlertMessages'


export default function Faucet() {

	const chainId = useStore(state => state.chainId)
	const chainIdMsg = useStore(state => state.chainIdMsg)
	const setChainIdMsg = useStore(state => state.setChainIdMsg)

	const wallet = useStore(state => state.wallet)
	const walletMsg = useStore(state => state.walletMsg)

	const [tokenType, setTokenType] = useState('erc20')


	useEffect(() => {
		if (getFaucetAddress(chainId) === '') setChainIdMsg(messagesTable.NOT_SUPPORTED)
		else setChainIdMsg('')
	}, [chainId])


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
						!(chainIdMsg === messagesTable.NOT_INSTALLED
							|| chainIdMsg === messagesTable.NOT_SUPPORTED
							|| walletMsg === messagesTable.METAMASK_LOCKED
						) &&
						<>
							<TokenTypeSelector
								tokenType={tokenType} setTokenType={setTokenType} showEth={false}
							/>
							<Typography>Your Address: {wallet}</Typography>
							<Typography>Current ChainId: {chainId}</Typography>
							<FaucetToken chainId={chainId} tokenType={tokenType} />
						</>
					}

					<AlertMessages message1='' />

				</Stack>

			</Box>
		</div>
	)
}
