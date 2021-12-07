const { expect } = require('chai')
const { ethers, waffle } = require('hardhat')
const BN = ethers.BigNumber.from

describe('MultiSender Contract', function () {

	let multiSender, tron, devyani, penguins;
	let user0, user1, user2;
	const user3 = '0x7E85585e3e3f4A1ce734f14bf0C0C951Cd887880'
	const user4 = '0x9C50dbFB7B65f2d1702496DA48AdfAB3D99A116e'
	const provider = waffle.provider

	it('Set User Addresses', async function () {
		const [owner, addr1, addr2] = await ethers.getSigners();
		user0 = await owner.getAddress()
		user1 = await addr1.getAddress()
		user2 = await addr2.getAddress()
	})

	it('Deploy MultiSender Contract', async function () {
		const MultiSender = await ethers.getContractFactory('MultiSenderV2')
		multiSender = await MultiSender.deploy()
		await multiSender.deployed()
	})

	// ETH Transfers
	it('ETH: msg.value should be equal to totalAmount', async function () {
		await expect(multiSender.transferETH([user1, user2], [13000, 15000])).to.be.revertedWith('03')
		await expect(multiSender.transferETH([user1, user2], [13000, 15000], { value: 10000 })).to.be.revertedWith('03')
		await expect(multiSender.transferETH([user1, user2], [13000, 15000], { value: 50000 })).to.be.revertedWith('03')
	})
	it('ETH: send to addresses', async function () {
		const amount1 = '17000', amount2 = '21000'
		await multiSender.transferETH([user3, user4], [amount1, amount2], { value: BN(amount1).add(amount2) })
		expect(await provider.getBalance(user3)).to.equal(amount1)
		expect(await provider.getBalance(user4)).to.equal(amount2)
	})

	// ERC20 Transfers
	it('Deploy Tron(ERC20) Contract', async function () {
		const TronFactory = await ethers.getContractFactory('Tron')
		tron = await TronFactory.deploy()
		await tron.deployed()

		expect(await tron.name()).to.equal('Tron')
		expect(await tron.symbol()).to.equal('TRX')
		expect(await tron.decimals()).to.equal(18)
	})
	it('Send ERC20 tokens to User1 and User2', async function () {
		expect(await tron.balanceOf(user1)).to.equal('0')
		expect(await tron.balanceOf(user2)).to.equal('0')

		const amount1 = BN('10').mul(BN('10').pow('18'))
		const amount2 = BN('13').mul(BN('10').pow('18'))
		await tron.approve(multiSender.address, amount1.add(amount2))
		await multiSender.transferERC20(tron.address, [user1, user2], [amount1, amount2])
		expect(await tron.balanceOf(user1)).to.equal(amount1)
		expect(await tron.balanceOf(user2)).to.equal(amount2)
	})


	// ERC721 Transfers
	it('Deploy Devyani(ERC721) Contract', async function () {
		const Devyani = await ethers.getContractFactory('Devyani')
		devyani = await Devyani.deploy()
		await devyani.deployed()

		expect(await devyani.name()).to.equal('Devyani')
		expect(await devyani.symbol()).to.equal('DV')
	})
	it('Mint ERC721 Tokens', async function () {
		await devyani.safeMint(user0, 1)
		await devyani.safeMint(user0, 2)
		expect(await devyani.ownerOf(1)).to.equal(user0)
		expect(await devyani.ownerOf(2)).to.equal(user0)
	})
	it('Send ERC721 to User1 and User2', async function () {
		expect(await devyani.ownerOf(1)).to.not.equal(user1)
		expect(await devyani.ownerOf(2)).to.not.equal(user2)

		await devyani.setApprovalForAll(multiSender.address, true)
		await multiSender.transferERC721(devyani.address, [user1, user2], [1, 2])

		expect(await devyani.ownerOf(1)).to.equal(user1)
		expect(await devyani.ownerOf(2)).to.equal(user2)
	})


	// ERC1155 Transfers
	it('Deploy Penguins(ERC1155) Contract', async function () {
		const Penguins = await ethers.getContractFactory('Penguins')
		penguins = await Penguins.deploy()
		await penguins.deployed()
	})
	it('Mint ERC1155 Tokens', async function () {
		await penguins.mintBatch(user0, [1, 2], [20, 20], '0x')
		expect(await penguins.balanceOf(user0, 1)).to.equal(20)
		expect(await penguins.balanceOf(user0, 2)).to.equal(20)
	})
	it('Send ERC1155 Tokens to User1 and User2', async function () {
		expect(await penguins.balanceOf(user1, 1)).to.not.equal(4)
		expect(await penguins.balanceOf(user2, 2)).to.not.equal(4)

		await penguins.setApprovalForAll(multiSender.address, true)
		await multiSender.transferERC1155(penguins.address, [user1, user2], [1, 2], [4, 4])

		expect(await penguins.balanceOf(user1, 1)).to.equal(4)
		expect(await penguins.balanceOf(user2, 2)).to.equal(4)
	})
})

