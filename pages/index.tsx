import Image from "next/image";
import { Box, Text } from "paca-ui";
import logo from "../public/images/pa-ca-icon.png";

export default function Home() {
  return (
    <Box>
      <Image id="img" src={logo} alt="Pa'Ca"></Image>
      <Text type="h1" weight="700">
        BUSINESS COMING SOON
      </Text>
    </Box>
  );
}
