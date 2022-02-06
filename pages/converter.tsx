import Head from 'next/head'
import { utils } from 'ethers'
import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Paper1 from '../components/common/Paper1'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
const { formatUnits, parseUnits } = utils

export default function Converter() {
	const [amt1, setAmt1] = useState('')
	const [dec1, setDec1] = useState('')
	const [amt11, setAmt11] = useState('')
	
	const [amt2, setAmt2] = useState('')
	const [dec2, setDec2] = useState('')
	const [amt21, setAmt21] = useState('')
	
	const convertTo18Dec = () => {
		try {
			const num1 = parseUnits(amt1, parseInt(dec1)).toString()
			setAmt11(num1)
		} catch (err) {
			console.log(err)
			alert('Got Error')
		}
	}
	
	const convertFrom18Dec = () => {
		try {
			const num1 = formatUnits(amt2, parseInt(dec2))
			setAmt21(num1)
		} catch (err) {
			console.log(err)
			alert('Got Error')
		}
	}
	
	return (
		<Box>
					<Head>
				<title>Converter</title>
				< meta name="description" content="Convert to and from 18 decimals" />
				<link rel="icon" href="/favicon.ico" />
			</Head>


			<Paper1>
				<Stack spacing={2}>
				
				<Typography>Add Decimals: </Typography>
				<TextField label="Amount" variant="outlined"
					value={amt1}
					onChange={e => setAmt1(e.target.value)}
					fullWidth
				/>
				<TextField label="Decimals" variant="outlined"
					value={dec1}
					onChange={e => setDec1(e.target.value)}
					fullWidth
				/>
				<Button variant='contained' onClick={convertTo18Dec}>Convert</Button>
				<Typography>Result: {amt11} <ContentCopyIcon onClick={() => {
					navigator.clipboard.writeText(amt11)
					alert(`Copied: ${amt11}`)
				}} sx={{ cursor: 'pointer' }} /></Typography>
				</Stack>
			</Paper1>
			
			<Paper1>
				<Stack spacing={2}>
				
				<Typography>Remove Decimals: </Typography>
				<TextField label="Amount" variant="outlined"
					value={amt2}
					onChange={e => setAmt2(e.target.value)}
					fullWidth
				/>
				<TextField label="Decimals" variant="outlined"
					value={dec2}
					onChange={e => setDec2(e.target.value)}
					fullWidth
				/>
				<Button variant='contained' onClick={convertFrom18Dec}>Convert</Button>
				<Typography>Result: {amt21} <ContentCopyIcon onClick={() => {
					navigator.clipboard.writeText(amt21)
					alert(`Copied: ${amt21}`)
				}} sx={{ cursor: 'pointer' }} /></Typography>
				</Stack>
    </Paper1>


		</Box>
	)
}