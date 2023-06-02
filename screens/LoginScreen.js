import { View, Text, Button } from "react-native";
import React, { useState } from "react";
import {
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
} from "@firebase/auth";
import { TextInput } from "react-native";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const navigator = useNavigation();

  function logInAnonymously() {
    signInWithEmailAndPassword(auth, email, password);
  }
  function createAccount() {
    createUserWithEmailAndPassword(auth, email, password);
  }

  function loginWithGoogle() {
    var provider = new GoogleAuthProvider();
  }

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  return (
    <View className="flex-1 items-center">
      <View className="mt-2 justify-between bg-stone-200">
        <TextInput
          nativeID="emailField"
          className="text-xl border-black rounded-lg"
          onTextInput={setEmail}
          placeholder="Email"
        />
        <TextInput
          nativeID="passwordField"
          className="text-xl border-2 border-black"
          onTextInput={setPassword}
          placeholder="Password"
        />
      </View>
      <View className="space-y-3 justify-between items-center">
        <Button className="mt-3" title="login" onPress={logInAnonymously} />
        <Button className="mt-3" onPress={createAccount} title="Register" />
      </View>
    </View>
  );
}
