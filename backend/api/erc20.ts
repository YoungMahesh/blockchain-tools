import { ethers } from "ethers"
import { getMultiSenderAddress, getMultiSenderContract, getSigner } from "./web3Provider"

const erc20Abi = [
	'function approve(address spender, uint256 amount) external returns (bool);',
	'function decimals() public view virtual override returns (uint8)'
]

export const getErc20Contract = (tokenAddr: string, signer: ethers.Signer) => {
	return new ethers.Contract(tokenAddr, erc20Abi, signer)
}

export const convertAmountsToWei = async (signer: ethers.Signer, tokenAddr: string, amountsArr: string[]) => {
	try {
		const erc20Contract = getErc20Contract(tokenAddr, signer)
		const decimals = await erc20Contract.decimals()
		const amountsInWeiArr = []
		for (let i = 0; i < amountsArr.length; i++) {
			amountsInWeiArr[i] = ethers.utils.parseUnits(amountsArr[i], decimals)
		}
		return amountsInWeiArr
	} catch (err) {
		console.log(err)
		return []
	}
}

export const getApproval = async (signer: ethers.Signer, tokenAddr: string, amountsInWeiArr: string[]) => {
	try {
		const currChain = await signer.getChainId()
		const erc20Contract = getErc20Contract(tokenAddr, signer)
		const multiSenderAddr = getMultiSenderAddress(currChain)
		let totalAmountInWei = ethers.BigNumber.from('0')
		for (let i = 0; i < amountsInWeiArr.length; i++) {
			totalAmountInWei = totalAmountInWei.add(amountsInWeiArr[i])
		}
		await erc20Contract.approve(multiSenderAddr, totalAmountInWei)
		return true
	} catch (err) {
		console.log(err)
		return false
	}
}

export const transferErc20 = async (tokenAddr: string, recipientsArr: string[], amountsInWeiArr: string[]) => {
	try {
		const signer = await getSigner()
		const currChain = await signer.getChainId()
		const multiSenderContract = getMultiSenderContract(signer, currChain)
		const txn = await multiSenderContract.transferERC20(tokenAddr, recipientsArr, amountsInWeiArr)
		await txn.wait()
		return true
	} catch (err) {
		console.log(err)
		return false
	}
}

