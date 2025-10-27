import React, { useState } from 'react';
import { request } from '../utils/axios';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';
import { isAxiosError } from 'axios';
import { Link, router } from 'expo-router';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const RegisterBusiness = () => {
  const [email, setEmail] = useState('');

  const [name, setName] = useState('');

  const [password, setPassword] = useState('');

  const [address, setAddress] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');

  const [err, setErr] = useState(null);

  const handleClick = async () => {
    try {
      if (confirmPassword != password) {
        Alert.alert('Incorrect Input', 'Passwords do not Match!');
        return;
      }
      await request.post('/auth/registerbusiness', { name, password, address, email });
      router.navigate('/SignIn');
    } catch (e: unknown) {
      if (isAxiosError(e)) {
        setErr(e.response?.data.message);
      }
    }
  };

  return (
    <View className="align-center flex-1 items-center justify-center bg-black">
      <View>
        <Link href={'/'} className="justify-start">
          <ArrowLeftIcon className="w-8 text-white" />
        </Link>
        <Text className="text-center text-xl text-white">Register Business</Text>

        <TextInput
          className="my-5 min-w-[50%] rounded-full border-2 border-purple-800 p-2 text-xl text-white"
          placeholder="Business name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          className="my-5 min-w-[50%] rounded-full border-2 border-purple-800 p-2 text-xl text-white"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          className="my-5 min-w-[50%] rounded-full border-2 border-purple-800 p-2 text-xl text-white"
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          className="my-5 min-w-[50%] rounded-full border-2 border-purple-800 p-2 text-xl text-white"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          className="my-5 min-w-[50%] rounded-full border-2 border-purple-800 p-2 text-xl text-white"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        {err && <Text className="max-w-[50%] text-center text-xl text-red-300">{err}</Text>}
        <TouchableOpacity
          className="my-10 rounded-full bg-purple-800 p-2 text-center text-xl text-white"
          onPress={handleClick}>
          Register
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterBusiness;
