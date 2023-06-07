import "../styles/globals.css";
import Head from "next/head";
import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import AuthWrapper from "../src/components/AuthWrapper";
import store, { persistor } from "../src/context/store";
import HeaderWrapper from "../src/components/HeaderWrapper";
import { PersistGate } from "redux-persist/integration/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <AuthWrapper>
          <PersistGate loading={null} persistor={persistor}>
            <Head>
              <link rel="icon" href="/images/favicon.ico" />
            </Head>
            <HeaderWrapper Component={Component} pageProps={pageProps} />
          </PersistGate>
        </AuthWrapper>
      </Provider>
    </SessionProvider>
  );
}
