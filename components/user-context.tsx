import { createContext, useContext, useState } from "react";
import { useWalletLogin, useWalletLogout } from "@lens-protocol/react-web";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { gql } from "@apollo/client";
import { getClient, refreshJWT } from "../lib/api";
import { InjectedConnector } from "wagmi/connectors/injected";

const UserContext = createContext({
  accessToken: "",
  signIn: () => {},
  signOut: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: React.PropsWithChildren) => {
  const [accessToken, setAccessToken] = useState("");
  const { execute: login } = useWalletLogin();
  const { execute: logout } = useWalletLogout();
  const { isConnected } = useAccount();
  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnectAsync } = useDisconnect();

  const signIn = async () => {
    if (isConnected) {
      await disconnectAsync();
    }

    const { connector } = await connectAsync();

    if (connector instanceof InjectedConnector) {
      const signer = await connector.getSigner();
      await login(signer);
      const sessionCredentials = window.localStorage.getItem("lens.credentials");
      if (sessionCredentials) {
        const credentials = JSON.parse(sessionCredentials);

        const apolloClient = getClient();
        const result = await apolloClient.mutate({
          mutation: gql(refreshJWT),
          variables: {
            request: {
              refreshToken: credentials.data.refreshToken,
            },
          },
        });
        const accessToken = result.data.refresh.accessToken;
        window.sessionStorage.setItem("lens.accessToken", accessToken);
        setAccessToken(accessToken);
      }
    }
  };

  const signOut = async () => {
    await logout();
    window.sessionStorage.removeItem("lens.accessToken");
    setAccessToken("");
  };

  return <UserContext.Provider value={{ signIn, signOut, accessToken }}>{children}</UserContext.Provider>;
};
