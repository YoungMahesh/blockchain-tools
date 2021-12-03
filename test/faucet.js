const { BigNumber } = require('@ethersproject/bignumber')
const { expect } = require('chai')
const { ethers } = require('hardhat')
const BN = BigNumber.from

describe('Faucet Contract', function () {

	let faucetContract, tronContract, user0, signer1, user1;

	it('Set User Addresses', async function () {
		const [owner, addr1] = await ethers.getSigners();
		user0 = await owner.getAddress()
		signer1 = addr1
		user1 = await addr1.getAddress()
	})

	it('Deploy Tron Contract', async function () {
		const TronFactory = await ethers.getContractFactory('Tron')
		tronContract = await TronFactory.deploy()
		await tronContract.deployed()
		expect(await tronContract.name()).to.equal('Tron')
		expect(await tronContract.symbol()).to.equal('TRX')
		expect(await tronContract.decimals()).to.equal(18)
	})

	it('Deploy FaucetContract', async function () {
		const FaucetContractFactory = await ethers.getContractFactory('FaucetV1')
		faucetContract = await FaucetContractFactory.deploy()
		await faucetContract.deployed()

		await faucetContract.changeErc20Data(tronContract.address, 'Tron', 'TRX', 18)
		expect(await faucetContract.erc20Name()).to.equal('Tron')
		expect(await faucetContract.erc20Symbol()).to.equal('TRX')
		expect(await faucetContract.erc20Decimals()).to.equal(BN('18'))
		expect(await faucetContract.getErc20Balance()).to.equal(BN('0'))
	})

	it('Initial ERC20 balance', async function () {
		const user0Balance = await tronContract.balanceOf(user0)
		const expectedBal = BN('21000').mul(BN('10').pow('18'))
		expect(user0Balance).to.equal(expectedBal)
	})

	it('Send ERC20 tokens to contract', async function () {
		const amountToSend = BN('10000').mul(BN('10').pow('18'))
		await tronContract.transfer(faucetContract.address, amountToSend)
		expect(await faucetContract.getErc20Balance()).to.equal(amountToSend)
	})

	it('Get 1000 erc20 tokens from faucet', async function () {
		const oneThousandTRX = BN('1000').mul(BN('10').pow('18'))
		expect(await tronContract.balanceOf(user1)).to.equal('0')
		await faucetContract.connect(signer1).get1000Erc20Tokens()
		expect(await tronContract.balanceOf(user1)).to.equal(oneThousandTRX)
	})
})

