import React from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { useDispatch } from "react-redux";
import { ProductCategoryDTO } from "objects";
import { Box, SignUp as SignUpComponent, useInputForm } from "paca-ui";
import {
  fetchAPI,
  alertService,
  signUpBusinessService,
  getProductCategoriesService,
} from "services";
import {
  setToken,
  loginUser,
  loginBusiness,
  useAppSelector,
  setProductCategories,
} from "context";
import {
  validateName,
  validateEmail,
  carouselImages,
  validatePassword,
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
      name.setCode(4);
      switch (nameValidation.code) {
        case 1:
          name.setMessage("Debe tener al menos 8 caracteres.");
          break;
        default:
          name.setMessage("Nombre inválido.");
      }
    }

    // Email validation
    const emailValidation = validateEmail(email.value);
    if (emailValidation.code !== 0) {
      valid = false;
      email.setCode(4);
      switch (emailValidation.code) {
        case 1:
          email.setMessage("Correo inválido.");
          break;
        default:
          email.setMessage("Correo inválido.");
      }
    }

    // Password validations
    const passwordValidation = validatePassword(password.value);
    if (passwordValidation !== 0) {
      valid = false;
      password.setCode(4);
      switch (passwordValidation) {
        case 1:
          password.setMessage("Debe tener entre 8 y 64 caracteres.");
          break;
        default:
          password.setMessage("Contraseña inválida.");
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
            email.setCode(4);
            email.setMessage("Correo ya registrado.");
            break;
          default:
            email.setCode(4);
            email.setMessage("Correo inválido.");
            break;
        }
      }
      return;
    }

    // Get product categories
    const categoriesResponse = await fetchAPI(
      response.data!.token,
      response.data!.refresh,
      router,
      dispatch,
      setToken,
      (token: string) => getProductCategoriesService(token)
    );

    if (
      !!categoriesResponse.isError ||
      typeof categoriesResponse.data === "string"
    ) {
      const message = !!categoriesResponse.exception
        ? categoriesResponse.exception.message
        : categoriesResponse.error?.message;
      alertService.error(
        `Error cargando los datos de los productos: ${message}`
      );
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

    dispatch(
      setProductCategories(
        categoriesResponse.data!.productCategories.reduce((acc, obj) => {
          acc[obj.id] = obj;
          return acc;
        }, {} as Record<number, ProductCategoryDTO>)
      )
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
