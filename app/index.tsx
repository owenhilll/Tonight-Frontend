import { useState } from 'react';
import { AxiosError, isAxiosError } from 'axios';
import { request } from '../utils/axios';
import {
  Alert,
  Image,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Link, useRouter } from 'expo-router';
import useAuth from '../Hooks/authContext';
import { FontAwesome6 } from '@expo/vector-icons';

const Register = () => {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showResetPassword, setShowResetPassword] = useState(false);

  const [err, setErr] = useState('');
  const [resetErr, setResetErr] = useState('');

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

  function handleReset() {
    request
      .post('/auth/forgotpassword', { email })
      .then((res) => {
        if (Platform.OS == 'web') {
          window.confirm('Password Reset Sent! Check inbox for password reset link');
        } else {
          Alert.alert('Password Reset Sent!', 'Check inbox for password reset link');
        }
        setShowResetPassword(false);
      })
      .catch((err) => {
        console.log(err);
        if (isAxiosError(err)) {
          setResetErr(err.response?.data.message);
        }
      });
  }

  return (
    <View
      className="items-center justify-center rounded-2xl bg-[#262626]"
      style={{
        width: Platform.OS == 'web' ? 'auto' : '100%',
        height: Platform.OS == 'web' ? 'auto' : '100%',
      }}>
      <Modal visible={showResetPassword} transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              width: Platform.OS == 'web' ? 'auto' : '90%',
              height: Platform.OS == 'web' ? 'auto' : '70%',
              justifyContent: 'center',
              paddingHorizontal: 10,
              backgroundColor: '#262626',
            }}
            className="rounded-xl">
            <TouchableOpacity className="my-2" onPress={() => setShowResetPassword(false)}>
              <FontAwesome6 iconStyle="solid" size={25} color="#00E0FF" name="arrow-left" />
            </TouchableOpacity>
            <Text className="text-center text-3xl text-white">Reset Password</Text>
            <TextInput
              placeholderTextColor={'gray'}
              nativeID="emailField"
              textContentType="emailAddress"
              autoCapitalize="none"
              className="my-10 rounded-lg border-2 border-gray-200 p-2 text-xl text-white"
              onChangeText={setEmail}
              placeholder="Email"
            />
            {resetErr && <Text className="text-center text-xl text-red-400">{resetErr}</Text>}
            <TouchableOpacity
              className="my-10 justify-center rounded-full bg-[#00E0FF] p-2 text-center text-xl"
              onPress={handleReset}>
              <Text className="text-center text-xl text-black">Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View
        className="flex-1"
        style={{
          paddingHorizontal: Platform.OS == 'web' ? '10%' : '3%',
          flexDirection: Platform.OS == 'web' ? 'row' : 'column',
        }}>
        <View style={{ flex: Platform.OS == 'web' ? 1 : undefined }}>
          <View>
            <Image
              source={require('../assets/logo4.png')}
              resizeMode="contain"
              style={{
                width: Platform.OS == 'web' ? 100 : 100,
                height: Platform.OS == 'web' ? 100 : 100,
              }}
            />
          </View>
          <Text className="mr-10 text-wrap text-xl text-white">
            Discover what’s happening around you — from events and live shows to food deals, drink
            specials, and more. Explore your city, find your vibe, and make every day unforgettable.
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-center text-3xl text-white">Login</Text>
          <TextInput
            placeholderTextColor={'gray'}
            nativeID="emailField"
            textContentType="emailAddress"
            autoCapitalize="none"
            className="my-10 rounded-xl border-2 border-gray-200 p-2 text-xl text-white"
            onChangeText={setEmail}
            placeholder="Email"
          />
          <TextInput
            autoCapitalize="none"
            textContentType="password"
            placeholderTextColor={'gray'}
            className="mt-10 rounded-xl border-2 border-gray-200 p-2 text-xl text-white"
            nativeID="passwordField"
            onChangeText={setPassword}
            placeholder="Password"
          />
          <Text
            onPress={() => setShowResetPassword(true)}
            className="mt-2 text-right text-white underline">
            Forgot Password?
          </Text>
          {err && (
            <Text>
              <Text className="text-center text-xl text-red-400">{err}</Text>
            </Text>
          )}
          <View style={{ paddingHorizontal: '10%' }}>
            <TouchableOpacity
              className="mt-10 rounded-2xl bg-[#00E0FF] p-2 text-center text-xl"
              onPress={handleLogin}>
              <Text className="text-center text-xl text-black">Login</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-column mb-2 items-center border-blue-800">
            <View className="my-3 flex-row">
              <Text className="text-lg text-white">Dont have an Account? </Text>
              <Link href={'/SignUp'}>
                <Text className="ml-2 text-lg text-[#00E0FF] underline">Create Account</Text>
              </Link>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Register;
