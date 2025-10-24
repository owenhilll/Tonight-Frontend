import { View, Text, Button, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

import { TextInput } from 'react-native';

import useAuth from '../Hooks/authContext';
import { Link, useRouter } from 'expo-router';
import { request } from 'utils/axios';

export default function LoginScreen() {
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

  const [err, setErr] = useState(null);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  return (
    <View className="flex-1 items-center justify-center bg-black">
      <View>
        <Text className="text-center text-xl text-white">Sign Up</Text>
        <TextInput
          nativeID="emailField"
          className="my-10 rounded-full border-2 border-purple-800 p-2 text-xl text-white"
          onChangeText={setEmail}
          placeholder="Email"
        />
        <TextInput
          className="my-10 rounded-full border-2 border-purple-800 p-2 text-xl text-white"
          nativeID="passwordField"
          onChangeText={setPassword}
          placeholder="Password"
        />
        <TouchableOpacity
          className="my-10 rounded-full bg-purple-800 p-2 text-center text-xl"
          onPress={handleClick}>
          <Text className="text-center text-xl text-white">Create Account</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-column items-center space-y-10 border-blue-800">
        <View className="flex-row">
          <Text className="text-white">Already have an account?</Text>
          <Link href={'/SignIn'}>
            <Text className="mx-2 text-blue-200 underline">Sign in</Text>
          </Link>
        </View>
        <View className="flex-row">
          <Text className="text-white">Register your business: </Text>
          <Link href={'/RegisterBusiness'}>
            <Text className="mx-2 text-blue-200 underline">Register Business</Text>
          </Link>
        </View>
      </View>
      <Text>{err}</Text>
    </View>
  );
}
