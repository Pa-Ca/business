import React, { useState } from "react";
import { carouselImages } from "utils";
import { useRouter } from "next/router";
import { useAppSelector } from "context";
import { resetPasswordRequestService } from "services";
import { Box, RecoverPassword as RecoverPasswordComponent } from "paca-ui";

export default function Signup() {
  const router = useRouter();
  const [error, setError] = useState(false);
  const [completed, setCompleted] = useState(false);
  const auth = useAppSelector((state) => state.auth);

  const sentResetPasswordRequest = async (email: string) => {
    setError(false);

    const response = await resetPasswordRequestService(email);

    if (!!response.isError) {
      setError(true);
      return;
    }

    setCompleted(true);
  };

  return (
    <Box>
      <RecoverPasswordComponent
        error={error}
        completed={completed}
        images={carouselImages}
        onBackToLogin={() => router.push("/login")}
        onSubmit={sentResetPasswordRequest}
        onGoogleLogin={() => {}}
      />
    </Box>
  );
}
