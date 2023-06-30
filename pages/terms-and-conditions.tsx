import React from "react";
import { Box, Terms } from "paca-ui";
import { useRouter } from "next/router";
import { useAppSelector } from "context";

export default function TermsAndConditions() {
  const router = useRouter();
  const auth = useAppSelector((state) => state.auth);

  return (
    <Box style={{ width: "100%" }}>
      <Terms
        headerArgs={{
          logged: false,
          onPacaClick: () => {
            !!auth.logged ? router.push("/profile") : router.push("/login");
          },
          onLoginClick: () => router.push("/login"),
          onRegisterClick: () => router.push("/signup"),
          branchOptions: [],
        }}
      />
    </Box>
  );
}
