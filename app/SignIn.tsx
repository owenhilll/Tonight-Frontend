import { useState } from 'react';
import { AxiosError, isAxiosError } from 'axios';
import { request } from '../utils/axios';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Link, useRouter } from 'expo-router';
import useAuth from '../Hooks/authContext';

const Register = () => {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [err, setErr] = useState('');

  async function handleLogin(e: any) {
    e.preventDefault();
    try {
      await login(email, password);
      router.navigate('/');
    } catch (e: unknown) {
      if (isAxiosError(e)) {
        setErr(e.response?.data.message);
      }
    }
  }

  return (
    <View className="flex-1 items-center justify-center bg-black">
      <View className="w-full px-[10%]">
        <Text className="text-center text-3xl text-white">Sign In</Text>
        <TextInput
          placeholderTextColor={'grty'}
          nativeID="emailField"
          autoCapitalize="none"
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
        {err && (
          <Text>
            <Text className="text-center text-xl text-red-400">{err}</Text>
          </Text>
        )}
        <View className="items-center">
          <TouchableOpacity
            className="my-10 justify-center rounded-full bg-purple-800 p-2 text-center text-xl"
            onPress={handleLogin}>
            <Text className="text-center text-xl text-white">Login</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-column items-center space-y-10 border-blue-800">
        <View className="flex-row">
          <Text className="text-white">Dont have an account?</Text>
          <Link href={'/'}>
            <Text className="mx-2 text-blue-200 underline">Sign up</Text>
          </Link>
        </View>
        <View className="flex-row">
          <Text className="text-white">Register your business: </Text>
          <Link href={'/RegisterBusiness'}>
            <Text className="mx-2 text-blue-200 underline">Register Business</Text>
          </Link>
        </View>
      </View>
    </View>
  );
};

export default Register;
