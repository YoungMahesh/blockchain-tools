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


export const getFaucetAddress = (_chainId: number) => {
	if (_chainId === 4002) return '0xf399c967BC29110E469661c7d7C2C2F0B1Fe69A1'
	if (_chainId === 1666700000) return '0xf4910d212D6d6A5be64806e718dA038BC2392f0b'
	return ''
}
export const getEtherFaucetInfo = (_chainId: number) => {
	if (_chainId === 4002) return {
		ethName: 'Fantom',
		faucetLink: 'https://faucet.fantom.network/'
	}
	if (_chainId === 1666700000) return {
		ethName: 'Harmony One',
		faucetLink: 'https://faucet.pops.one/'
	}
	return { ethName: '', faucetLink: '' }
}
export const getFaucetTokensAddr = (_chainId: number) => {
	if (_chainId === 4002) return {
		erc20: '0x4d5d37cf79aebab14805ce6d90d69bfbd5d8ffae',
		erc721: '0x95247e4f50ad7c19c2c0d5e20e067b3d4cf7c917',
		erc1155: '0xd3877b669c8afe57503fc7db8b01e910e7ed8d7c'
	}
	if (_chainId === 1666700000) return {
		erc20: '0xB0010f1C3C469aF1E4A93475A9B21ac06B736C8C',
		erc721: '0x738454f114610fb2B8493670EfD52f8b26432B4D',
		erc1155: '0x037B599F6B74820557f13457D96f6c4A3664d576'
	}
	return { erc20: '', erc721: '', erc1155: '' }
}
export const getFaucetErc20Details = (_chainId: number) => {
	if (_chainId === 4002 || _chainId === 1666700000) return { name: 'Ramanujan', symbol: 'RA', decimals: '18' }
	return { name: '', symbol: '', decimals: '' }
}
export const getFaucetErc721Details = (_chainId: number) => {
	if (_chainId === 4002 || _chainId === 1666700000) return { name: 'Sanaya', symbol: 'SY' }
	return { name: '', symbol: '' }
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

const faucetAbi = [
	'function get300Erc20Tokens() external',
	'function get3Erc721Tokens() external',
	'function get1000Erc1155Tokens() external',
	'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
	'event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)'
]
export const getFaucetContract = (signer: Signer, _chainId: number) => {
	const faucetContractAddr = getFaucetAddress(_chainId)
	return new ethers.Contract(faucetContractAddr, faucetAbi, signer)
}


export const convertEthToWei = (_amountInEth: string): ethers.BigNumber => {
	try {
		return ethers.utils.parseEther(_amountInEth)
	} catch (err) {
		console.log(err)
		return BN('0')
	}
}