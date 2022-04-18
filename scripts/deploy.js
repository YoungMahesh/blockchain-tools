const { ethers, run } = require('hardhat')
const { serverInfo } = require('./variables')

const deployNetwork = 4002
async function main() {
  // const FaucetFactory = await ethers.getContractFactory('FaucetFactory')
  // const faucetFactory = await FaucetFactory.deploy()
  // await faucetFactory.deployed()
  // console.log('FaucetFactory deployed to:', faucetFactory.address)
  // await run('verify:verify', {
  //   address: serverInfo[deployNetwork].faucetFactoryAddr,
  //   constructorArguments: [],
  // })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
