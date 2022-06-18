import { ethers, Contract } from 'ethers'
import FaucetMetadata from '../../artifacts/contracts/faucet/FaucetV2.sol/FaucetV2.json'
import { abiInfo, getServerInfo, serverInfo } from '../common/1.contractAddr'
import { getSigner } from '../common/web3Provider'

export const getFaucetAddress = (_chainId: number) => {
  if (_chainId === 4) return '0xBEAaaA4C1e57936781ceb1c7c5fC9599D3210C89'
  if (_chainId === 4002) return '0xf399c967BC29110E469661c7d7C2C2F0B1Fe69A1'
  if (_chainId === 1666700000)
    return '0xf4910d212D6d6A5be64806e718dA038BC2392f0b'
  if (_chainId === 80001) return '0xf4910d212D6d6A5be64806e718dA038BC2392f0b'

  if (_chainId === 1666600000)
    return '0x53f636873c01aef4c631625f83c86be104e5895c'
  if (_chainId === 137) return '0x7e82C1f42dB7D3E31725841719Ef674831CDE045'
  if (_chainId === 250) return '0xf4910d212D6d6A5be64806e718dA038BC2392f0b'
  return ''
}

export const getFaucetContract = (
  chainId: number,
  isWrite: boolean
): Contract => {
  const abi1 = FaucetMetadata.abi
  const { contracts, network } = getServerInfo(chainId)
  const { faucetAddr } = contracts
  const { faucetAbi } = abiInfo
  if (serverInfo[chainId] && isWrite)
    return new Contract(faucetAddr, faucetAbi, getSigner())
  return new Contract(faucetAddr, faucetAbi, network.provider)
}

export const getFaucetTokensAddr = (_chainId: number) => {
  if (_chainId === 4)
    return {
      erc20: '0x3f893e1d1ca9e6b01559fe2621e79b17aa53608c',
      erc721: '0xc2d0a05e3f4671443ad0d0eaf85cf9a2cf1e2f18',
      erc1155: '0x248bc25565e42c1c964864d2f38f8634c7fd3f31'
    }
  if (_chainId === 4002)
    return {
      erc20: '0x4d5d37cf79aebab14805ce6d90d69bfbd5d8ffae',
      erc721: '0x95247e4f50ad7c19c2c0d5e20e067b3d4cf7c917',
      erc1155: '0xd3877b669c8afe57503fc7db8b01e910e7ed8d7c'
    }
  if (_chainId === 80001)
    return {
      erc20: '0xb0010f1c3c469af1e4a93475a9b21ac06b736c8c',
      erc721: '0x738454f114610fb2b8493670efd52f8b26432b4d',
      erc1155: '0x037b599f6b74820557f13457d96f6c4a3664d576'
    }
  if (_chainId === 1666700000)
    return {
      erc20: '0xB0010f1C3C469aF1E4A93475A9B21ac06B736C8C',
      erc721: '0x738454f114610fb2B8493670EfD52f8b26432B4D',
      erc1155: '0x037B599F6B74820557f13457D96f6c4A3664d576'
    }

  if (_chainId === 1666600000)
    return {
      erc20: '0x704Da5aD22F366134E8E58c7FD2b28F3DAf323d5',
      erc721: '0x397b5C855959e8C95C33Af2E72f232a632aaaAc4',
      erc1155: '0x17c7a82ff85382371b849b5B4548953c70ec7BA6'
    }
  if (_chainId === 250)
    return {
      erc20: '0xb0010f1c3c469af1e4a93475a9b21ac06b736c8c',
      erc721: '0x738454f114610fb2b8493670efd52f8b26432b4d',
      erc1155: '0x037b599f6b74820557f13457d96f6c4a3664d576'
    }
  if (_chainId === 137)
    return {
      erc20: '0xcf22d1c05eb783582bd191f3cc6e8f3de9777a29',
      erc721: '0xc3eee84aa2208ef650d62f388c3a293ad37ad85a',
      erc1155: '0x2e27ae75078506544449ddb144e070e09e6a96d2'
    }
  return { erc20: '', erc721: '', erc1155: '' }
}
export const getEtherFaucetInfo = (_chainId: number) => {
  if (_chainId === 4)
    return {
      ethName: 'Ether',
      faucetLink: 'https://faucet.rinkeby.io/'
    }
  if (_chainId === 4002)
    return {
      ethName: 'Fantom',
      faucetLink: 'https://faucet.fantom.network/'
    }
  if (_chainId === 80001)
    return {
      ethName: 'Polygon Mumbai',
      faucetLink: 'https://faucet.polygon.technology/'
    }
  if (_chainId === 1666700000)
    return {
      ethName: 'Harmony One',
      faucetLink: 'https://faucet.pops.one/'
    }

  return { ethName: '', faucetLink: '' }
}
export const getFaucetErc20Details = (_chainId: number) => {
  if (
    _chainId === 4 ||
    _chainId === 4002 ||
    _chainId === 80001 ||
    _chainId === 1666700000
  )
    return { name: 'Ramanujan', symbol: 'RA', decimals: '18' }
  return { name: '', symbol: '', decimals: '' }
}
export const getFaucetErc721Details = (_chainId: number) => {
  if (
    _chainId === 4 ||
    _chainId === 4002 ||
    _chainId === 80001 ||
    _chainId === 1666700000
  )
    return { name: 'Sanaya', symbol: 'SY' }
  return { name: '', symbol: '' }
}
