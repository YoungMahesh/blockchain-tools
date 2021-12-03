import { ethers } from 'ethers'
import { Signer } from 'ethers/src.ts'
import MultiSenderMetadata from '../../artifacts/contracts/multisender/MultiSender.sol/MultiSender.json'
import LockerMetadata from '../../artifacts/contracts/locker/LockerV1.sol/LockerV1.json'
import FaucetMetadata from '../../artifacts/contracts/faucet/FaucetV1.sol/FaucetV1.json'
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
	return null
}
export const getLockerContractAddr = (_chainId: number) => {
	if (_chainId === 4002) return '0x427467DE1899ccacdF048dE760e1BeD99D017506'
	return ''
}
export const getFaucetAddress = (_chainId: number) => {
	if (_chainId === 4002) return '0x3281208CC7Cad5C398B8046Cbcd8B6a8E4802166'
	return ''
}
export const getExplorerUrls = (_chainId: number) => {
	if (_chainId === 4002) return 'https://testnet.ftmscan.com/tx/'
	if (_chainId === 4) return 'https://rinkeby.etherscan.io/tx/'
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
