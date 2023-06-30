import React, { useState } from "react";
import { carouselImages } from "utils";
import { useRouter } from "next/router";
import { resetPasswordWithTokenService } from "services";
import {
  Box,
  ResetPassword as ResetPasswordComponent,
  useInputForm,
} from "paca-ui";

export default function Signup() {
  const router = useRouter();
  const { token } = router.query;
  const password = useInputForm("");
  const [error, setError] = useState(false);
  const [completed, setCompleted] = useState(!!router.query.completed);

  const resetPassword = async (password: string) => {
    setError(false);

    if (typeof token !== "string") {
      setError(true);
      return;
    }

    const response = await resetPasswordWithTokenService(password, token);

    if (!!response.isError) {
      setError(true);
      return;
    }

    setCompleted(true);
  };

  return (
    <Box>
      <ResetPasswordComponent
        error={error}
        password={password}
        completed={completed}
        images={carouselImages}
        onBackToLogin={() => router.push("/login")}
        onSubmit={() => resetPassword(password.value)}
      />
    </Box>
  );
}
