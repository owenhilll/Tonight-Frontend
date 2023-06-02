import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./Navigator";
import React from "react";
import { AuthProvider } from "./Hooks/authProvider";

import "./assets/styles.css";

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Navigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
