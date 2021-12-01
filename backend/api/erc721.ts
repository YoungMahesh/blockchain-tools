import { ethers } from "ethers"
import { getMultiSenderAddress, getMultiSenderContract } from "./web3Provider"

const erc721Abi = [
	'function name() public view virtual override returns (string memory)',
	'function symbol() public view virtual override returns (string memory)',
	'function isApprovedForAll(address owner, address operator) external view returns (bool)',
	'function setApprovalForAll(address operator, bool _approved) external'
]

export const getErc721Contract = (tokenAddr: string, signer: ethers.Signer) => {
	return new ethers.Contract(tokenAddr, erc721Abi, signer)
}

export const getErc721Approval = async (signer: ethers.Signer, tokenAddr: string) => {
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

export const transferErc721 = async (signer: ethers.Signer, tokenAddr: string, recipientsArr: string[], tokenIdsArr: string[]) => {
	try {
		const currChain = await signer.getChainId()
		const multiSenderContract = getMultiSenderContract(signer, currChain)
		const txn = await multiSenderContract.transferERC721(tokenAddr, recipientsArr, tokenIdsArr)
		await txn.wait()
		return { isTransferred: true, hash: txn.hash }
	} catch (err) {
		console.log(err)
		return { isTransferred: false, hash: '' }
	}
}

