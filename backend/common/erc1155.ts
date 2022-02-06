import { ethers } from 'ethers'
import { getSigner } from './web3Provider'

const erc1155Abi = [
  'function isApprovedForAll(address account, address operator) external view returns (bool)',
  'function setApprovalForAll(address operator, bool approved) external'
]

export const getErc1155Contract = (
  tokenAddr: string,
  signer: ethers.Signer
) => {
  return new ethers.Contract(tokenAddr, erc1155Abi, signer)
}

export const getErc1155Approval = async (
  tokenAddr: string,
  operator: string
) => {
  try {
    const signer = getSigner()
    const currUser = await signer.getAddress()
    const erc1155Contract = getErc1155Contract(tokenAddr, signer)
    const isAlreadyApproved = await erc1155Contract.isApprovedForAll(
      currUser,
      operator
    )
    if (isAlreadyApproved) return true
    const txn = await erc1155Contract.setApprovalForAll(operator, true)
    await txn.wait(1)
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}
