import { View, Text, Button, TouchableOpacity, TouchableHighlight } from 'react-native';
import React, { useState } from 'react';

import { TextInput } from 'react-native';

import useAuth from '../Hooks/authContext';
import { Link, useRouter } from 'expo-router';
import { request } from '../utils/axios';

export default function LoginScreen() {
  const { continueAsGuest } = useAuth();

  const router = useRouter();

  const handleClick = async (e: any) => {
    e.preventDefault();
    try {
      request.post('/auth/register', { email, password });
      router.navigate('/SignIn');
    } catch (err: any) {
      setErr(err);
    }
  };

  const guestBrowse = () => {
    continueAsGuest();
  };

  const [err, setErr] = useState(null);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  return (
    <View className="flex-1 items-center justify-center bg-black">
      <View className="w-full px-[10%]">
        <Text className="text-center text-3xl text-white">Sign Up</Text>
        <TextInput
          placeholderTextColor={'gray'}
          nativeID="emailField"
          className="my-10 rounded-full border-2 border-purple-800 p-2 text-xl text-white"
          onChangeText={setEmail}
          placeholder="Email"
        />
        <TextInput
          placeholderTextColor={'gray'}
          className="my-10 rounded-full border-2 border-purple-800 p-2 text-xl text-white"
          nativeID="passwordField"
          onChangeText={setPassword}
          placeholder="Password"
        />
        <View className="items-center">
          <TouchableOpacity
            className="my-10 justify-center rounded-full bg-purple-800 p-2 text-center text-center text-xl"
            onPress={handleClick}>
            <Text className="text-center text-xl text-white">Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-column items-center space-y-2 border-blue-800">
        <View className="my-3 flex-row">
          <Text className="text-xl text-white">Already have an account? </Text>
          <Link href={'/SignIn'}>
            <Text className="mx-2 text-xl text-blue-200 underline">Sign in</Text>
          </Link>
        </View>
        <View className="my-3 flex-row">
          <Text className="text-lg text-white">Register your business: </Text>
          <Link href={'/RegisterBusiness'}>
            <Text className="mx-2 text-lg text-blue-200 underline">Register Business</Text>
          </Link>
        </View>
        <TouchableOpacity className="my-10 rounded-full bg-blue-300 p-2 text-center text-xl">
          <Text onPress={continueAsGuest} className="text-lg ">
            Continue as guest
          </Text>
        </TouchableOpacity>
      </View>
      <Text>{err}</Text>
    </View>
  );
}
