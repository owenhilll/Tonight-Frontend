import React, { useContext, useEffect, useState, createContext } from "react";
import * as WebBrowser from "expo-web-browser";
import { auth } from "../firebase";

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext({});

const config = {
  iosClientId:
    "453837494402-hdph8gj1hn1jm56ugk0b403pl89g8pjj.apps.googleusercontent.com",
  androidClientId:
    "453837494402-pnprn521g1jk5tkgbsg6n48j9g7epni4.apps.googleusercontent.com",
  expoClientId:
    "843737074628-da6c5imppl5d5879glgv4k1d2asqvaks.apps.googleusercontent.com",
  webClientId:
    "843737074628-da6c5imppl5d5879glgv4k1d2asqvaks.apps.googleusercontent.com",
  scopes: ["profile", "email"],
  permissions: ["public_profile", "email", "gender", "location"],
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState("");

  useEffect(() => {
    auth.onAuthStateChanged(setUser);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
