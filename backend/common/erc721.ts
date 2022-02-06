import { ethers } from 'ethers'
import { getSigner } from './web3Provider'
import { getLockerContract } from '../api/locker'

const erc721Abi = [
  'function name() public view returns (string memory)',
  'function symbol() public view returns (string memory)',
  'function isApprovedForAll(address owner, address operator) external view returns (bool)',
  'function setApprovalForAll(address operator, bool _approved) external'
]

export const getErc721Contract = (tokenAddr: string) => {
  const signer = getSigner()
  return new ethers.Contract(tokenAddr, erc721Abi, signer)
}

export const getErc721Approval = async (
  tokenAddr: string,
  operator: string
) => {
  try {
    const signer = getSigner()
    const currUser = await signer.getAddress()
    const erc721Contract = getErc721Contract(tokenAddr)
    const isAlreadyApproved = await erc721Contract.isApprovedForAll(
      currUser,
      operator
    )
    if (isAlreadyApproved) return true
    const txn = await erc721Contract.setApprovalForAll(operator, true)
    await txn.wait(1)
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}

export const transferErc721ToLocker = async (
  _tokenType: string,
  _tokenAddress: string,
  _tokenId: string,
  _tokenAmountInWei: string,
  _unlockTime: string
) => {
  try {
    const signer = getSigner()
    const chainId = await signer.getChainId()
    const lockerContract = getLockerContract(signer, chainId)
    // console.log(_tokenType, _tokenAddress, _tokenId, _tokenAmountInWei, _unlockTime)
    const txn = await lockerContract.createLocker(
      _tokenType,
      _tokenAddress,
      _tokenId,
      _tokenAmountInWei,
      _unlockTime
    )
    return { isLocked: true, hash: txn.hash }
  } catch (err) {
    console.log(err)
    return { isLocked: false, hash: '' }
  }
}
