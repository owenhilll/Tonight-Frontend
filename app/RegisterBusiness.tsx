import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { request } from '../utils/axios';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';

const RegisterBusiness = () => {
  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    category: '',
  });

  const [err, setErr] = useState(null);

  const handleChange = (e: any) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async () => {
    inputs.category = category;
    try {
      request.post('/auth/registerbusiness', inputs);
    } catch (e: any) {
      setErr(e);
    }
  };

  const [category, setCategory] = useState('');

  const handleCategory = (selected: any) => {
    setCategory(selected.target.value);
  };
  const [items, setItems] = useState<Array<ItemType<string>>>([
    { label: 'Food and Drink', value: 'Food and Drink' },
    { label: 'Venue', value: 'Venue' },
    { label: 'Consumer Product', value: 'Consumer Product' },
  ]);
  const [open, setOpen] = useState<boolean>(false);
  const [singleValue, setSingleValue] = useState<string | null>(null);

  const options = ['Food and Drink', 'Venue', 'Consumer Products'];

  return (
    <View className="flex-1 items-center justify-center bg-black">
      <View>
        <Text className="text-center text-xl text-white">Register Business</Text>

        <TextInput
          className="my-5 rounded-full border-2 border-purple-800 p-2 text-xl"
          placeholder="Business name"
          nativeID="username"
          onChange={handleChange}
        />

        <TextInput
          className="my-5 rounded-full border-2 border-purple-800 p-2 text-xl"
          placeholder="Email"
          nativeID="email"
          onChange={handleChange}
        />
        <TextInput
          className="my-5 rounded-full border-2 border-purple-800 p-2 text-xl"
          placeholder="Address"
          nativeID="address"
          onChange={handleChange}
        />
        <TextInput
          className="my-5 rounded-full border-2 border-purple-800 p-2 text-xl"
          placeholder="Password"
          nativeID="password"
          onChange={handleChange}
        />
        <TextInput
          className="my-5 rounded-full border-2 border-purple-800 p-2 text-xl"
          placeholder="Confirm Password"
          nativeID="confirmPassword"
          onChange={handleChange}
        />
        {err && err}
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
