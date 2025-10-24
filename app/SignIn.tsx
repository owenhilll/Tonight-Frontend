import { Link } from 'react-router-dom';
import { useState } from 'react';
import { AxiosError, isAxiosError } from 'axios';
import { request } from '../utils/axios';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import useAuth from 'Hooks/authContext';
import { useRouter } from 'expo-router';

const Register = () => {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [err, setErr] = useState('');
  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      await login({ email, password });
      router.navigate('/');
    } catch (e: unknown) {
      if (isAxiosError(e)) {
        setErr(e.response?.data.message);
      }
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-black">
      <View>
        <Text className="text-center text-xl text-white">Sign In</Text>
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
        {err && <Text className="text-center text-xl text-red-200">{err}</Text>}
        <TouchableOpacity
          className="my-10 rounded-full bg-purple-800 p-2 text-center text-xl"
          onPress={handleLogin}>
          <Text className="p-2 text-center text-xl text-white">Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Register;
