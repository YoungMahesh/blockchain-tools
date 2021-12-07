const { expect } = require('chai')
const { ethers } = require('hardhat')
const BN = ethers.BigNumber.from


describe('Faucet Contract', function () {

	let faucet, ramanujan, sanaya, kuber
	let user0, signer1, user1;

	it('Set User Addresses', async function () {
		const [owner, addr1] = await ethers.getSigners();
		user0 = await owner.getAddress()
		signer1 = addr1
		user1 = await addr1.getAddress()
	})

	it('Deploy FaucetContract', async function () {
		const Faucet = await ethers.getContractFactory('FaucetV2')
		faucet = await Faucet.deploy()
		await faucet.deployed()

		const Ramanujan = await ethers.getContractFactory('Ramanujan')
		const erc20Address = await faucet.erc20Address()
		ramanujan = Ramanujan.attach(erc20Address)

		const Sanaya = await ethers.getContractFactory('Sanaya')
		const erc721Address = await faucet.erc721Address()
		sanaya = Sanaya.attach(erc721Address)

		const Kuber = await ethers.getContractFactory('Kuber')
		const erc1155Address = await faucet.erc1155Address()
		kuber = Kuber.attach(erc1155Address)
	})

	it('ERC20: Get 300 tokens from Faucet', async function () {
		const threeHundredTRX = BN('300').mul(BN('10').pow('18'))
		expect(await ramanujan.balanceOf(user1)).to.equal('0')
		await faucet.connect(signer1).get300Erc20Tokens()
		expect(await ramanujan.balanceOf(user1)).to.equal(threeHundredTRX)
	})

	it('ERC721: Mint tokens', async function () {
		await expect(sanaya.ownerOf(0)).to.be.reverted
		await expect(sanaya.ownerOf(1)).to.be.reverted
		await expect(sanaya.ownerOf(2)).to.be.reverted
		await faucet.get3Erc721Tokens()
		expect(await sanaya.ownerOf(0)).to.equal(user0)
		expect(await sanaya.ownerOf(1)).to.equal(user0)
		expect(await sanaya.ownerOf(2)).to.equal(user0)
	})

	it('ERC1155: Mint tokens', async function () {
		expect(await kuber.balanceOf(user0, 0)).to.equal(0)
		await faucet.get1000Erc1155Tokens()
		expect(await kuber.balanceOf(user0, 0)).to.equal(1000)
	})
})
