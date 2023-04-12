import Image from 'next/image';

import { Box, Text } from 'paca-ui';

import logo from '../public/pa-ca-icon.png';

export default function Home() {
  return (
    <Box>
      {/* <div id='progress-bar'> <div></div></div> */}
      <Image id='img' src={logo} alt="Pa'Ca"></Image>
      <Text type='h1' weight='700'>BUSINESS COMING SOON</Text>
    </Box>
  )
}