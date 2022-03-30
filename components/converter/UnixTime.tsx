import { currTimeInSec } from '../../backend/api/utils'
import { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import MobileDateTimePicker from '@mui/lab/MobileDateTimePicker'
import Paper1 from '../common/Paper1'
import { Button, Stack } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

export default function UnixTime() {
  const [date0, setDate0] = useState<Date>(new Date())
  const [selectedSec, setSelectedSec] = useState<number>(0)

  const [givenSec, setGivenSec] = useState<string>(currTimeInSec().toString())
  const [date1, setDate1] = useState<Date>(new Date())

  useEffect(() => {
    setSelectedSec(Math.floor(date0.getTime() / 1000))
  }, [date0])

  const givenSecToDate = () => {
    try {
      const _date = new Date()
      _date.setTime(parseInt(givenSec) * 1000)
      setDate1(_date)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Box sx={{ marginTop: '40px' }}>
      <Paper1>
        <Typography>Current Unix_Time: {currTimeInSec()}</Typography>
      </Paper1>

      <Paper1>
        <Stack spacing={2}>
          <Typography variant="h6">Date to Unix_Time </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography>Select Date: </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileDateTimePicker
                value={date0}
                onChange={(_date) => {
                  console.log(_date)
                  setDate0(_date)
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Box>

          <Typography>Selected Time: {date0.toString()}</Typography>
          <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <Typography>
              Selected Time In Unix Seconds: {selectedSec}
            </Typography>
            <ContentCopyIcon
              onClick={() => {
                navigator.clipboard.writeText(selectedSec.toString())
                alert(`Copied: ${selectedSec}`)
              }}
              sx={{ cursor: 'pointer' }}
            />
          </Box>
        </Stack>
      </Paper1>

      <Paper1>
        <Stack spacing={2}>
          <Typography variant="h6">Unix_Time to Date</Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography>Unix Seconds: </Typography>
            <TextField
              value={givenSec}
              onChange={(e) => setGivenSec(e.target.value)}
            />
          </Box>
          <Button variant="contained" onClick={givenSecToDate}>
            Convert
          </Button>
          <Typography>Date: {date1.toString()}</Typography>
        </Stack>
      </Paper1>
    </Box>
  )
}
