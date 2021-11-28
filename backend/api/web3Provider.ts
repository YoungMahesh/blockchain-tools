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
	if (_chainId === 4002) return '0x845E5C70AaAddb44522fd98Ce78743176b4715c6'
	// '0xfa2' === 4002
	if (_chainId === 4) return '0x9c61cdd6436599F089b4AdA60EF433be31553a8c'
	// '0x4' === 4              verified on sourcify.dev
	return null
}
export const getExplorerUrls = (_chainId: number) => {
	if (_chainId === 4002) return 'https://testnet.ftmscan.com/tx/'
	if (_chainId === 4) return 'https://rinkeby.etherscan.io/tx/'
}

export const getMultiSenderContract = (signer: Signer, currChain: number) => {
	const multiSenderAddr = getMultiSenderAddress(currChain)
	return new ethers.Contract(multiSenderAddr, MultiSenderMetadata.abi, signer)
}

