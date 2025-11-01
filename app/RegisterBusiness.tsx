import React, { useState } from 'react';
import { request } from '../utils/axios';
import { Alert, Text, TextInput, TouchableOpacity, View, Modal } from 'react-native';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';
import { isAxiosError } from 'axios';
import { Link, router } from 'expo-router';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';

const RegisterBusiness = () => {
  const [email, setEmail] = useState('');

  const [name, setName] = useState('');

  const [password, setPassword] = useState('');

  const [address, setAddress] = useState('');
  const [licenseID, setLicenseID] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [err, setErr] = useState(null);

  const handleClick = async () => {
    try {
      if (confirmPassword != password) {
        Alert.alert('Incorrect Input', 'Passwords do not Match!');
        return;
      }
      await request.post('/auth/registerbusiness', { name, password, address, email, licenseID });
      setShowModal(true);
    } catch (e: unknown) {
      if (isAxiosError(e)) {
        setErr(e.response?.data.message);
      }
    }
  };

  return (
    <View className="align-center flex-1 bg-black">
      <Modal visible={showModal} className="m-[10%] flex-1 rounded-lg bg-[#262626] p-2">
        <View
          style={{ outlineStyle: 'none' }}
          className="m-8 flex-1 border-collapse flex-col items-center rounded-lg">
          <Text className=" text-3xl text-white">Business Request Sent!</Text>
          <View className="my-3 h-1 w-full bg-white fill-white" />

          <Text className="mb-2 text-2xl text-white underline">What to expect: </Text>
          <Text className="text-center text-2xl text-white">
            * Our team will review the information you sent over to us. (~2-3 days)
          </Text>
          <Text className="text-center text-2xl text-white">
            * We will email you once your business has been verified!
          </Text>
          <Text className="text-center text-2xl text-white">
            * From there, you can sign in with the email and password you provided previously.
          </Text>
          <View className="my-3 h-1 w-full bg-white fill-white" />
          <Text className="mb-2 text-2xl text-white underline">While you wait: </Text>
          <Text className="text-center text-lg text-white">
            We encourage you to create a standard User account while you await confirmation. This
            will provide you with insights into how to market your events to your local populus!
          </Text>
          <TouchableOpacity
            className="rounded-full bg-white p-2"
            onPress={() => setShowModal(false)}>
            <Text className="text-center text-lg">Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View className="mx-[20%] mt-7 flex-1">
        <Link href={'/'} className="justify-start">
          <FontAwesome6
            iconStyle="solid"
            color="#8500ED"
            name="arrow-left"
            className="w-8 text-white"
          />
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
          placeholder="Business License Identification #"
          value={licenseID}
          onChangeText={setLicenseID}
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
