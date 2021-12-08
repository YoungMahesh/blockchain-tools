import { ethers } from "ethers"
import { getErc20Contract } from "../common/erc20"
import { getErc721Contract } from "../common/erc721"
import { getLockerContract, getSigner } from "../common/web3Provider"

export const getTokenInfo = async (_tokenType: string, _tokenAddress: string, _amountInWei: ethers.BigNumber) => {
	try {
		if (_tokenType === 'eth') {
			const tokenAmount2 = ethers.utils.formatUnits(_amountInWei, 18)
			return { tokenName: '', tokenSymbol: '', tokenAmount2 }
		}
		else if (_tokenType === 'erc20') {
			const erc20Contract = getErc20Contract(_tokenAddress)
			const promisesArr = [
				erc20Contract.name(), erc20Contract.symbol(),
				erc20Contract.decimals()
			]
			const [tokenName, tokenSymbol, tokenDecimals] = await Promise.all(promisesArr)
			const tokenAmount2 = ethers.utils.formatUnits(_amountInWei, tokenDecimals)
			return { tokenName, tokenSymbol, tokenAmount2 }
		}
		else if (_tokenType === 'erc721') {
			const erc721Contract = getErc721Contract(_tokenAddress)
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
	lockerId: ethers.BigNumber
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
			const currLockObj = { ...userLockersInfoArr[i], ...tokenInfoArr[i], lockerId: lockerIdsArr[i] }
			userLockersInfoArr2.push(currLockObj)
		}
		console.log(userLockersInfoArr2)
		return { fetchedLockers: true, userLockersInfoArr: userLockersInfoArr2 }
	} catch (err) {
		console.log(err)
		return { fetchedLockers: false, userLockersInfoArr: [] }
	}
}


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