import create from 'zustand'

const useStore = create(set => ({
	bears: 0,
	increasePopulation: () => set(state => ({ bears: state.bears + 1 })),

	chainId: -1,
	setChainId: (_chainId) => set(state => ({ chainId: _chainId })),
	chainIdMsg: '',
	setChainIdMsg: (_chainIdMsg) => set(state => ({ chainIdMsg: _chainIdMsg })),

	wallet: '',
	setWallet: (_wallet) => set(state => ({ wallet: _wallet })),
	walletMsg: '',
	setWalletMsg: (_walletMsg) => set(state => ({ walletMsg: _walletMsg }))
}))

export default useStore