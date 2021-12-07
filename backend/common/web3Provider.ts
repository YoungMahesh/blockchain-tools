import { ethers } from 'ethers'
import { Signer } from 'ethers/src.ts'
import MultiSenderMetadata from '../../artifacts/contracts/multisender/MultiSenderV2.sol/MultiSenderV2.json'
import LockerMetadata from '../../artifacts/contracts/locker/LockerV3.sol/LockerV3.json'
import { messagesTable } from '../api/utils'

declare global {
	interface Window {
		ethereum: any
		signer: ethers.Signer
		chainId: number
		wallet: string
	}
}

export const BN = ethers.BigNumber.from
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'  // '0x' + '0'.repeat(40)

export const getSigner = () => {
	const provider = new ethers.providers.Web3Provider(window.ethereum)
	return provider.getSigner()
}


export const loadWeb3 = async (setWallet: Function, setChainId: Function, setChainIdMsg: Function, setWalletMsg: Function) => {
	if (!window.ethereum) {
		setChainIdMsg(messagesTable.NOT_INSTALLED)
	} else {
		const signer = getSigner()
		const chainId = await signer.getChainId()
		setChainId(chainId)
		const accounts = await window.ethereum.request({ method: 'eth_accounts' })
		handleAccountChanged(accounts, setWallet, setWalletMsg)
		window.ethereum.on('chainChanged', () => window.location.reload())
		window.ethereum.on('accountsChanged', (accounts: string[]) => handleAccountChanged(accounts, setWallet, setWalletMsg))
	}
}

export const handleAccountChanged = (accounts: string[],
	setWallet: Function, setWalletMsg: Function,) => {
	if (accounts.length > 0) {
		setWallet(accounts[0])
		setWalletMsg('')
	}
	else {
		setWallet('')
		setWalletMsg(messagesTable.METAMASK_LOCKED)
	}
}


export const getMultiSenderAddress = (_chainId: number) => {
	if (_chainId === 4002) return '0x2d37Fba57dEFe1088cfF56D148E028db5d6c467C'
	// '0xfa2' === 4002  fantom-testnet
	return ''
}
export const getLockerContractAddr = (_chainId: number) => {
	if (_chainId === 4002) return '0x9d45e915946C7d1c2061901dbb5A7Cd6d9Db7E00'
	return ''
}



export const getExplorerUrls = (_chainId: number) => {
	if (_chainId === 4) return 'https://rinkeby.etherscan.io/tx/'
	if (_chainId === 4002) return 'https://testnet.ftmscan.com/tx/'
	if (_chainId === 1666700000) return 'https://explorer.testnet.harmony.one/tx/'
	return ''
}
export const getTokenUrlPrefix = (_chainId: number) => {
	if (_chainId === 4002) return 'https://testnet.ftmscan.com/token/'
	if (_chainId === 1666700000) return 'https://explorer.testnet.harmony.one/address/'
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




export const convertEthToWei = (_amountInEth: string): ethers.BigNumber => {
	try {
		return ethers.utils.parseEther(_amountInEth)
	} catch (err) {
		console.log(err)
		return BN('0')
	}
}