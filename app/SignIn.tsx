import { useState } from 'react';
import { AxiosError, isAxiosError } from 'axios';
import { request } from '../utils/axios';
import { Alert, Modal, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Link, useRouter } from 'expo-router';
import useAuth from '../Hooks/authContext';

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
        marginHorizontal: Platform.OS == 'web' ? '15%' : '5%',
        marginVertical: Platform.OS == 'web' ? '15%' : '5%',
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
              width: Platform.OS == 'web' ? 300 : '90%',
              height: Platform.OS == 'web' ? 300 : '70%',
              justifyContent: 'center',
              paddingHorizontal: 10,
              backgroundColor: '#262626',
              borderRadius: '10%',
            }}>
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
              className="my-10 justify-center rounded-full bg-[#BBDEFB] p-2 text-center text-xl"
              onPress={handleReset}>
              <Text className="text-center text-xl text-black">Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View className="w-full" style={{ paddingHorizontal: Platform.OS == 'web' ? '10%' : '3%' }}>
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
            className="my-10 rounded-2xl bg-[#BBDEFB] p-2 text-center text-xl"
            onPress={handleLogin}>
            <Text className="text-center text-xl text-black">Login</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-column items-center border-blue-800">
        <View className="my-3 flex-row">
          <Text className="text-lg text-white">Dont have an Account? </Text>
          <Link href={'/'}>
            <Text className="mx-2 text-lg text-blue-200 underline">Create Account</Text>
          </Link>
        </View>
      </View>
    </View>
  );
};

export default Register;
