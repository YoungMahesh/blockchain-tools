import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material'

export default function TokenTypeSelector({ tokenType, setTokenType }) {
	return (
		<FormControl component="fieldset">
			<FormLabel component="legend">Token Type: </FormLabel>
			<RadioGroup
				row aria-label="gender"
				name="row-radio-buttons-group"
				value={tokenType}
				onChange={e => setTokenType(e.target.value)}
			>
				<FormControlLabel value="erc20" control={<Radio />} label="ERC20" />
				<FormControlLabel value="erc721" control={<Radio />} label="ERC721" />
				<FormControlLabel value="erc1155" control={<Radio />} label="ERC1155" />
			</RadioGroup>
		</FormControl>
	)
}