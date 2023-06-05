import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import logout from "../utils/logout";
import { MAIN_COLOR } from "../config";
import type { AppProps } from "next/app";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../context/store";
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
  const auth = useAppSelector((state) => state.auth);
  const business = useAppSelector((state) => state.business);
  const branches = useAppSelector((state) => state.branches).branches;
  const branchIndex = useAppSelector((state) => state.branches).current;
  const [profilePictureUrl, setProfilePictureUrl] = useState('');

  const branch = branches[branchIndex];

  useEffect(() => {
    getProfilePictureUrl(business.id).then(url => setProfilePictureUrl(url))
  }, [])

  const header = {
    // [TODO] Fix header picture
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
        func: () => {
          dispatch(setCurrentBranch(index));
          router.reload();
        },
      };
    }),
    onEditProfile: () => router.push("/profile"),
    onReserveClick: () => { },
    onReservationsClick: () => router.push("/branch-reservations"),
    onFavoritesClick: () => { },
    onLeftSectionClick: () => {},
    onPacaClick: () => router.reload(),
    onLoginClick: () => router.push("/login"),
    onRegisterClick: () => router.push("/signup"),
    onProfileClick: () => {},
    color: MAIN_COLOR,
  };

  if (profilePictureUrl) {
    return <Component header={header} {...pageProps} />;
  } else {
    return <>Loading...</>
  }

}
