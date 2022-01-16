require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan");
/* 
npx hardhat verify --network fantomTestnet 
0xf4910d212D6d6A5be64806e718dA038BC2392f0b
*/
require('dotenv').config()

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address);
  }
})

// npx hardhat deploy --network fantomTestnet --name "MultiSender"
task('deployLocker', 'Deploy Contract')
  .setAction(async (taskArgs, hre) => {
    const Contract = await hre.ethers.getContractFactory('LockerV4')
    const contract = await Contract.deploy()
    await contract.deployed();
    console.log("Contract deployed to:", contract.address);
  })

task('deployMultiSender')
  .setAction(async (taskArgs, hre) => {
    const MultiSender = await hre.ethers.getContractFactory('MultiSenderV2')
    const multiSender = await MultiSender.deploy()
    await multiSender.deployed()
    console.log('Contract deployed to: ', multiSender.address)
  })

// npx hardhat flatten ./contracts/tokens/Devyani.sol > ./contracts/Devyani.sol

const accounts = [process.env.PRIVATE_KEY_0]
module.exports = {
  networks: {
    rinkeby: {
      url: 'https://rinkeby-light.eth.linkpool.io/',
      chainId: 4,
      accounts
    },
    fantomTestnet: {
      url: `https://rpc.testnet.fantom.network/`,
      chainId: 4002,
      accounts
    },
    harmonyTestnet: {
      url: `https://api.s0.pops.one/`,
      chainId: 1666700000,
      accounts
    },
    polygonTestnet: {
      url: `https://rpc-mumbai.maticvigil.com`,
      chainId: 80001,
      accounts
    },
    polygon: {
      url: 'https://polygon-rpc.com',
      chainId: 137,
      accounts
    },
    harmony: {
      url: 'https://api.harmony.one/',
      chainId: 1666600000,
      accounts
    },
    songbird: {
      url: 'https://songbird.towolabs.com/rpc',
      chainId: 19,
      accounts
    }
  },
  solidity: '0.8.2',
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY
  }
}
