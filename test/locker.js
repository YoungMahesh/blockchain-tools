// const { BigNumber } = require('@ethersproject/bignumber')
const { expect } = require('chai')
const { ethers } = require('hardhat')
const BN = ethers.BigNumber.from

describe('Locker Contract', function () {

	let locker, tron, devyani, penguins;
	let user0, signer1, user1, user2;
	let lockerId1, lockerId2;

	it('Set User Addresses', async function () {
		const [owner, addr1, addr2] = await ethers.getSigners();
		user0 = await owner.getAddress()
		signer1 = addr1
		user1 = await addr1.getAddress()
		user2 = await addr2.getAddress()
	})

	it('Deploy Locker Contract', async function () {
		const Locker = await ethers.getContractFactory('LockerV2')
		locker = await Locker.deploy()
		await locker.deployed()
	})


	// ERC20 Lock and Unlock
	it('ERC20: Deploy Tron Contract', async function () {
		const TronFactory = await ethers.getContractFactory('Tron')
		tron = await TronFactory.deploy()
		await tron.deployed()

		expect(await tron.name()).to.equal('Tron')
		expect(await tron.symbol()).to.equal('TRX')
		expect(await tron.decimals()).to.equal(18)
	})
	it('ERC20: Lock Tokens', async function () {
		const amount1 = BN('10').mul(BN('10').pow('18'))

		await tron.approve(locker.address, amount1.mul(2))

		// time in past
		await locker.createLocker('erc20', tron.address, 0, amount1, 10000)

		// time in future
		const oneHourLater = Math.floor(Date.now() / 1000) + 3600
		await locker.createLocker('erc20', tron.address, 0, amount1, oneHourLater)

		expect(await tron.balanceOf(locker.address)).to.equal(amount1.mul(2))

		const [id1, id2] = await locker.getLockersOfUser(user0)
		lockerId1 = id1.toString()
		lockerId2 = id2.toString()
		// console.log('LockerIds created: ', lockerId1, lockerId2)
	})
	it('ERC20: Non owner could not unlock', async function () {
		await expect(locker.connect(signer1).destroyLocker(lockerId1)).to.be.revertedWith('02')
	})
	it('ERC20: Owner can unlock', async function () {
		await locker.destroyLocker(lockerId1)
	})
	it('ERC20: Cannot unlock if unlocktime in future', async function () {
		await expect(locker.destroyLocker(lockerId2)).to.be.revertedWith('03')
	})
	it('ERC20: Cannot unlock if already unlocked', async function () {
		await expect(locker.destroyLocker(lockerId1)).to.be.revertedWith('04')
	})


	// ERC721 Lock and Unlock
	it('ERC721: Deploy Devyani Contract', async function () {
		const Devyani = await ethers.getContractFactory('Devyani')
		devyani = await Devyani.deploy()
		await devyani.deployed()

		expect(await devyani.name()).to.equal('Devyani')
		expect(await devyani.symbol()).to.equal('DV')
	})
	it('ERC721: Mint Tokens', async function () {
		await devyani.safeMint(user0, 1)
		await devyani.safeMint(user0, 2)
		expect(await devyani.ownerOf(1)).to.equal(user0)
		expect(await devyani.ownerOf(2)).to.equal(user0)
	})
	it('ERC721: Lock Tokens', async function () {
		expect(await devyani.ownerOf(1)).to.not.equal(locker.address)
		expect(await devyani.ownerOf(2)).to.not.equal(locker.address)

		await devyani.setApprovalForAll(locker.address, true)
		// time in past
		await locker.createLocker('erc721', devyani.address, 1, 1, 10000)

		// time in future
		const oneHourLater = Math.floor(Date.now() / 1000) + 3600
		await locker.createLocker('erc721', devyani.address, 2, 1, oneHourLater)

		const [id1, id2, id3, id4] = await locker.getLockersOfUser(user0)
		// id1, id2 are created at the time of erc20 lock
		lockerId1 = id3.toString()
		lockerId2 = id4.toString()
		// console.log('LockerIds created: ', lockerId1, lockerId2)
	})
	it('ERC721: Unlock Tokens', async function () {
		expect(await devyani.ownerOf(1)).to.equal(locker.address)
		expect(await devyani.ownerOf(1)).to.not.equal(user0)

		await locker.destroyLocker(lockerId1)

		expect(await devyani.ownerOf(1)).to.not.equal(locker.address)
		expect(await devyani.ownerOf(1)).to.equal(user0)
	})

	// ERC1155 Transfers
	it('ERC1155: Deploy Penguins Contract', async function () {
		const Penguins = await ethers.getContractFactory('Penguins')
		penguins = await Penguins.deploy()
		await penguins.deployed()
	})
	it('ERC1155: Mint Tokens', async function () {
		await penguins.mintBatch(user0, [1, 2], [20, 20], '0x')
		expect(await penguins.balanceOf(user0, 1)).to.equal(20)
		expect(await penguins.balanceOf(user0, 2)).to.equal(20)
	})
	it('ERC1155: Lock Tokens', async function () {
		expect(await penguins.balanceOf(locker.address, 1)).to.not.equal(4)
		expect(await penguins.balanceOf(locker.address, 2)).to.not.equal(4)

		await penguins.setApprovalForAll(locker.address, true)
		expect(await penguins.isApprovedForAll(user0, locker.address)).to.equal(true)
		// time in past
		await locker.createLocker('erc1155', penguins.address, 1, 4, 10000)

		// // time in future
		const oneHourLater = Math.floor(Date.now() / 1000) + 3600
		await locker.createLocker('erc1155', penguins.address, 2, 4, oneHourLater)

		const [id1, id2, id3, id4, id5, id6] = await locker.getLockersOfUser(user0)
		// id1, id2 are created at the time of erc20 lock
		// id3, id4 are created at the time of erc721 lock
		lockerId1 = id5.toString()
		lockerId2 = id6.toString()
		// console.log('LockerIds created: ', lockerId1, lockerId2)
	})
	it('ERC1155: Unlock Tokens', async function () {
		expect(await penguins.balanceOf(locker.address, 1)).to.equal(4)
		expect(await penguins.balanceOf(user0, 1)).to.not.equal(20)

		await locker.destroyLocker(lockerId1)

		expect(await penguins.balanceOf(locker.address, 1)).to.not.equal(4)
		expect(await penguins.balanceOf(user0, 1)).to.equal(20)
	})
})

