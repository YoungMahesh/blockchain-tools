import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material'

export default function TokenTypeSelector({
  tokenType,
  setTokenType,
  showEth
}) {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Token Type: </FormLabel>
      <RadioGroup
        row
        aria-label="gender"
        name="row-radio-buttons-group"
        value={tokenType}
        onChange={(e) => setTokenType(e.target.value)}
      >
        {showEth && (
          <FormControlLabel value="eth" control={<Radio />} label="ETH" />
        )}
        <FormControlLabel value="erc20" control={<Radio />} label="ERC20" />
        <FormControlLabel value="erc721" control={<Radio />} label="ERC721" />
        <FormControlLabel value="erc1155" control={<Radio />} label="ERC1155" />
      </RadioGroup>
    </FormControl>
  )
}
