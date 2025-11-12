import {
  View,
  Text,
  Button,
  TouchableOpacity,
  TouchableHighlight,
  Platform,
  Modal,
} from 'react-native';
import { useState } from 'react';
import { FontAwesome6 } from '@expo/vector-icons';

import { TextInput } from 'react-native';

import useAuth from '../Hooks/authContext';
import { Link, useRouter } from 'expo-router';
import { request } from '../utils/axios';
import About from '../utils/Components/About';

export default function SignUp() {
  const { continueAsGuest } = useAuth();

  const router = useRouter();

  const handleClick = async (e: any) => {
    setErr('');
    e.preventDefault();
    if (confirmPassword == '' || password == '' || email == '') {
      setErr('All fields Required');
      return;
    }
    if (confirmPassword !== password) {
      setErr('Passwords do not match!');
      return;
    }
    try {
      request.post('/auth/register', { email, password });
      router.navigate('/');
    } catch (err: any) {
      setErr(err);
    }
  };

  const guestBrowse = () => {
    continueAsGuest();
  };

  const [err, setErr] = useState('');
  const [showAbout, setShowAbout] = useState(false);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  return (
    <View
      className="items-center justify-center rounded-2xl bg-[#262626]"
      style={{
        width: Platform.OS == 'web' ? 'auto' : '100%',
        height: Platform.OS == 'web' ? 'auto' : '100%',
      }}>
      <Modal visible={showAbout} transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            className="flex-col rounded-xl"
            style={{
              width: Platform.OS == 'web' ? 'auto' : '95%',
              height: Platform.OS == 'web' ? 'auto' : '85%',
              justifyContent: 'center',
              paddingHorizontal: 10,
              backgroundColor: '#262626',
            }}>
            <TouchableOpacity className="my-2" onPress={() => setShowAbout(false)}>
              <FontAwesome6 iconStyle="solid" size={25} color="#00E0FF" name="arrow-left" />
            </TouchableOpacity>
            <About />
          </View>
        </View>
      </Modal>
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
          className="mb-10 rounded-xl border-2 border-gray-200 p-2 text-xl text-white"
          nativeID="passwordField"
          onChangeText={setPassword}
          placeholder="Password"
        />
        <TextInput
          placeholderTextColor={'gray'}
          className=" rounded-xl border-2 border-gray-200 p-2 text-xl text-white"
          nativeID="passwordField"
          onChangeText={setConfirmPassword}
          placeholder="Confirm Password"
        />
        {err && <Text className="mt-3 text-center text-lg text-red-400">{err}</Text>}
        <View style={{ paddingHorizontal: '10%' }}>
          <TouchableOpacity
            className="my-3 mb-10 rounded-2xl bg-[#00E0FF] p-2 text-center text-xl"
            onPress={handleClick}>
            <Text className="text-center text-xl text-black">Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-column border-blue-800">
        <View className="mb-3 flex-row justify-center">
          <Text className="text-lg text-white">Already have an account? </Text>
          <Link href={'/'}>
            <Text className="mx-2 text-lg text-[#00E0FF] underline">Login</Text>
          </Link>
        </View>
        <View className="mt-3 flex-row">
          <Text className="text-lg text-white">Register your business: </Text>
          <Link href={'/RegisterBusiness'}>
            <Text className="mx-2 text-lg text-[#00E0FF] underline">Register Business</Text>
          </Link>
        </View>
        <View className="flex-row justify-evenly">
          <TouchableOpacity className="mb-2 mt-5 rounded-full bg-[#4c4c4c] p-2 text-center text-xl">
            <Text onPress={continueAsGuest} className="text-s text-white">
              Continue as guest
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowAbout(true)}
            className="mb-2 mt-5 rounded-full bg-[#00E0FF] p-2 text-center text-xl">
            <Text className="text-s ">Learn More</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
