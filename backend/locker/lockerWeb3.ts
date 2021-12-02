import { getLockerContract, getSigner } from "../api/web3Provider"

export const transferTokensToLocker = async (_tokenType: string,
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