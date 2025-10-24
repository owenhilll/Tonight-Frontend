import { useContext } from 'react';

import { useState } from 'react';
import { request } from '../../../utils/axios';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from 'Hooks/authContext';
import { MapIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import DatePicker from 'react-datepicker';

const Share = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const { user } = useAuth();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newPost) => {
      return request.post('/posts', newPost);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleClick = (e: any) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <View className=" border-2 border-purple-800 bg-black shadow-lg shadow-white">
      <View>
        <View className=" flex-1 border-0 border-b border-purple-800">
          <TextInput
            numberOfLines={3}
            className="text-20 h-[100%] p-2 text-xl text-white "
            placeholder="Event Description"
            onChangeText={setDesc}
          />
        </View>
        <View className=" flex-row">
          <View className="flex-1 border-0 border-b border-r border-purple-800 p-2 text-white">
            <TextInput placeholder="Date (MM\DD\YYYY)" onChangeText={setDate} />
          </View>
          <View className="flex-1 border-b border-purple-800 p-2 text-white">
            <TextInput placeholder="Time (E.g 12:05pm or 3:05am)" onChangeText={setTime} />
          </View>
        </View>
        <View className="m-2 flex self-end">
          <TouchableOpacity
            className="rounded-full bg-purple-600 px-10 py-3 text-center text-xl"
            onPress={handleClick}>
            Share
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Share;
