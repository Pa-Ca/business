import "../styles/globals.css";
import Head from "next/head";
import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import store, { persistor } from "../src/context/store";
import { PersistGate } from "redux-persist/integration/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Head>
          <link rel="icon" href="/images/favicon.ico" />
        </Head>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}
