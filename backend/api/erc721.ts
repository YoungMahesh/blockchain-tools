import { ethers } from "ethers"
import { getMultiSenderAddress, getMultiSenderContract } from "./web3Provider"

const erc721Abi = [
	'function isApprovedForAll(address owner, address operator) external view returns (bool);',
	'function setApprovalForAll(address operator, bool _approved) external;'
]

export const getErc721Contract = (tokenAddr, signer) => {
	return new ethers.Contract(tokenAddr, erc721Abi, signer)
}

export const getApproval = async (signer: ethers.Signer, tokenAddr: string) => {
	try {
		const currUser = await signer.getAddress()
		const currChain = await signer.getChainId()
		const erc721Contract = getErc721Contract(tokenAddr, signer)
		const multiSenderAddr = getMultiSenderAddress(currChain)
		const isAlreadyApproved = await erc721Contract.isApprovedForAll(currUser, multiSenderAddr)
		if (isAlreadyApproved) return true
		await erc721Contract.setApprovalForAll(multiSenderAddr, true)
		return true
	} catch (err) {
		console.log(err)
		return false
	}
}

export const transferErc721 = async (signer, tokenAddr, recipientsArr, amountsArr) => {
	try {
		const currChain = await signer.getChainId()
		const multiSenderContract = getMultiSenderContract(signer, currChain)
		const txn = await multiSenderContract.transferERC721(tokenAddr, recipientsArr, amountsArr)
		await txn.wait()
		return true
	} catch (err) {
		console.log(err)
		return false
	}
}

