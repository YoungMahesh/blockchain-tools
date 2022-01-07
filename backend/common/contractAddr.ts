import { ethers, providers } from "ethers"
const { JsonRpcProvider } = providers

// rinkeby testnet
export const provider4 = new JsonRpcProvider('https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161')
export const faucetAddr4 = '0xBEAaaA4C1e57936781ceb1c7c5fC9599D3210C89'

// fantom testnet
export const provider4002 = new JsonRpcProvider('https://rpc.testnet.fantom.network/')
export const faucetAddr4002 = '0xf399c967BC29110E469661c7d7C2C2F0B1Fe69A1'

// harmony testnet
export const provider1666700000 = new JsonRpcProvider('https://api.s0.pops.one/')
export const faucetAddr1666700000 = '0xf4910d212D6d6A5be64806e718dA038BC2392f0b'

// polygon mumbai testnet
export const provider80001 = new JsonRpcProvider('https://rpc-mumbai.matic.today')
export const faucetAddr80001 = '0xf4910d212D6d6A5be64806e718dA038BC2392f0b'





// polygon mainnet
export const provider137 = new JsonRpcProvider('https://polygon-rpc.com')
export const faucetAddr137 = '0x7e82C1f42dB7D3E31725841719Ef674831CDE045'

// harmony mainnet
export const provider1666600000 = new JsonRpcProvider('https://api.harmony.one/')
export const faucetAddr1666600000 = '0x53f636873c01aef4c631625f83c86be104e5895c'

// fantom mainnet
export const provider250 = new JsonRpcProvider('https://rpc.ftm.tools/')
export const faucetAddr250 = '0xf4910d212D6d6A5be64806e718dA038BC2392f0b'

