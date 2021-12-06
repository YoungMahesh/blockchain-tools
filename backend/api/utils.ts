export const messagesTable = {
	NOT_SUPPORTED: 'Current Network is not supported.',
	NOT_INSTALLED: 'Metamask is not Installed',
	METAMASK_LOCKED: 'Wallet is not connected',
	TRANSFER_PROBLEM: 'Problem occurred while transferring tokens',
	INVALID_DATA: 'Invalid data provided',
	APPROVAL_PROBLEM: 'Problem occurred while approval',
	LOCK_PROBLEM: 'Problem occurred while locking tokens',
	FAUCET_PROBLEM: 'Error occurred while sending tokens'
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

export const processRecipientData = (recipientData: string, tokenType: string) => {
	try {
		const recipients = []
		const tokenIds = []
		const tokenAmounts = []
		const recipientDataArr = recipientData.trim().split('\n')

		if (tokenType === 'erc20') {
			for (let i = 0; i < recipientDataArr.length; i++) {
				const [currRecipient, currAmount] = recipientDataArr[i].trim().split(',')
				recipients.push(currRecipient)
				tokenAmounts.push(currAmount)
			}
			return { recipients, tokenIds, tokenAmounts }
		}
		else if (tokenType === 'erc721') {
			for (let i = 0; i < recipientDataArr.length; i++) {
				const [currRecipient, currId] = recipientDataArr[i].trim().split(',')
				recipients.push(currRecipient)
				tokenIds.push(currId)
			}
			return { recipients, tokenIds, tokenAmounts }
		}
		else if (tokenType === 'erc1155') {
			for (let i = 0; i < recipientDataArr.length; i++) {
				const [currRecipient, currId, currAmount] = recipientDataArr[i].trim().split(',')
				recipients.push(currRecipient)
				tokenIds.push(currId)
				tokenAmounts.push(currAmount)
			}
			return { recipients, tokenIds, tokenAmounts }
		}
	} catch (err) {
		console.log({ err })
		return null
	}
}