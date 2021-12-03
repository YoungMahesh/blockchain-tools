const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('Faucet Contract', function () {

	let faucetContract, tronContract;

	beforeEach('Deploy FaucetContract and TronContract', async function () {
		const FaucetContractFactory = await ethers.getContractFactory('FaucetV0')
		faucetContract = await FaucetContractFactory.deploy()
		await faucetContract.deployed()

		const TronFactory = await ethers.getContractFactory('Tron')
		tronContract = await TronFactory.deploy()
		await tronContract.deployed()

		await faucetContract.changeErc20Data(tronContract.address, 'Tron', 'TRX', 18)
	})

	it('Verify deployed ERC20 token details', async function () {
		expect(await tronContract.name()).to.equal('Tron')
		expect(await tronContract.symbol()).to.equal('TRX')
		expect(await tronContract.decimals()).to.equal(18)
	})

	it('Verify details of ERC20 token in faucet', async function () {
		expect(await faucetContract.erc20Name()).to.equal('Tron')
		expect(await faucetContract.erc20Symbol()).to.equal('TRX')
		expect(await faucetContract.erc20Decimals()).to.equal(18)
	})
})

