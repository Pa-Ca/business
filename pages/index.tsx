import { useEffect, useState } from "react";
import Image from "next/image";
import { Box, Text } from "paca-ui";
import { useRouter } from "next/router";
import logo from "../public/images/pa-ca-icon.png";
import { useAppSelector } from "../src/context/store";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const auth = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!!auth.logged) {
      router.push("/branch-reservations");
    } else {
      router.push("/login");
    }
    setLoading(false);
  }, [auth.logged]);

  return (
    <Box>
      {loading && (
        <>
          <Image id="img" src={logo} alt="Pa'Ca"></Image>
          <Text type="h1" weight="700">
            BUSINESS COMING SOON
          </Text>
        </>
      )}
    </Box>
  );
}
