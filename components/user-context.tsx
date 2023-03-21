import { createContext, useContext } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { useWalletLogin, useWalletLogout } from "@lens-protocol/react-web";

const UserContext = createContext({
  signIn: () => {},
  signOut: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: React.PropsWithChildren) => {
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
    }
  };

  const signOut = async () => {
    await logout();
  };

  return <UserContext.Provider value={{ signIn, signOut }}>{children}</UserContext.Provider>;
};
