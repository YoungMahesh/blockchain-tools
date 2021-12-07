import { ethers } from "ethers"
import { BN, getMultiSenderContract, getSigner } from "../common/web3Provider"

export const transferToMultiSender = async (tokenType: string, tokenAddr: string, recipientsArr: string[], tokenIdsArr: ethers.BigNumber[], amountsInWeiArr: ethers.BigNumber[]) => {
	try {
		const signer = getSigner()
		const currChain = await signer.getChainId()
		const multiSenderContract = getMultiSenderContract(signer, currChain)

		if (tokenType === 'eth') {
			let totalAmountInWei = BN('0')
			for (let i = 0; i < amountsInWeiArr.length; i++) {
				totalAmountInWei = totalAmountInWei.add(amountsInWeiArr[i])
			}

			const txn = await multiSenderContract.transferETH(recipientsArr, amountsInWeiArr, { value: totalAmountInWei })
			await txn.wait()
			return { isTransferred: true, hash: txn.hash }
		}
		else if (tokenType === 'erc20') {
			const txn = await multiSenderContract.transferERC20(tokenAddr, recipientsArr, amountsInWeiArr)
			await txn.wait()
			return { isTransferred: true, hash: txn.hash }
		}
		return { isTransferred: false, hash: '' }
	} catch (err) {
		console.log(err)
		return { isTransferred: false, hash: '' }
	}
}