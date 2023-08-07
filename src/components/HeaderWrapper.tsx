import { useState, useEffect } from "react";
import logout from "../utils/logout";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import fetch from "../services/fetchAPI";
import { useDispatch } from "react-redux";
import getProducts from "../utils/getProducts";
import { useAppSelector } from "../context/store";
import { setToken } from "../context/slices/auth";
import FetchResponse from "../objects/FetchResponse";
import defaultUserImage from "../../public/images/user.jpeg"
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
  const [profilePictureUrl, setProfilePictureUrl] = useState(defaultUserImage.src);

  const branch = branches[branchIndex];

  useEffect(() => {
    getProfilePictureUrl(business.id).then((url) => setProfilePictureUrl(url));
  }, []);

  useEffect(() => {
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
      branchOptions: branches.map((branch, index) => {
        return {
          name: `${branch.name!} | ${branch.location}`,
          func: async () => {
            dispatch(setCurrentBranch(index));
            await getProducts(
              branch.id,
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
    return await fetch(
      auth.token!,
      auth.refresh!,
      router,
      dispatch,
      (token: string) => dispatch(setToken(token)),
      service
    );
  };

  if (profilePictureUrl) {
    return <Component header={header} fetchAPI={fetchAPI} {...pageProps} />;
  } else {
    return <>Loading...</>;
  }
}
