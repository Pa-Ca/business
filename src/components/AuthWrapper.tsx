import React, { useEffect, useState } from "react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import { useAppSelector } from "../context/store";
import { loginUser } from "../context/slices/auth";
import googleLoginUserService from "../services/googleAuth/googleLoginUserService";
import googleSignUpUserService from "../services/googleAuth/googleSignUpUserService";

interface CustomSession extends Session {
  idToken?: string;
}

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const auth = useAppSelector((state) => state.auth);
  const idToken = (session as CustomSession)?.idToken;

  async function handleAuthentication() {
    // There is a Google Session but user is not logged in
    if (session && !auth.logged) {
      if (!idToken) return;

      // Try Login
      const loginResponse = await googleLoginUserService(idToken);

      if (!loginResponse.isError && loginResponse.data) {
        dispatch(
          loginUser({
            logged: true,
            registrationCompleted: auth.registrationCompleted,
            userId: 1000,
            id: loginResponse.data!.id,
            email: "",
            token: loginResponse.data!.token,
            refresh: loginResponse.data!.refresh,
          })
        );

        return;
      }

      // Google Token Verification failed
      if (!!loginResponse.isError || loginResponse.exception?.code !== 9) {
      }

      // Try SignUp
      const signupResponse = await googleSignUpUserService(idToken);

      if (!!signupResponse.isError) {
        //signOut()
        return;
      }

      if (signupResponse.data) {
        dispatch(
          loginUser({
            logged: true,
            userId: 1000,
            registrationCompleted: auth.registrationCompleted,
            id: signupResponse.data!.id,
            email: "",
            token: signupResponse.data!.token,
            refresh: signupResponse.data!.refresh,
          })
        );
      }
    } else if (auth.logged) {
      // User is logged in, so redirect to branch-reservations in case user is
      // in login or signup page
      switch (router.pathname) {
        case "/":
        case "/login":
        case "/signup":
          router.push("/branch-reservations").then(() => setLoading(false));
          break;
        default:
          setLoading(false);
      }
    } else {
      // User is not logged in, so redirect to login page in case user is in
      // branch-reservations or profile page
      switch (router.pathname) {
        case "/":
        case "/branch-reservations":
        case "/profile":
          router.push("/login").then(() => setLoading(false));
          break;
        default:
          setLoading(false);
      }
    }
  }

  useEffect(() => {
    handleAuthentication();
  }, [session, auth]);

  return <>{!loading && children}</>;
}