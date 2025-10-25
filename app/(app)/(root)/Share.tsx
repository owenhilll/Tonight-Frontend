import { useContext } from 'react';

import { useState } from 'react';
import { request } from '../../../utils/axios';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from 'Hooks/authContext';
import { MapIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import DatePicker from 'react-datepicker';
import DropDownPicker from 'react-native-dropdown-picker';

const Share = () => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState(null);
  const [timePeriod, setTimePeriod] = useState(null);
  const [open, setOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [err, setErr] = useState('');
  const { user } = useAuth();
  const [items, setItems] = useState([
    { label: 'Food', value: 'Food' },
    { label: 'Drink', value: 'Drink' },
    { label: 'Music', value: 'Music' },
    { label: 'Sport', value: 'Sport' },
  ]);
  const [timeItems, setTimeItems] = useState([
    { label: 'AM', value: 'AM' },
    { label: 'PM', value: 'PM' },
  ]);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newPost) => {
      console.log('Adding event');
      return request.post('/events', { desc, category, title, timePeriod, time, date });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const isValidDateString = (dateString: string) => {
    const parsedDate = new Date(dateString);
    return !isNaN(parsedDate.getTime());
  };
  const validateTime = (inputTime: string) => {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:MM format
    if (!timeRegex.test(inputTime)) {
      return false;
    } else {
      return true;
    }
  };

  const handleClick = (e: any) => {
    setErr('');
    console.log('clicked');
    e.preventDefault();
    if (
      title.trim() == '' ||
      date.trim() == '' ||
      time.trim() == '' ||
      desc.trim() == '' ||
      category == null
    ) {
      setErr('All fields are required!');
      return;
    } else if (!isValidDateString(date)) {
      setErr('Please enter a valid Date/Time');
      return;
    } else if (!validateTime(time)) {
      setErr('Invalid Time. Use format HH:MM');
      return;
    }
    mutation.mutate();
  };

  return (
    <View className=" border-2 border-purple-800 bg-black shadow-lg shadow-white">
      <View>
        <View className="flex-column flex-1 border-0 border-b border-purple-800">
          <TextInput
            numberOfLines={3}
            className="p-2 text-2xl text-white "
            placeholder="Title"
            onChangeText={setTitle}
          />
          <TextInput
            numberOfLines={3}
            className="flex-1 p-2 text-xl text-white "
            placeholder="Event Description"
            onChangeText={setDesc}
          />
        </View>
        <View className="flex-row">
          <View className="flex-1 justify-center border-0 border-b border-r border-purple-800 p-2 text-white">
            <TextInput
              className="h-full border-0"
              placeholder="Date (MM-DD-YYYY)"
              onChangeText={setDate}
            />
          </View>
          <View className="flex-1 flex-row border-b border-purple-800 p-2 text-white">
            <TextInput
              className="w-[70%] text-wrap"
              placeholder="Time (E.g 12:05pm or 3:05am)"
              onChangeText={setTime}
            />
            <DropDownPicker
              placeholder="AM/PM"
              zIndex={99}
              style={{
                backgroundColor: 'black',
                zIndex: 999,
                width: '30%',
              }}
              dropDownContainerStyle={{
                backgroundColor: 'black',
                zIndex: 999,
                padding: 0,
                margin: 0,
                borderColor: 'gray',
              }}
              textStyle={{ color: 'white' }}
              containerStyle={{
                borderColor: 'gray',
                borderWidth: 1,
                margin: 0,
                padding: 0,
                width: 'auto',
                borderRadius: 5,
                zIndex: 999,
                backgroundColor: 'black',
              }}
              listItemContainerStyle={{
                borderBottomColor: 'gray',
                justifyContent: 'center',
                margin: 0,
                padding: 0,
                zIndex: 999,
                borderBottomWidth: 1,
              }}
              modalContentContainerStyle={{ zIndex: 999, padding: 0 }}
              items={timeItems}
              open={timeOpen}
              setOpen={setTimeOpen}
              value={timePeriod}
              setValue={setTimePeriod}
            />
          </View>
        </View>
        <DropDownPicker
          placeholder="Select event Category"
          style={{
            backgroundColor: 'black',
          }}
          dropDownContainerStyle={{ backgroundColor: 'black', borderColor: 'gray' }}
          textStyle={{ color: 'white' }}
          containerStyle={{
            borderColor: 'gray',
            borderWidth: 1,
            margin: 10,
            borderRadius: 5,
            backgroundColor: 'black',
            width: '80%',
          }}
          listItemContainerStyle={{
            borderBottomColor: 'gray',
            borderBottomWidth: 1,
          }}
          zIndex={10}
          open={open}
          setOpen={setOpen}
          items={items}
          value={category}
          setValue={setCategory}
        />
        <View className="items-center justify-center">
          {err && <Text className="text-xl text-red-200">{err}</Text>}
          <TouchableOpacity
            className="rounded-full bg-purple-600 px-10 py-3 text-center text-xl"
            onPress={handleClick}>
            Share
          </TouchableOpacity>
        </View>
        <View className="m-2 flex self-end"></View>
      </View>
    </View>
  );
};

export default Share;
