import { useRouter } from "next/router";
import logout from "../utils/logout";
import { MAIN_COLOR } from "../config";
import type { AppProps } from "next/app";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../context/store";
import { setCurrentBranch } from "../context/slices/branches";

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

  const branch = branches[branchIndex];

  const header = {
    // [TODO] Fix header picture
    picture: "https://wallpapers.com/images/featured/4co57dtwk64fb7lv.jpg",
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
    onEditProfile: () => router.push("/profile"),
    onRightSectionClick: () => router.push("/branch-reservations"),
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
    // [TODO] Fix onClicks
    onLeftSectionClick: () => {},
    onPacaClick: () => router.reload(),
    onProfileClick: () => {},
    color: MAIN_COLOR,
  };

  return <Component header={header} {...pageProps} />;
}