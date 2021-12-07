import { ethers } from "ethers"
import { getLockerContract, getSigner } from "../common/web3Provider"

export const transferTokensToLocker = async (_tokenType: string,
	_tokenAddress: string, _tokenId: ethers.BigNumber, _tokenAmountInWei: ethers.BigNumber, _unlockDate: Date) => {
	try {
		const signer = getSigner()
		const chainId = await signer.getChainId()
		const lockerContract = getLockerContract(signer, chainId)
		// console.log(_tokenType, _tokenAddress, _tokenId, _tokenAmountInWei, _unlockTime)
		const _unlockTime = Math.floor(_unlockDate.getTime() / 1000).toString()
		const txn = await lockerContract.createLocker(
			_tokenType, _tokenAddress, _tokenId,
			_tokenAmountInWei, _unlockTime, {
			value: _tokenType === 'eth' ? _tokenAmountInWei : '0'
		})
		await txn.wait(1)
		return { isLocked: true, hash: txn.hash }
	} catch (err) {
		console.log(err)
		return { isLocked: false, hash: '' }
	}
}