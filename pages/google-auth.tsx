import { useEffect } from 'react';
import { Session,  } from 'next-auth';
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useSession } from 'next-auth/react';
import { useAppSelector } from "../src/context/store";
import { loginUser } from "../src/context/slices/auth";
import googleLoginUserService from '../src/services/googleLoginUserService';
import googleSignUpUserService from '../src/services/googleSignUpUserService';

interface CustomSession extends Session {
  idToken?: string;
}

export default function GoogleAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const auth = useAppSelector((state) => state.auth);
  const idToken = (session as CustomSession)?.idToken;

  useEffect(() => {
    async function handleAuthentication() {
        // There is a Google Session but user is not logged in
        if (session && !auth.logged) {

          if (idToken) {
            // Try Login
            const loginResponse = await googleLoginUserService(idToken);

            if (!loginResponse.isError) {
              dispatch(
                loginUser({
                  logged: true,
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
            if (!!loginResponse.isError && loginResponse.exception!.code !== 9){
              console.log("Can't Login");
              router.replace("/500");
            }

            // Try SignUp
            const signupResponse = await googleSignUpUserService(idToken);

            if (!!signupResponse.isError) {
              console.log("Can't SignUp");
              router.replace("/500");
            }

            dispatch(
              loginUser({
                logged: true,
                userId: 1000,
                id: signupResponse.data!.id,
                email: "",
                token: signupResponse.data!.token,
                refresh: signupResponse.data!.refresh,
              })
            );

          }
        }
    }
    handleAuthentication();
  }, [session]);

  return <>{children}</>;
}