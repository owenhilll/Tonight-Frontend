import { View, Text, Button, TouchableOpacity, TouchableHighlight, Platform } from 'react-native';
import { useState } from 'react';

import { TextInput } from 'react-native';

import useAuth from '../Hooks/authContext';
import { Link, useRouter } from 'expo-router';
import { request } from '../utils/axios';
import About from '../utils/Components/About';

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
  const [showAbout, setShowAbout] = useState(false);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  return (
    <View
      className="items-center justify-center rounded-2xl bg-[#262626]"
      style={{
        marginHorizontal: Platform.OS == 'web' ? '15%' : '5%',
        marginVertical: Platform.OS == 'web' ? '15%' : '5%',
      }}>
      <View className="w-full px-[10%]">
        <Text className="text-center text-3xl text-white">Sign Up</Text>
        <TextInput
          placeholderTextColor={'gray'}
          nativeID="emailField"
          className="my-10 rounded-xl border-2 border-gray-200 p-2 text-xl text-white"
          onChangeText={setEmail}
          placeholder="Email"
        />
        <TextInput
          placeholderTextColor={'gray'}
          className="my-10 rounded-xl border-2 border-gray-200 p-2 text-xl text-white"
          nativeID="passwordField"
          onChangeText={setPassword}
          placeholder="Password"
        />
        <View style={{ paddingHorizontal: '10%' }}>
          <TouchableOpacity
            className="my-10 rounded-2xl bg-[#BBDEFB] p-2 text-center text-xl"
            onPress={handleClick}>
            <Text className="text-center text-xl text-black">Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-column items-center border-blue-800">
        <View className="my-3 flex-row">
          <Text className="text-lg text-white">Already have an account? </Text>
          <Link href={'/SignIn'}>
            <Text className="mx-2 text-lg text-blue-200 underline">Login</Text>
          </Link>
        </View>
        <View className="mt-3 flex-row">
          <Text className="text-lg text-white">Register your business: </Text>
          <Link href={'/RegisterBusiness'}>
            <Text className="mx-2 text-lg text-blue-200 underline">Register Business</Text>
          </Link>
        </View>
        <TouchableOpacity className="mt-5 rounded-full bg-blue-300 p-2 text-center text-xl">
          <Text onPress={continueAsGuest} className="text-s ">
            Continue as guest
          </Text>
        </TouchableOpacity>
      </View>
      <Text>{err}</Text>
    </View>
  );
}
