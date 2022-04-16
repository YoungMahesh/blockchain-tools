import Typography from '@mui/material/Typography'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import { chainIdsTable, toHex } from '../../backend/api/utils'
import useStore from '../../backend/zustand/store'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
export default function Header({
  title,
  harmony,
  fantom,
  fantomTestnet,
  polygon,
  songbird
}: {
  title: string
  harmony?: boolean
  fantom?: boolean
  fantomTestnet?: boolean
  polygon?: boolean
  songbird?: boolean
}) {
  const chainId = useStore((s) => s.chainId)
  const setChainId = useStore((s) => s.setChainId)

  const changeChain = async (_chainId: number) => {
    try {
      const result1 = await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: toHex(_chainId) }]
      })

      setChainId(_chainId)
      window.ethereum.on('chainChanged', window.location.reload())
    } catch (err) {
      console.log(err)
      toast.error(`Network is not present in your metamask`)
    }
  }

  return (
    <>
      <Typography variant="h5">{title}</Typography>
      <FormControl sx={{ margin: '20px 0' }}>
        <FormLabel id="demo-row-radio-buttons-group-label">Network</FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          value={chainId}
          onChange={(e) => changeChain(parseInt(e.target.value))}
        >
          {harmony && (
            <FormControlLabel
              value={chainIdsTable.HARMONY}
              control={<Radio />}
              label="Harmony"
            />
          )}
          {fantom && (
            <FormControlLabel
              value={chainIdsTable.FANTOM}
              control={<Radio />}
              label="Fantom"
            />
          )}
          {polygon && (
            <FormControlLabel
              value={chainIdsTable.POLYGON}
              control={<Radio />}
              label="Polygon"
            />
          )}
          {songbird && (
            <FormControlLabel
              value={chainIdsTable.SONGBIRD}
              control={<Radio />}
              label="Songbird"
            />
          )}
          {fantomTestnet && (
            <FormControlLabel
              value={chainIdsTable.FANTOM_TESTNET}
              control={<Radio />}
              label="Fantom Testnet"
            />
          )}
        </RadioGroup>
      </FormControl>
    </>
  )
}
