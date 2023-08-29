import "../styles/globals.css";
import Head from "next/head";
import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import store, { persistor } from "context";
import { SessionProvider } from "next-auth/react";
import { PersistGate } from "redux-persist/integration/react";
import { HeaderWrapper, AuthWrapper, Alert, Spinner } from "components";

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
              <link
                href="//netdna.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
                rel="stylesheet"
              />
            </Head>
            <HeaderWrapper Component={Component} pageProps={pageProps} />
            <Alert />
            <Spinner />
          </PersistGate>
        </AuthWrapper>
      </Provider>
    </SessionProvider>
  );
}
