import create from 'zustand'

interface globalState {
  chainId: number
  setChainId: (_chain: number) => void
  wallet: string
  setWallet: (_wallet: string) => void
  isWalletConnected: boolean
  setIsWalletConnected: () => void
  isLoading: boolean
  setIsLoading: (val: boolean) => void

  mobileOpen: boolean
  setMobileOpen: (val: boolean) => void

  hideNetworks: boolean
  setHideNetworks: (val: boolean) => void
}

const useStore0 = create<globalState>((set) => ({
  chainId: -1,
  setChainId: (_chainId: number) => set((state) => ({ chainId: _chainId })),

  wallet: '',
  setWallet: (_wallet: string) => set((state) => ({ wallet: _wallet })),

  isWalletConnected: false,
  setIsWalletConnected: () =>
    set((state) => ({
      // isWalletConnected: isConnected(state.chainId, state.wallet)
    })),

  isLoading: false,
  setIsLoading: (_isLoading) => set((state) => ({ isLoading: _isLoading })),

  mobileOpen: false,
  setMobileOpen: (_isMobOpen) => set((state) => ({ mobileOpen: _isMobOpen })),

  hideNetworks: false,
  setHideNetworks: (_hide) => set((state) => ({ hideNetworks: _hide }))
}))

export default useStore0
