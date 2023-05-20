import React, { useEffect, useState } from "react";
import { Session  } from 'next-auth';
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useSession, signOut } from 'next-auth/react';
import { useAppSelector } from "../src/context/store";
import { loginUser } from "../src/context/slices/auth";
import googleLoginUserService from '../src/services/googleAuth/googleLoginUserService';
import googleSignUpUserService from '../src/services/googleAuth/googleSignUpUserService';

interface CustomSession extends Session {
  idToken?: string;
}

export default function GoogleAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const auth = useAppSelector((state) => state.auth);
  const idToken = (session as CustomSession)?.idToken;

  async function handleAuthentication() {
    // Logged user redirect
    if (!!auth.logged) {
      if (!!auth.registrationCompleted) {
        //router.replace("/profile");
      }
      else {
        //router.replace("/signup/register");
      }
    }

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
      if (!!loginResponse.isError || loginResponse.exception?.code !== 9){
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
    }
  }

  useEffect(() => {
    handleAuthentication()
  }, [session, auth]);

  return <>{children}</>;
}