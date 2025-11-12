import { useState } from 'react';
import { request } from '../utils/axios';
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';
import { isAxiosError } from 'axios';
import { Link, router } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import LoadingIndicator from '../utils/Components/LoadingIndicator';

const RegisterBusiness = () => {
  const [email, setEmail] = useState('');

  const [name, setName] = useState('');

  const [password, setPassword] = useState('');

  const [address, setAddress] = useState('');
  const [number, setNumber] = useState('');
  const [licenseID, setLicenseID] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      setErr('');
      if (confirmPassword != password) {
        setErr('Passwords do not Match!');
        return;
      }
      await request
        .post('/auth/registerbusiness', { name, password, address, email, licenseID })
        .then((res) => {
          setShowModal(true);
        })
        .catch((err) => {
          if (isAxiosError(err)) {
            setErr(err.response?.data.message);
          }
        });
    } catch (e: unknown) {
      console.log(e);
      if (isAxiosError(e)) {
        setErr(e.response?.data.message);
      }
    }
    setLoading(false);
  };

  return (
    <View
      className="rounded-2xl bg-[#262626] p-2"
      style={{
        marginHorizontal: Platform.OS == 'web' ? '10%' : '5%',
        marginVertical: Platform.OS == 'web' ? '10%' : '5%',
      }}>
      <Modal visible={showModal} transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              width: Platform.OS == 'web' ? '60%' : '90%',
              height: Platform.OS == 'web' ? 'auto' : '70%',
              justifyContent: 'center',
              backgroundColor: 'black',
            }}
            className="rounded-xl">
            <Text className=" mt-5 text-center text-3xl text-white">Business Request Sent!</Text>
            <View className="my-3 h-1 w-full bg-white fill-white" />

            <Text className="mb-2 text-center text-2xl text-white underline">What to expect: </Text>
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
            <Text className="mb-2 text-center text-2xl text-white underline">While you wait: </Text>
            <Text className="flex-1 text-center text-lg text-white">
              We encourage you to create a standard User account while you await confirmation. This
              will provide you with insights into how to market your events to your local populus!
            </Text>
            <TouchableOpacity
              className="m-[5%] rounded-full bg-white p-2"
              onPress={() => setShowModal(false)}>
              <Text className="text-center text-lg">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Link href={'/'} className="justify-start">
        <FontAwesome6
          iconStyle="solid"
          color="#00E0FF"
          name="arrow-left"
          size={20}
          className="ml-2 mt-4 w-8 text-white"
        />
      </Link>
      <View
        style={{
          flexDirection: Platform.OS == 'web' ? 'row' : 'column',
        }}>
        <View className="flex-1 justify-center">
          <View>
            <Image
              source={require('../assets/logo4.png')}
              resizeMode="contain"
              style={{
                width: Platform.OS == 'web' ? 100 : 'auto',
                height: Platform.OS == 'web' ? 100 : 'auto',
              }}
            />
          </View>
          <Text className="mr-10 text-wrap text-2xl font-bold text-white">
            Grow Your Reach with Locale.
          </Text>
          <Text className="mr-10 text-wrap text-xl text-white">
            Join the platform that connects your business to locals looking for something to do —
            right now. Post events. Promote offers. Boost visibility.
          </Text>
        </View>
        <ScrollView className="flex-1 flex-wrap">
          <Text className="text-center text-2xl text-white">Register Business</Text>
          <View className="mt-7 flex-1 flex-row flex-wrap justify-center">
            <TextInput
              placeholderTextColor={'gray'}
              className="mx-2 my-2 rounded-xl border-2 border-gray-200 p-2 text-lg text-white"
              placeholder="Business name"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              textContentType="emailAddress"
              placeholderTextColor={'gray'}
              className="mx-2 my-2 rounded-xl border-2 border-gray-200 p-2 text-lg text-white"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              placeholderTextColor={'gray'}
              className="mx-2 my-2 rounded-xl border-2 border-gray-200 p-2 text-lg text-white"
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
            />
            <TextInput
              placeholderTextColor={'gray'}
              className="mx-2 my-2 rounded-xl border-2 border-gray-200 p-2 text-lg text-white"
              placeholder="Phone Number"
              value={number}
              onChangeText={setNumber}
            />
            <TextInput
              placeholderTextColor={'gray'}
              className="mx-2 my-2 rounded-xl border-2 border-gray-200 p-2 text-lg text-white"
              placeholder="Business License ID"
              value={licenseID}
              onChangeText={setLicenseID}
            />
            <TextInput
              autoCapitalize="none"
              textContentType="password"
              placeholderTextColor={'gray'}
              className="mx-2 my-2 rounded-xl border-2 border-gray-200 p-2 text-lg text-white"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              autoCapitalize="none"
              placeholderTextColor={'gray'}
              className="mx-2 my-2 rounded-xl border-2 border-gray-200 p-2 text-lg text-white"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            {err && <Text className="text-center text-xl text-red-300">{err}</Text>}
          </View>
          {loading && (
            <View className="items-center justify-center">
              <LoadingIndicator />
            </View>
          )}
          <View className="items-center justify-center">
            <TouchableOpacity
              disabled={loading}
              className="my-10 justify-center rounded-full bg-[#00E0FF] px-5 py-2 text-center text-xl text-white"
              onPress={handleClick}>
              <Text className="text-center text-xl">Register</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default RegisterBusiness;
