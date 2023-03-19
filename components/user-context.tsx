import { createContext, useContext, useState } from "react";

const UserContext = createContext({
  authToken: "",
  profile: {},
  signIn: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: React.PropsWithChildren) => {
  const [authToken, setAuthToken] = useState("");
  const [profile, setProfile] = useState({});

  const signIn = async(tokens, profile) => {
    window.sessionStorage.setItem("lens-auth-token", tokens.accessToken);
    setAuthToken(tokens.accessToken);
    setProfile(profile);
  };

  return <UserContext.Provider value={{ authToken, profile, signIn }}>{children}</UserContext.Provider>;
};
