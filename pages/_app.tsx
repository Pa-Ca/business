import "../styles/globals.css";
import Head from "next/head";
import { Provider } from "react-redux";
import GoogleAuth from "./google-auth";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import store, { persistor } from "../src/context/store";
import { PersistGate } from "redux-persist/integration/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <GoogleAuth>
          <PersistGate loading={null} persistor={persistor}>
            <Head>
              <link rel="icon" href="/images/favicon.ico" />
            </Head>
            <Component {...pageProps} />
          </PersistGate>
        </GoogleAuth>
      </Provider>
    </SessionProvider>
  );
}
