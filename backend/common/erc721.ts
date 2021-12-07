import { getErc721Contract } from "../api/erc721"
import { getLockerContract, getLockerContractAddr, getSigner } from "./web3Provider"

export const approveErc721ForLocker = async (tokenAddr: string) => {
	try {
		const signer = getSigner()
		const currUser = await signer.getAddress()
		const currChain = await signer.getChainId()
		const erc721Contract = getErc721Contract(tokenAddr, signer)
		const lockerAddress = getLockerContractAddr(currChain)
		const isAlreadyApproved = await erc721Contract.isApprovedForAll(currUser, lockerAddress)
		if (isAlreadyApproved) return true
		const txn = await erc721Contract.setApprovalForAll(lockerAddress, true)
		await txn.wait(1)
		return true
	} catch (err) {
		console.log(err)
		return false
	}
}

export const transferErc721ToLocker = async (_tokenType: string,
	_tokenAddress: string, _tokenId: string, _tokenAmountInWei: string, _unlockTime: string) => {
	try {
		const signer = getSigner()
		const chainId = await signer.getChainId()
		const lockerContract = getLockerContract(signer, chainId)
		// console.log(_tokenType, _tokenAddress, _tokenId, _tokenAmountInWei, _unlockTime)
		const txn = await lockerContract.createLocker(
			_tokenType, _tokenAddress, _tokenId,
			_tokenAmountInWei, _unlockTime)
		return { isLocked: true, hash: txn.hash }
	} catch (err) {
		console.log(err)
		return { isLocked: false, hash: '' }
	}
}