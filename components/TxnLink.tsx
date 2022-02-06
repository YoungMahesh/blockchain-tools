import { getExplorerUrls } from '../backend/common/web3Provider'
export default function TxnLink({ chainId, txnHash }) {
  return (
    <a
      style={{ fontSize: '18px', textAlign: 'center', fontWeight: 'bold' }}
      href={`${getExplorerUrls(chainId)}${txnHash}`}
      target="_blank"
      rel="noreferrer"
    >
      Check Transaction
    </a>
  )
}
