import { ethers } from "ethers"
import { getErc20Contract } from "../api/erc20"
import { getLockerContract, getMultiSenderAddress, getSigner } from "../api/web3Provider"



export const approveErc20ForLocker = async (_tokenAddress: string, _amountInWei: ethers.BigNumber) => {
	try {
		const signer = getSigner()
		const chainId = await signer.getChainId()
		const erc20Contract = getErc20Contract(_tokenAddress, signer)
		const lockerContract = getLockerContract(signer, chainId)
		const lockerContractAddr = lockerContract.address
		console.log(lockerContractAddr, _amountInWei)
		await erc20Contract.approve(lockerContractAddr, _amountInWei)
		return true
	} catch (err) {
		console.log(err)
		return false
	}
}

export const lockErc20Tokens = async (_tokenType: string,
	_tokenAddress: string, _tokenId: string, _tokenAmountInWei: string, _unlockTime: string) => {
	try {
		const signer = getSigner()
		const chainId = await signer.getChainId()
		const lockerContract = getLockerContract(signer, chainId)
		console.log(lockerContract)
		console.log(_tokenType, _tokenAddress, _tokenId, _tokenAmountInWei, _unlockTime)
		const txn = await lockerContract.createLocker(
			_tokenType, _tokenAddress, _tokenId,
			_tokenAmountInWei, _unlockTime)
		return { isLocked: true, hash: txn.hash }
	} catch (err) {
		console.log(err)
		return { isLocked: false, hash: '' }
	}
}

export const getUserLockers = async () => {
	try {
		const signer = getSigner()
		const currUser = await signer.getAddress()
		const chainId = await signer.getChainId()
		const lockerContract = getLockerContract(signer, chainId)
		const lockerIdsArr = await lockerContract.getLockersOfUser(currUser)
		const promiseArr = []
		for (let i = 0; i < lockerIdsArr.length; i++) {
			promiseArr.push(lockerContract.getLockerInfo(lockerIdsArr[i]))
		}
		const userLockersInfoArr = await Promise.all(promiseArr)
		console.log(userLockersInfoArr)
		return { fetchedLockers: true, userLockersInfoArr }
	} catch (err) {
		console.log(err)
		return { fetchedLockers: false, userLockersInfoArr: [] }
	}
}
