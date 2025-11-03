import { isAxiosError } from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, TextInput, TouchableOpacity, View, Text, Alert } from 'react-native';
import { request } from '../utils/axios';

const ResetPassword = () => {
  const [password, setPassword] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');
  const [err, setErr] = useState('');

  const params = useLocalSearchParams<{ email: string; token: string }>();
  const email = params.email;
  const token = params.token;

  const router = useRouter();

  const handleReset = () => {
    setErr('');
    if (password != confirmPassword) {
      setErr('Passwords do not Match!');
    } else {
      request
        .post('/auth/resetpassword', { password, token, email })
        .then((res) => {
          if (Platform.OS == 'web') {
            window.confirm('Password Succesfully Reset!');
          } else {
            Alert.alert('Password Reset Sent!', 'Check inbox for password reset link');
          }
          router.navigate('/SignIn');
        })
        .catch((err) => {
          console.log(err);
          if (isAxiosError(err)) {
            setErr(err.response?.data.message);
          }
        });
    }
  };

  return (
    <View className="h-full items-center justify-center bg-black">
      <TextInput
        autoCapitalize="none"
        textContentType="password"
        placeholderTextColor={'gray'}
        className="mt-10 rounded-full border-2 border-purple-800 p-2 text-xl text-white"
        nativeID="passwordField"
        onChangeText={setPassword}
        placeholder="Password"
      />
      <TextInput
        autoCapitalize="none"
        textContentType="password"
        placeholderTextColor={'gray'}
        className="mt-10 rounded-full border-2 border-purple-800 p-2 text-xl text-white"
        nativeID="passwordField"
        onChangeText={setConfirmPassword}
        placeholder="Confirm Password"
      />
      {err && (
        <Text>
          <Text className="text-center text-xl text-red-400">{err}</Text>
        </Text>
      )}
      <View className="items-center">
        <TouchableOpacity
          className="my-10 justify-center rounded-full bg-purple-800 p-2 text-center text-xl"
          onPress={handleReset}>
          <Text className="text-center text-xl text-white">Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ResetPassword;
