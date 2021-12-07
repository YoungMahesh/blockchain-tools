import { getErc1155Contract } from "../api/erc1155"
import { getLockerContract, getLockerContractAddr, getSigner } from "./web3Provider"

export const approveErc1155ForLocker = async (tokenAddr: string) => {
	try {
		const signer = getSigner()
		const currUser = await signer.getAddress()
		const chainId = await signer.getChainId()
		const erc1155Contract = getErc1155Contract(tokenAddr, signer)
		const lockerAddress = getLockerContractAddr(chainId)
		// console.log(currUser, lockerAddress)
		const isAlreadyApproved = await erc1155Contract.isApprovedForAll(currUser, lockerAddress)
		if (isAlreadyApproved) return true
		const txn = await erc1155Contract.setApprovalForAll(lockerAddress, true)
		await txn.wait(1)
		return true
	} catch (err) {
		console.log(err)
		return false
	}
}

