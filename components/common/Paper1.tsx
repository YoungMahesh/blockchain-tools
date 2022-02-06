import Paper from '@mui/material/Paper'

interface PropsList {
  children: any
}

export default function Paper1({ children }: PropsList) {
  return (
    <Paper
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        padding: '10px',
        margin: '10px',
        height: 'fit-content'
      }}
      elevation={4}
    >
      {children}
    </Paper>
  )
}
