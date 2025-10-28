import { useContext } from 'react';

import { useState } from 'react';
import { request } from '../../../utils/axios';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../../Hooks/authContext';
import { MapIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { Alert, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { DateSelection } from '../../../utils/DateTimePicker';
import DropDownPicker from 'react-native-dropdown-picker';

const Share = ({ close }: { close: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [time, setTime] = useState('');
  const [site, setSite] = useState('');

  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');

  const [open, setOpen] = useState(false);

  const [err, setErr] = useState('');
  const { user } = useAuth();
  const [items, setItems] = useState([
    { label: 'Food', value: 'Food' },
    { label: 'Drink', value: 'Drink' },
    { label: 'Music', value: 'Music' },
    { label: 'Sport', value: 'Sport' },
    { label: 'Show', value: 'Show' },
    { label: 'Game (non-sport)', value: 'Game' },
    { label: 'Outdoor Activity', value: 'outActivity' },
  ]);
  const [timeItems, setTimeItems] = useState([
    { label: 'AM', value: 'AM' },
    { label: 'PM', value: 'PM' },
  ]);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newPost) => {
      return request.post('/events', { desc, category, title, time, date, site }).then((res) => {
        if (res.status != 200) {
          Alert.alert('Error creating event.', `Error Creating Event: ${res.data}`);
        } else {
          queryClient.invalidateQueries({ queryKey: [category] });
          close(false);
        }
      });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleClick = (e: any) => {
    setErr('');
    e.preventDefault();
    if (
      title.trim() == '' ||
      date == null ||
      time.trim() == '' ||
      desc.trim() == '' ||
      category == null
    ) {
      setErr('Title, Description, DateTime, and Category are required!');
      return;
    }
    mutation.mutate();
  };

  return (
    <View className="bg-blue-50 shadow-lg shadow-white">
      <View className="m-3 flex-1 overflow-visible">
        <TextInput
          numberOfLines={3}
          className="mb-3 rounded-full border-2 border-purple-500 p-2 text-3xl text-white "
          placeholder="Title"
          onChangeText={setTitle}
        />
        <TextInput
          numberOfLines={3}
          className="rounded-full border-2 border-purple-500 p-2 text-xl text-white "
          placeholder="Event Description"
          onChangeText={setDesc}
        />

        <View className="mt-3 flex-row space-x-3 overflow-visible">
          <View className="flex-1 justify-center">
            <DateSelection date={date} setDate={setDate} type="date" />
          </View>
          <View className="flex-1 justify-center">
            <DateSelection date={time} setDate={setTime} type="time" />
          </View>
        </View>

        <View style={{ zIndex: open ? 1000 : 0 }} className="mt-5 items-center justify-center">
          <DropDownPicker
            placeholder="Select event Category"
            style={{
              backgroundColor: 'transparent',
              width: 'auto',
              borderWidth: 0,
            }}
            dropDownContainerStyle={{
              backgroundColor: 'white',
              overflow: 'visible',
              borderColor: 'gray',
            }}
            textStyle={{ color: 'black', fontSize: 25 }}
            containerStyle={{
              borderColor: 'white',
              borderRadius: 5,
              backgroundColor: 'lightgray',
              width: '80%',
              overflow: 'visible',
            }}
            listItemContainerStyle={{
              borderBottomColor: 'gray',
              borderBottomWidth: 1,
              overflow: 'visible',
            }}
            open={open}
            setOpen={setOpen}
            items={items}
            value={category}
            setValue={setCategory}
          />
        </View>
        <View className="py-3">
          <Text className="text-lg text-black">Optional</Text>
          <TextInput
            className="flex-1 rounded-full border-2 border-purple-500 p-2 text-xl text-white "
            placeholder="Reservation Link or Ticket Purchasing Link."
            onChangeText={setSite}
          />
        </View>
        <View className="items-center justify-center">
          {err && <Text className="my-5 text-xl text-red-200">{err}</Text>}
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
