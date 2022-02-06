import { ethers } from 'ethers'
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
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' // '0x' + '0'.repeat(40)

export const getSigner = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  return provider.getSigner()
}

export const loadWeb3 = async (
  setWallet: Function,
  setChainId: Function,
  setChainIdMsg: Function,
  setWalletMsg: Function
) => {
  if (!window.ethereum) {
    setChainIdMsg(messagesTable.NOT_INSTALLED)
  } else {
    const signer = getSigner()
    const chainId = await signer.getChainId()
    setChainId(chainId)
    const accounts = await window.ethereum.request({ method: 'eth_accounts' })
    handleAccountChanged(accounts, setWallet, setWalletMsg)
    window.ethereum.on('chainChanged', () => window.location.reload())
    window.ethereum.on('accountsChanged', (accounts: string[]) =>
      handleAccountChanged(accounts, setWallet, setWalletMsg)
    )
  }
}

export const handleAccountChanged = (
  accounts: string[],
  setWallet: Function,
  setWalletMsg: Function
) => {
  if (accounts.length > 0) {
    setWallet(accounts[0])
    setWalletMsg('')
  } else {
    setWallet('')
    setWalletMsg(messagesTable.METAMASK_LOCKED)
  }
}

export const getExplorerUrls = (_chainId: number) => {
  if (_chainId === 1666700000) return 'https://explorer.testnet.harmony.one/tx/'
  if (_chainId === 80001) return 'https://mumbai.polygonscan.com/tx/'
  if (_chainId === 4002) return 'https://testnet.ftmscan.com/tx/'
  if (_chainId === 4) return 'https://rinkeby.etherscan.io/tx/'

  if (_chainId === 19) return 'https://songbird-explorer.flare.network/tx/'
  if (_chainId === 1666600000) return 'https://explorer.harmony.one/tx/'
  if (_chainId === 137) return 'https://polygonscan.com/tx/'
  if (_chainId === 250) return 'https://ftmscan.com/tx/'
  return ''
}
export const getTokenUrlPrefix = (_chainId: number) => {
  if (_chainId === 1666700000)
    return 'https://explorer.testnet.harmony.one/address/'
  if (_chainId === 80001) return 'https://mumbai.polygonscan.com/token/'
  if (_chainId === 4002) return 'https://testnet.ftmscan.com/token/'
  if (_chainId === 4) return 'https://rinkeby.etherscan.io/token/'

  if (_chainId === 19) return 'https://songbird-explorer.flare.network/token/'
  if (_chainId === 1666600000) return 'https://explorer.harmony.one/address/'
  if (_chainId === 137) return 'https://polygonscan.com/token/'
  if (_chainId === 250) return 'https://ftmscan.com/token/'
  return ''
}

export const convertEthToWei = (_amountInEth: string): ethers.BigNumber => {
  try {
    return ethers.utils.parseEther(_amountInEth)
  } catch (err) {
    console.log(err)
    return BN('0')
  }
}
