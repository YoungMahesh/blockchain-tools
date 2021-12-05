import { ethers } from 'ethers'
import { Signer } from 'ethers/src.ts'
import MultiSenderMetadata from '../../artifacts/contracts/multisender/MultiSender.sol/MultiSender.json'
import LockerMetadata from '../../artifacts/contracts/locker/LockerV2.sol/LockerV2.json'
import FaucetMetadata from '../../artifacts/contracts/faucet/FaucetV2.sol/FaucetV2.json'
import { messagesTable } from './utils'

declare global {
	interface Window {
		ethereum: any
		signer: ethers.Signer
		chainId: number
		wallet: string
	}
}

export const loadWeb3 = async (setWallet: Function, setChainId: Function,
	setMessage1: Function, getContractAddr: Function) => {
	if (!window.ethereum) {
		window.signer = null
		window.chainId = -1
		window.wallet = ''
		setMessage1(messagesTable.NOT_INSTALLED)
	} else {
		window.signer = getSigner()
		window.chainId = await window.signer.getChainId()
		const accounts = await window.ethereum.request({ method: 'eth_accounts' })
		handleAccountChanged(accounts, setWallet, setMessage1)
		window.ethereum.on('chainChanged', () => window.location.reload())
		window.ethereum.on('accountsChanged', (accounts: string[]) => handleAccountChanged(accounts, setWallet, setMessage1))
	}
	setWallet(window.wallet)
	setChainId(window.chainId)
	if (getContractAddr(window.chainId) === '')
		setMessage1(messagesTable.NOT_SUPPORTED)
}

const handleAccountChanged = (accounts: string[], setWallet: Function, setMessage1: Function) => {
	if (accounts.length > 0) {
		window.wallet = accounts[0]
		setMessage1('')
	}
	else {
		window.wallet = ''
		setMessage1(messagesTable.METAMASK_LOCKED)
	}
	setWallet(window.wallet)
}

export const getSigner = () => {
	const provider = new ethers.providers.Web3Provider(window.ethereum)
	return provider.getSigner()
}

export const getMultiSenderAddress = (_chainId: number) => {
	if (_chainId === 4002) return '0x845E5C70AaAddb44522fd98Ce78743176b4715c6'
	// '0xfa2' === 4002  fantom-testnet
	if (_chainId === 4) return '0x9c61cdd6436599F089b4AdA60EF433be31553a8c'
	// '0x4' === 4              verified on sourcify.dev
	return ''
}
export const getLockerContractAddr = (_chainId: number) => {
	if (_chainId === 4002) return '0xa0f15ba75b2205BD0908a862EF4eA00051fBDD31'
	return ''
}


export const getFaucetAddress = (_chainId: number) => {
	if (_chainId === 4002) return '0xf399c967BC29110E469661c7d7C2C2F0B1Fe69A1'
	return ''
}
export const getFaucetTokensAddr = (_chainId: number) => {
	if (_chainId === 4002) return {
		erc20: '0x4d5d37cf79aebab14805ce6d90d69bfbd5d8ffae',
		erc721: '0x95247e4f50ad7c19c2c0d5e20e067b3d4cf7c917',
		erc1155: '0xd3877b669c8afe57503fc7db8b01e910e7ed8d7c'
	}
	return { erc20: '', erc721: '', erc1155: '' }
}
export const getFaucetErc20Details = (_chainId: number) => {
	if (_chainId === 4002) return { name: 'Ramanujan', symbol: 'RA', decimals: '18' }
	return { name: '', symbol: '', decimals: '' }
}
export const getFaucetErc721Details = (_chainId: number) => {
	if (_chainId === 4002) return { name: 'Sanaya', symbol: 'SY' }
	return { name: '', symbol: '' }
}

export const getExplorerUrls = (_chainId: number) => {
	if (_chainId === 4002) return 'https://testnet.ftmscan.com/tx/'
	if (_chainId === 4) return 'https://rinkeby.etherscan.io/tx/'
	return ''
}
export const getTokenUrlPrefix = (_chainId: number) => {
	if (_chainId === 4002) return 'https://testnet.ftmscan.com/token/'
	return ''
}

export const getMultiSenderContract = (signer: Signer, currChain: number) => {
	const multiSenderAddr = getMultiSenderAddress(currChain)
	return new ethers.Contract(multiSenderAddr, MultiSenderMetadata.abi, signer)
}
export const getLockerContract = (signer: Signer, _chainId: number) => {
	const lockerAddress = getLockerContractAddr(_chainId)
	return new ethers.Contract(lockerAddress, LockerMetadata.abi, signer)
}
export const getFaucetContract = (signer: Signer, _chainId: number) => {
	const faucetContractAddr = getFaucetAddress(_chainId)
	return new ethers.Contract(faucetContractAddr, FaucetMetadata.abi, signer)
}
