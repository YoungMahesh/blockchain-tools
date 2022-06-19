import Head from 'next/head'
import type { ReactElement } from 'react'
import Link from 'next/link'
import { useTheme } from '@mui/material/styles'
import Layout from '../components/common/Layout'
import { Container, Typography } from '@mui/material'
import Footer from '../components/common/Footer'
import Paper1 from '../components/common/Paper1'
import Box from '@mui/material/Box'

export default function Home() {
  const theme = useTheme()

  return (
    <div>
      <Head>
        <title>Home </title>
        <meta
          name="description"
          content="BlockChain Tools: Multisender, Locker"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <Typography variant="h3" sx={{ marginBottom: '30px' }}>
          BlockChain Tools
        </Typography>
        <Typography>
          Blockchain (specially EVM-based) related tools for D-app users and
          developers
        </Typography>
        <Box
          sx={{
            margin: '20px 0',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}
        >
          <Typography>Current Tools: </Typography>
          <Paper1 styles={{ width: 'fit-content' }}>
            <Link href="/multisender">
              <a>Multisender</a>
            </Link>
          </Paper1>
          <Paper1 styles={{ width: 'fit-content' }}>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://converter.blockchaintools.app/"
            >
              Converter
            </a>
          </Paper1>
          <Paper1 styles={{ width: 'fit-content' }}>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://locker.blockchaintools.app/"
            >
              Locker
            </a>
          </Paper1>
          <Paper1 styles={{ width: 'fit-content' }}>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://erc20.blockchaintools.app/"
            >
              ERC20 Generator
            </a>
          </Paper1>
        </Box>
        <Footer />
      </Container>
    </div>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
