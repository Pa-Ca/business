import React, { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { useDispatch } from "react-redux";
import { getProducts, carouselImages } from "utils";
import { Box, Login as LoginComponent } from "paca-ui";
import {
  setToken,
  loginUser,
  setBranches,
  loginBusiness,
  useAppSelector,
  setCurrentBranch,
  setProductCategories,
} from "context";
import {
  fetchAPI,
  alertService,
  getBranchesService,
  loginBusinessService,
  getProductCategoriesService,
} from "services";
import { ProductCategoryDTO } from "objects";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const auth = useAppSelector((state) => state.auth);

  const login = async (email: string, password: string) => {
    setError(false);
    const response = await loginBusinessService(email, password);

    if (!!response.isError) {
      if (!!response.error || response.exception?.code !== 9) {
        const message = !!response.exception
          ? response.exception.message
          : response.error?.message;
        alertService.error(`Error cerrando la reserva: ${message}`);
      } else {
        setError(true);
      }
      return;
    }

    // Get business branches
    const branchesResponse = await fetchAPI(
      response.data!.token,
      response.data!.refresh,
      router,
      dispatch,
      (token: string) => dispatch(setToken(token)),
      (token: string) => getBranchesService(response.data!.id, token)
    );

    if (
      !!branchesResponse.isError ||
      typeof branchesResponse.data === "string"
    ) {
      const message = !!branchesResponse.exception
        ? branchesResponse.exception.message
        : branchesResponse.error?.message;
      alertService.error(
        `Error cargando los datos de las sucursales: ${message}`
      );
      setError(true);
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
      setError(true);
      return;
    }

    // Change hourIn and hourOut from 23:59:59 to 24:00:00
    branchesResponse.data!.branches.forEach((branch) => {
      if (branch.hourIn === "23:59:59") {
        branch.hourIn = "24:00:00";
      }
      if (branch.hourOut === "23:59:59") {
        branch.hourOut = "24:00:00";
      }
    });

    const branchList = branchesResponse.data!.branches.filter(
      (branch) => !branch.deleted
    );
    // Sort branches by name
    branchList.sort((a, b) => a.name.localeCompare(b.name));
    const branchIndex = branchList.length > 0 ? 0 : -1;

    dispatch(
      loginUser({
        logged: true,
        userId: response.data!.userId,
        registrationCompleted: auth.registrationCompleted,
        id: response.data!.id,
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
        phoneNumber: response.data!.phoneNumber,
      })
    );

    dispatch(setBranches(branchList));
    dispatch(setCurrentBranch(branchIndex));
    dispatch(
      setProductCategories(
        categoriesResponse.data!.productCategories.reduce((acc, obj) => {
          acc[obj.id] = obj;
          return acc;
        }, {} as Record<number, ProductCategoryDTO>)
      )
    );

    if (branchIndex !== -1) {
      const branch = branchList[branchIndex];
      await getProducts(
        branch.id,
        response.data!.token,
        response.data!.refresh,
        router,
        dispatch,
        (token: string) => dispatch(setToken(token))
      );
    }

    router.push("/branch-reservations");
  };

  return (
    <Box>
      <LoginComponent
        error={error}
        onLogin={login}
        images={carouselImages}
        onForgotClick={() => router.push("/recover-password")}
        onGoogleSignUp={() => signIn("google")}
        onSignUp={() => router.replace("/signup")}
      />
    </Box>
  );
}
