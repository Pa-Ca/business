import Image from 'next/image';

import { Box, Text } from 'paca-ui';

import logo from '../public/images/pa-ca-icon.png';

export default function Home() {
  
  console.log(process.env.NEXT_PUBLIC_API_ENDPOINT)
  console.log(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)

  return (
    <Box>
      {/* <div id='progress-bar'> <div></div></div> */}
      <Image id='img' src={logo} alt="Pa'Ca"></Image>
      <Text type='h1' weight='700'>BUSINESS COMING SOON</Text>
    </Box>
  )
}