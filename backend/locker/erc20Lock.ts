import { ethers } from "ethers"
import { getErc20Contract } from "../api/erc20"
import { getErc721Contract } from "../api/erc721"
import { getLockerContract, getSigner } from "../api/web3Provider"

export const getTokenInfo = async (_tokenType: string, _tokenAddress: string, _amountInWei: ethers.BigNumber) => {
	try {
		const signer = getSigner()
		if (_tokenType === 'erc20') {
			const erc20Contract = getErc20Contract(_tokenAddress, signer)
			const promisesArr = [
				erc20Contract.name(), erc20Contract.symbol(),
				erc20Contract.decimals()
			]
			const [tokenName, tokenSymbol, tokenDecimals] = await Promise.all(promisesArr)
			const tokenAmount2 = ethers.utils.formatUnits(_amountInWei, tokenDecimals)
			return { tokenName, tokenSymbol, tokenAmount2 }
		}
		else if (_tokenType === 'erc721') {
			const erc721Contract = getErc721Contract(_tokenAddress, signer)
			const promisesArr = [
				erc721Contract.name(), erc721Contract.symbol()
			]
			const [tokenName, tokenSymbol] = await Promise.all(promisesArr)
			return { tokenName, tokenSymbol, tokenAmount2: _amountInWei }
		}
		else if (_tokenType === 'erc1155') {
			return { tokenName: 'ERC1155', tokenSymbol: '', tokenAmount2: _amountInWei }
		}
	} catch (err) {
		console.log(err)
		return { tokenName: 'unknown', tokenSymbol: 'unknown', tokenAmount: '0' }
	}
}



export const approveErc20ForLocker = async (_tokenAddress: string, _amountInWei: ethers.BigNumber) => {
	try {
		const signer = getSigner()
		const chainId = await signer.getChainId()
		const erc20Contract = getErc20Contract(_tokenAddress, signer)
		const lockerContract = getLockerContract(signer, chainId)
		const lockerContractAddr = lockerContract.address
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


export interface LockerInfo {
	tokenOwner: string
	tokenType: string
	tokenAddress: string
	tokenId: ethers.BigNumber
	tokenAmount: ethers.BigNumber
	lockTime: ethers.BigNumber
	unlockTime: ethers.BigNumber
	isWithdrawn: boolean
	length: number
}

export interface LockerInfo2 {
	tokenOwner: string
	tokenType: string
	tokenAddress: string
	tokenId: ethers.BigNumber
	tokenAmount: ethers.BigNumber
	lockTime: ethers.BigNumber
	unlockTime: ethers.BigNumber
	isWithdrawn: boolean
	length: number
	tokenName: string
	tokenSymbol: string
	tokenAmount2: ethers.BigNumber
}
export const getUserLockers = async () => {
	try {
		const signer = getSigner()
		const currUser = await signer.getAddress()
		const chainId = await signer.getChainId()
		const lockerContract = getLockerContract(signer, chainId)
		const lockerIdsArr = await lockerContract.getLockersOfUser(currUser)
		const promisesArr = []
		for (let i = 0; i < lockerIdsArr.length; i++) {
			promisesArr.push(lockerContract.getLockerInfo(lockerIdsArr[i]))
		}
		const userLockersInfoArr: LockerInfo[] = await Promise.all(promisesArr)
		console.log(userLockersInfoArr)

		const promisesArr2 = []
		for (let i = 0; i < userLockersInfoArr.length; i++) {
			const { tokenAddress, tokenAmount, tokenType } = userLockersInfoArr[i]
			promisesArr2.push(getTokenInfo(tokenType, tokenAddress, tokenAmount))
		}
		const tokenInfoArr = await Promise.all(promisesArr2)


		const userLockersInfoArr2: LockerInfo2[] = []
		for (let i = 0; i < userLockersInfoArr.length; i++) {
			const currLockObj = { ...userLockersInfoArr[i], ...tokenInfoArr[i] }
			userLockersInfoArr2.push(currLockObj)
		}

		return { fetchedLockers: true, userLockersInfoArr: userLockersInfoArr2 }
	} catch (err) {
		console.log(err)
		return { fetchedLockers: false, userLockersInfoArr: [] }
	}
}

