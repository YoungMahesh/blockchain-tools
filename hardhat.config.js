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
task('deploy', 'Deploy Contract')
  .addParam('name', 'Contract Name')
  .setAction(async (taskArgs, hre) => {
    const Contract = await hre.ethers.getContractFactory(taskArgs.name)
    const contract = await Contract.deploy()
    await contract.deployed();
    console.log("Contract deployed to:", contract.address);
  })

// npx hardhat flatten ./contracts/tokens/Devyani.sol > ./contracts/Devyani.sol

module.exports = {
  networks: {
    fantomTestnet: {
      url: `https://rpc.testnet.fantom.network/`,
      accounts: [process.env.PRIVATE_KEY_0]
    }
  },
  solidity: '0.8.2',
  etherscan: {
    apiKey: process.env.FANTOM_API_KEY
  }
}
