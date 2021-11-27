import { ethers } from 'ethers'
import { Signer } from 'ethers/src.ts'
import MultiSenderMetadata from '../../artifacts/contracts/MultiSender.sol/MultiSender.json'

declare global {
	interface Window {
		ethereum: any
	}
}

export const getSigner = () => {
	const provider = new ethers.providers.Web3Provider(window.ethereum)
	return provider.getSigner()
}

export const getMultiSenderAddress = (_chainId: number) => {
	if (_chainId === 4002) return '0xCf92007F46Ca54C79B24Cb249104b4342fB2D0ce'
	// '0xfa2' === 4002
	return null
}

export const getMultiSenderContract = (signer: Signer, currChain: number) => {
	const multiSenderAddr = getMultiSenderAddress(currChain)
	return new ethers.Contract(multiSenderAddr, MultiSenderMetadata.abi, signer)
}

