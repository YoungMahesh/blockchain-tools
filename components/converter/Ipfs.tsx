import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { useState } from 'react'
import Paper1 from '../common/Paper1'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

export default function Ipfs() {
  const [cid, setCid] = useState('')
  const [url, setUrl] = useState('')

  const convertToUrl = () => {
    setUrl(`https://ipfs.io/ipfs/${cid}`)
  }

  return (
    <Paper1>
      <Stack spacing={2} sx={{ maxWidth: '350px' }}>
        <Typography>Convert IPFS-CID to URL</Typography>
        <TextField value={cid} onChange={(e) => setCid(e.target.value)} />
        <Button variant="contained" onClick={convertToUrl}>
          Convert
        </Button>
        <Typography sx={{ wordBreak: 'break-all' }}>
          {' '}
          URL: {url}{' '}
          <ContentCopyIcon
            onClick={() => {
              navigator.clipboard.writeText(url)
              alert(`Copied: ${url}`)
            }}
            sx={{ cursor: 'pointer' }}
          />
        </Typography>
      </Stack>
    </Paper1>
  )
}
