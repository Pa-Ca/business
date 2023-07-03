import React from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { useDispatch } from "react-redux";
import { signUpBusinessService } from "services";
import { loginBusiness, useAppSelector, loginUser } from "context";
import { Box, SignUp as SignUpComponent, useInputForm } from "paca-ui";
import {
  validatePassword,
  validateName,
  validateEmail,
  carouselImages,
} from "utils";

export default function Signup() {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useAppSelector((state) => state.auth);

  const name = useInputForm("");
  const email = useInputForm("");
  const password = useInputForm("");

  const validateData = () => {
    let valid = true;

    // Name validations
    const nameValidation = validateName(name.value);
    if (nameValidation.code !== 0) {
      valid = false;
      name.setError(1);
      switch (nameValidation.code) {
        case 1:
          name.setErrorMessage("Debe tener al menos 8 caracteres.");
          break;
        default:
          name.setErrorMessage("Nombre inválido.");
      }
    }

    // Email validation
    const emailValidation = validateEmail(email.value);
    if (emailValidation.code !== 0) {
      valid = false;
      email.setError(1);
      switch (emailValidation.code) {
        case 1:
          email.setErrorMessage("Correo inválido.");
          break;
        default:
          email.setErrorMessage("Correo inválido.");
      }
    }

    // Password validations
    const passwordValidation = validatePassword(password.value);
    if (passwordValidation !== 0) {
      valid = false;
      password.setError(1);
      switch (passwordValidation) {
        case 1:
          password.setErrorMessage("Debe tener entre 8 y 64 caracteres.");
          break;
        default:
          password.setErrorMessage("Contraseña inválida.");
      }
    }

    return valid;
  };

  const signup = async () => {
    const response = await signUpBusinessService(
      name.value,
      email.value,
      password.value
    );

    if (response.isError) {
      if (!!response.error) {
        // Error de ejecucion
      } else {
        switch (response.exception!.code) {
          case 1:
            email.setError(1);
            email.setErrorMessage("Correo ya registrado.");
            break;
          default:
            email.setError(1);
            email.setErrorMessage("Correo inválido.");
            break;
        }
      }
      return;
    }

    dispatch(
      loginUser({
        logged: true,
        userId: response.data!.userId,
        id: response.data!.id,
        registrationCompleted: auth.registrationCompleted,
        email: response.data!.email,
        token: response.data!.token,
        refresh: response.data!.refresh,
      })
    );

    dispatch(
      loginBusiness({
        id: response.data!.id,
        name: response.data!.name,
        verified: false,
        tier: "basic",
        phoneNumber: "", // [TODO]
      })
    );

    router.push("/profile");
  };

  return (
    <Box>
      <SignUpComponent
        interval={3000}
        email={email}
        businessName={name}
        password={password}
        images={carouselImages}
        validateBusinessData={validateData}
        onLogin={() => router.push("/login")}
        onTermsAndConditionsClick={() => router.push("/terms-and-conditions")}
        onBusinessSignUp={signup}
        onGoogleSignUp={() => signIn("google")}
        business={true}
      />
    </Box>
  );
}
