import "../styles/globals.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import { WagmiConfig } from "wagmi";
import { ConnectKitProvider } from "connectkit";
import wagmiConfig from "../lib/wagmi";
import { LensProvider } from "@lens-protocol/react-web";
import lensConfig from "../lib/lens";
import Layout from "../components/layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <WagmiConfig client={wagmiConfig}>
        <ConnectKitProvider theme="auto" mode="light">
          <LensProvider config={lensConfig}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </LensProvider>
        </ConnectKitProvider>
      </WagmiConfig>
    </>
  );
}
