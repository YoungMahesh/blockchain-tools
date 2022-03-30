import { providers } from 'ethers'
const { JsonRpcProvider } = providers
import FaucetMeta from '../../artifacts/contracts/faucet/FaucetV2.sol/FaucetV2.json'

interface ServerInfoInt {
  [chainId: number]: {
    network: {
      name: string
      // rpc: string
      provider: providers.JsonRpcProvider
    }
    contracts: {
      faucetAddr: string
    }
    explorer: {
      url: string
      // txnPath: 'tx/',
      // contractPath: 'address/',
      // tokenPath: 'token/'
    }
  }
}
export const defaultChainId = 4002
export const serverInfo: ServerInfoInt = {
  4: {
    network: {
      name: 'Rinkeby',
      provider: new JsonRpcProvider('https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'),
    },
    contracts: {
      faucetAddr: '0xBEAaaA4C1e57936781ceb1c7c5fC9599D3210C89'
    },
    explorer: {
      url: '',
    }
  },
  4002: {
    network: {
      name: 'Fantom Testnet',
      provider: new JsonRpcProvider('https://rpc.testnet.fantom.network/'),
    },
    contracts: {
      faucetAddr: '0xf399c967BC29110E469661c7d7C2C2F0B1Fe69A1'
    },
    explorer: {
      url: 'https://testnet.ftmscan.com/',
    }
  },
  1666700000: {
    network: {
      name: 'Harmony Testnet',
      provider: new JsonRpcProvider('https://api.s0.pops.one/'),
    },
    contracts: {
      faucetAddr: '0xf4910d212D6d6A5be64806e718dA038BC2392f0b'
    },
    explorer: {
      url: '',
    }
  },
  80001: {
    network: {
      name: 'Polygon Mumbai',
      provider: new JsonRpcProvider('https://rpc-mumbai.matic.today'),
    },
    contracts: {
      faucetAddr: '0xf4910d212D6d6A5be64806e718dA038BC2392f0b'
    },
    explorer: {
      url: '',
    }
  },
  137: {
    network: {
      name: 'Polygon Mainnet',
      provider: new JsonRpcProvider('https://polygon-rpc.com'),
    },
    contracts: {
      faucetAddr: '0x7e82C1f42dB7D3E31725841719Ef674831CDE045'
    },
    explorer: {
      url: '',
    }
  },
  1666600000: {
    network: {
      name: 'Harmony Mainnet',
      provider: new JsonRpcProvider('https://api.harmony.one/'),
    },
    contracts: {
      faucetAddr: '0x53f636873c01aef4c631625f83c86be104e5895c'
    },
    explorer: {
      url: '',
    }
  },
  250: {
    network: {
      name: 'Fantom Opera',
      provider: new JsonRpcProvider('https://rpc.ftm.tools/'),
    },
    contracts: {
      faucetAddr: '0xf4910d212D6d6A5be64806e718dA038BC2392f0b'
    },
    explorer: {
      url: '',
    }
  },
}

interface AbiInfoInt {
  faucetAbi: any[]
}

export const abiInfo: AbiInfoInt = {
  faucetAbi: FaucetMeta.abi
}

export const getServerInfo = (_chainId: number) => {
  if (!serverInfo[_chainId]) return serverInfo[_chainId]
  return serverInfo[defaultChainId]
}


// songbird
export const provider19 = new JsonRpcProvider(
  'https://songbird.towolabs.com/rpc'
)
export const multiSenderAddr19 = '0x008E90580998256b2DdBa26f942B20d137df62b9'

