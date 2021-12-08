import { ethers } from "ethers"
import { BN, getSigner } from "../common/web3Provider"

const multiSenderV2Abi = [
	'function transferETH(address[] memory _recipients, uint[] memory _amounts) external payable',
	'function transferERC20(address _tokenAddress, address[] memory _recipients, uint[] memory _amounts) external',
	'function transferERC721(address _tokenAddress, address[] memory _recipients, uint[] memory _tokenIds) external',
	'function transferERC1155(address _tokenAddress, address[] memory _recipients, uint[] memory _tokenIds, uint[] memory _amounts) external'
]
export const getMultiSenderAddress = (_chainId: number) => {
	if (_chainId === 4) return '0x349b745Aef5085099cbb8111e52Aba512aF8a607'
	if (_chainId === 4002) return '0x2d37Fba57dEFe1088cfF56D148E028db5d6c467C'
	return ''
}
export const getMultiSenderContract = (currChain: number) => {
	const signer = getSigner()
	const multiSenderAddr = getMultiSenderAddress(currChain)
	return new ethers.Contract(multiSenderAddr, multiSenderV2Abi, signer)
}

export const transferToMultiSender = async (tokenType: string, tokenAddr: string, recipientsArr: string[], tokenIdsArr: ethers.BigNumber[], amountsInWeiArr: ethers.BigNumber[]) => {
	try {
		const signer = getSigner()
		const currChain = await signer.getChainId()
		const multiSenderContract = getMultiSenderContract(currChain)

		let txn
		if (tokenType === 'eth') {
			let totalAmountInWei = BN('0')
			for (let i = 0; i < amountsInWeiArr.length; i++) {
				totalAmountInWei = totalAmountInWei.add(amountsInWeiArr[i])
			}
			txn = await multiSenderContract.transferETH(recipientsArr, amountsInWeiArr, { value: totalAmountInWei })
		}
		else if (tokenType === 'erc20') {
			txn = await multiSenderContract.transferERC20(tokenAddr, recipientsArr, amountsInWeiArr)
		}
		else if (tokenType === 'erc721') {
			txn = await multiSenderContract.transferERC721(tokenAddr, recipientsArr, tokenIdsArr)
		}
		else if (tokenType === 'erc1155') {
			txn = await multiSenderContract.transferERC1155(tokenAddr, recipientsArr, tokenIdsArr, amountsInWeiArr)
		} else {
			return { isTransferred: false, hash: '' }
		}
		await txn.wait()
		return { isTransferred: true, hash: txn.hash }
	} catch (err) {
		console.log(err)
		return { isTransferred: false, hash: '' }
	}
}