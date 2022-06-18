import { ethers } from 'ethers'
import { BN } from '../common/web3Provider'

export const chainIdsTable = {
  HARMONY: 1666600000,
  FANTOM: 250,
  SONGBIRD: 19,
  POLYGON: 137,
  RINKEBY: 4,
  FANTOM_TESTNET: 4002
}

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

export const multisenderTable = {
  REC_AMT_TXT: 'Recipient,Amount',
  REC_AMT_VAL: `0xd47e77851537557d22eaB0A9179D69C99D98A8be,18.02
0xeEa2269aac3D0F614Ad9813Aa8243898E2EeE2e1,0.03`,
  REC_ID_TXT: 'Recipient,TokenId',
  REC_ID_VAL: `0xd47e77851537557d22eaB0A9179D69C99D98A8be,2
0xeEa2269aac3D0F614Ad9813Aa8243898E2EeE2e1,3`,
  REC_ID_AMT_TXT: 'Recipient,TokenId,Amount',
  REC_ID_AMT_VAL: `0xd47e77851537557d22eaB0A9179D69C99D98A8be,2,11
0xeEa2269aac3D0F614Ad9813Aa8243898E2EeE2e1,3,13`
}

export const processRecipientData = (
  recipientData: string,
  tokenType: string,
  decimals: number
) => {
  const recipientsArr: string[] = []
  const tokenIdsArr: ethers.BigNumber[] = []
  const tokenAmountsInWeiArr: ethers.BigNumber[] = []
  try {
    const recipientDataArr = recipientData.trim().split('\n')

    if (tokenType === 'erc20' || tokenType === 'eth') {
      for (let i = 0; i < recipientDataArr.length; i++) {
        const [currRecipient, currAmount] = recipientDataArr[i]
          .trim()
          .split(',')
        recipientsArr.push(currRecipient)
        tokenAmountsInWeiArr.push(ethers.utils.parseUnits(currAmount, decimals))
      }
      return { done: true, recipientsArr, tokenIdsArr, tokenAmountsInWeiArr }
    } else if (tokenType === 'erc721') {
      for (let i = 0; i < recipientDataArr.length; i++) {
        const [currRecipient, currId] = recipientDataArr[i].trim().split(',')
        recipientsArr.push(currRecipient)
        tokenIdsArr.push(BN(currId))
      }
      return { done: true, recipientsArr, tokenIdsArr, tokenAmountsInWeiArr }
    } else if (tokenType === 'erc1155') {
      for (let i = 0; i < recipientDataArr.length; i++) {
        const [currRecipient, currId, currAmount] = recipientDataArr[i]
          .trim()
          .split(',')
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

export const currTimeInSec = () => {
  return Math.floor(Date.now() / 1000)
}

export const toHex = (_num: number) => {
  return '0x' + _num.toString(16)
}
