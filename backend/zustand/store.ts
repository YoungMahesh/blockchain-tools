import create from 'zustand'

interface globalState {
  chainId: number
  setChainId: (_chain: number) => void

  chainIdMsg: string
  setChainIdMsg: (_msg: string) => void

  wallet: string
  setWallet: (_wallet: string) => void
  walletMsg: string
  setWalletMsg: (_walletMsg: string) => void
}

const useStore = create<globalState>((set) => ({
  chainId: -1,
  setChainId: (_chainId) => set((state) => ({ chainId: _chainId })),
  chainIdMsg: '',
  setChainIdMsg: (_chainIdMsg) => set((state) => ({ chainIdMsg: _chainIdMsg })),

  wallet: '',
  setWallet: (_wallet) => set((state) => ({ wallet: _wallet })),
  walletMsg: '',
  setWalletMsg: (_walletMsg) => set((state) => ({ walletMsg: _walletMsg }))
}))

export default useStore
