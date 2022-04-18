import { utils } from 'ethers'
import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Paper1 from '../common/Paper1'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

const { formatUnits, parseUnits } = utils

export default function Decimals() {
  const [amt1, setAmt1] = useState('')
  const [dec1, setDec1] = useState('')
  const [amt11, setAmt11] = useState('')

  const convertTo18Dec = (_isAdd: boolean) => {
    try {
      const num1 = _isAdd
        ? parseUnits(amt1, parseInt(dec1)).toString()
        : formatUnits(amt1, parseInt(dec1))
      setAmt11(num1)
    } catch (err) {
      console.log(err)
      alert('Got Error')
    }
  }

  return (
    <Paper1
      styles={{
        display: 'flex',
        flexWrap: 'wrap'
      }}
    >
      <Stack spacing={2}>
        <Typography>Add/Remove Decimals: </Typography>
        <TextField
          label="Amount"
          variant="outlined"
          value={amt1}
          onChange={(e) => setAmt1(e.target.value)}
          fullWidth
        />
        <TextField
          label="Decimals"
          variant="outlined"
          value={dec1}
          onChange={(e) => setDec1(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={() => convertTo18Dec(true)}>
          Add Decimals
        </Button>
        <Button variant="contained" onClick={() => convertTo18Dec(false)}>
          Remove Decimals
        </Button>
        <Typography sx={{ maxWidth: '300px', overflow: 'scroll' }}>
          Result: {amt11}{' '}
          <ContentCopyIcon
            onClick={() => {
              navigator.clipboard.writeText(amt11)
              alert(`Copied: ${amt11}`)
            }}
            sx={{ cursor: 'pointer' }}
          />
        </Typography>
      </Stack>
    </Paper1>
  )
}
