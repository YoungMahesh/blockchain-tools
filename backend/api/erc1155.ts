import { ethers } from "ethers"
import { getMultiSenderAddress, getMultiSenderContract } from "../common/web3Provider"

const erc1155Abi = [
	'function isApprovedForAll(address account, address operator) external view returns (bool)',
	'function setApprovalForAll(address operator, bool approved) external'
]

export const getErc1155Contract = (tokenAddr: string, signer: ethers.Signer) => {
	return new ethers.Contract(tokenAddr, erc1155Abi, signer)
}

export const getErc1155Approval = async (signer: ethers.Signer, tokenAddr: string) => {
	try {
		const currUser = await signer.getAddress()
		const currChain = await signer.getChainId()
		const erc1155Contract = getErc1155Contract(tokenAddr, signer)
		const multiSenderAddr = getMultiSenderAddress(currChain)
		const isAlreadyApproved = await erc1155Contract.isApprovedForAll(currUser, multiSenderAddr)
		if (isAlreadyApproved) return true
		await erc1155Contract.setApprovalForAll(multiSenderAddr, true)
		return true
	} catch (err) {
		console.log(err)
		return false
	}
}

export const transferErc1155 = async (signer: ethers.Signer, tokenAddr: string, recipientsArr: string[], tokenIdsArr: string[], amountsArr) => {
	try {
		const currChain = await signer.getChainId()
		const multiSenderContract = getMultiSenderContract(signer, currChain)
		const txn = await multiSenderContract.transferERC1155(tokenAddr, recipientsArr, tokenIdsArr, amountsArr)
		await txn.wait()
		return { isTransferred: true, hash: txn.hash }
	} catch (err) {
		console.log(err)
		return { isTransferred: false, hash: '' }
	}
}

