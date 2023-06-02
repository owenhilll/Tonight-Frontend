import React from "react";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import useAuth from "./Hooks/authProvider";

const stack = createNativeStackNavigator();

export default function Navigator() {
  const { user } = useAuth();
  console.log(user);
  return (
    <stack.Navigator>
      {user ? (
        <>
          <stack.Screen name="home" component={HomeScreen} />
        </>
      ) : (
        <stack.Screen name="login" component={LoginScreen} />
      )}
    </stack.Navigator>
  );
}
