import Paper from '@mui/material/Paper'

export default function Paper1({
  children,
  styles
}: {
  children: any
  styles?: any
}) {
  return (
    <Paper
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        padding: '10px',
        margin: '10px',
        height: 'fit-content',
        ...styles
      }}
      elevation={4}
    >
      {children}
    </Paper>
  )
}
