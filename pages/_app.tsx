import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import "../styles/globals.css"
import store, { persistor } from "../src/context/store";
import { PersistGate } from "redux-persist/integration/react";
import { SessionProvider } from "next-auth/react"
import GoogleAuth from "./google-auth";

export default function App({
  Component,
  pageProps: { session, ... pageProps }
}: AppProps) {

  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <GoogleAuth>
          <PersistGate loading={null} persistor={persistor}>
              <Component {...pageProps} />
          </PersistGate>
        </GoogleAuth>
      </Provider>
    </SessionProvider>
  );
}
