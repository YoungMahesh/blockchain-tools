import { ethers } from "ethers"
import { BN } from "../common/web3Provider"

export const messagesTable = {
	NOT_SUPPORTED: 'Current Network is not supported.',
	NOT_INSTALLED: 'Metamask is not Installed',
	METAMASK_LOCKED: 'Wallet is not connected',
	TRANSFER_PROBLEM: 'Problem occurred while transferring tokens',
	INVALID_DATA: 'Invalid data provided',
	APPROVAL_PROBLEM: 'Problem occurred while approval',
	LOCK_PROBLEM: 'Problem occurred while locking tokens',
	FAUCET_PROBLEM: 'Error occurred while sending tokens',
	INVALID_TOKENADDRESS: 'Invalid Token Address'
}

export const btnTextTable = {
	SEND: 'Send',
	APPROVING: 'Approving...',
	SENDING: 'Sending...',
	LOCK: 'Lock',
	LOCKING: 'Locking...',
	GET_ERC20: 'Get 300 Tokens',
	GET_ERC721: 'Get 3 Tokens',
	GET_ERC1155: 'Get 1000 Tokens'
}

export const processRecipientData = (recipientData: string, tokenType: string, decimals: number) => {
	const recipientsArr: string[] = []
	const tokenIdsArr: ethers.BigNumber[] = []
	const tokenAmountsInWeiArr: ethers.BigNumber[] = []
	try {
		const recipientDataArr = recipientData.trim().split('\n')

		if (tokenType === 'erc20' || tokenType === 'eth') {
			for (let i = 0; i < recipientDataArr.length; i++) {
				const [currRecipient, currAmount] = recipientDataArr[i].trim().split(',')
				recipientsArr.push(currRecipient)
				tokenAmountsInWeiArr.push(ethers.utils.parseUnits(currAmount, decimals))
			}
			return { done: true, recipientsArr, tokenIdsArr, tokenAmountsInWeiArr }
		}
		else if (tokenType === 'erc721') {
			for (let i = 0; i < recipientDataArr.length; i++) {
				const [currRecipient, currId] = recipientDataArr[i].trim().split(',')
				recipientsArr.push(currRecipient)
				tokenIdsArr.push(BN(currId))
			}
			return { done: true, recipientsArr, tokenIdsArr, tokenAmountsInWeiArr }
		}
		else if (tokenType === 'erc1155') {
			for (let i = 0; i < recipientDataArr.length; i++) {
				const [currRecipient, currId, currAmount] = recipientDataArr[i].trim().split(',')
				recipientsArr.push(currRecipient)
				tokenIdsArr.push(BN(currId))
				tokenAmountsInWeiArr.push(BN(currAmount))
			}
			return { done: true, recipientsArr, tokenIdsArr, tokenAmountsInWeiArr }
		}
	} catch (err) {
		console.log({ err })
		return { done: false, recipientsArr, tokenIdsArr, tokenAmountsInWeiArr }
	}
}