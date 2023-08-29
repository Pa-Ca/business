import { useState, useEffect } from "react";
import logout from "../utils/logout";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import fetch from "../services/fetchAPI";
import { useDispatch } from "react-redux";
import getProducts from "../utils/getProducts";
import { setSpinner } from "context/slices/app";
import { useAppSelector } from "../context/store";
import { setToken } from "../context/slices/auth";
import FetchResponse from "../objects/FetchResponse";
import defaultUserImage from "../../public/images/user.jpeg";
import { setCurrentBranch } from "../context/slices/branches";
import getProfilePictureUrl from "../utils/getProfilePictureUrl";

interface HeaderWrapperProps {
  /**
   * Component to be rendered
   */
  Component: React.ComponentType<any>;
  /**
   * Props to be passed to the component
   */
  pageProps: AppProps;
}

export default function HeaderWrapper({
  Component,
  pageProps,
}: HeaderWrapperProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [header, setHeader] = useState<any>({});
  const auth = useAppSelector((state) => state.auth);
  const business = useAppSelector((state) => state.business);
  const branches = useAppSelector((state) => state.branches).branches;
  const branchIndex = useAppSelector((state) => state.branches).current;
  const [profilePictureUrl, setProfilePictureUrl] = useState(
    defaultUserImage.src
  );
  const branchInfo = branches[branchIndex];

  useEffect(() => {
    if (!business.id) return;

    getProfilePictureUrl(business.id).then((url) => setProfilePictureUrl(url));
  }, []);

  useEffect(() => {
    if (!auth.token) {
      setHeader({
        logged: false,
        onLoginClick: () => router.push("/login"),
        onRegisterClick: () => router.push("/signup"),
      });

      return;
    }

    const branch = branchInfo?.branch;

    setHeader({
      picture: profilePictureUrl,
      name: business.name!,
      onLogout: () =>
        logout(
          auth.token!,
          auth.refresh!,
          dispatch,
          router,
          undefined,
          undefined,
          () => {}
        ),
      userRole: "business",
      logged: true,
      currentBranch: !!branch ? `${branch.name!} | ${branch.location}` : "",
      branchOptions: branches.map((b, index) => {
        return {
          name: `${b.branch.name!} | ${b.branch.location}`,
          func: async () => {
            dispatch(setCurrentBranch(index));
            await getProducts(
              b.branch.id,
              auth.token!,
              auth.refresh!,
              router,
              dispatch,
              (token: string) => dispatch(setToken(token))
            );
            router.reload();
          },
        };
      }),
      onEditProfile: () => router.push("/profile"),
      onReserveClick: () => {},
      onReservationsClick: () => router.push("/branch-reservations"),
      onFavoritesClick: () => {},
      onLeftSectionClick: () => {},
      onPacaClick: () => router.reload(),
      onLoginClick: () => router.push("/login"),
      onRegisterClick: () => router.push("/signup"),
      onProfileClick: () => {},
      onProductsClick: () => router.push("/products"),
      onSalesClick: () => router.push("/sales"),
    });
  }, [business, branchIndex]);

  const fetchAPI = async function <T>(
    service: (token: string) => Promise<FetchResponse<T>>
  ): Promise<FetchResponse<T | string>> {
    dispatch(setSpinner(true));
    const response = await fetch(
      auth.token!,
      auth.refresh!,
      router,
      dispatch,
      (token: string) => dispatch(setToken(token)),
      service
    );
    dispatch(setSpinner(false));

    return response;
  };

  return <Component header={header} fetchAPI={fetchAPI} {...pageProps} />;
}
