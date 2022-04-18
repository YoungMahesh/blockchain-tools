const { expect } = require('chai')
const { ethers } = require('hardhat')
const { parseEther } = ethers.utils

describe('Faucet Contract', function () {
  let faucetFactory,
    erc20,
    erc20ClaimAmt = parseEther('2')
  let admin, signer1

  it('Set User Addresses', async function () {
    const [_admin, _signer1] = await ethers.getSigners()
    admin = _admin
    signer1 = _signer1
  })

  it('Deploy FaucetContract and ERC20 Token', async function () {
    const FaucetFactory = await ethers.getContractFactory('FaucetFactory')
    faucetFactory = await FaucetFactory.deploy()
    await faucetFactory.deployed()

    const Tron = await ethers.getContractFactory('Tron')
    erc20 = await Tron.deploy()
    await erc20.deployed()
  })

  it('Create Faucet', async function () {
    await erc20.approve(faucetFactory.address, parseEther('10000'))
    await faucetFactory.createFaucent(
      erc20.address,
      parseEther('10000'),
      erc20ClaimAmt
    )
  })

  it('Claim Tokens', async function () {
    expect(await faucetFactory.FaucetTable(erc20.address)).to.eq(erc20ClaimAmt)
    await expect(() =>
      faucetFactory.connect(signer1).claimTokens(erc20.address)
    ).to.changeTokenBalances(
      erc20,
      [faucetFactory, signer1],
      [erc20ClaimAmt.mul(-1), erc20ClaimAmt]
    )
  })
})
