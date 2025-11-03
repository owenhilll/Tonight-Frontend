import { useContext } from 'react';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';

import { useState } from 'react';
import { request } from '../axios';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../Hooks/authContext';
import { Alert, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { DateSelection } from '../DateTimePicker';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

const Share = ({
  close,
  queryKey,
}: {
  close: React.Dispatch<React.SetStateAction<boolean>>;
  queryKey: string;
}) => {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [site, setSite] = useState('');

  let [date, setDate] = useState(new Date());
  const [category, setCategory] = useState('');

  const [open, setOpen] = useState(false);

  const [err, setErr] = useState('');
  const { user, token } = useAuth();
  const [items, setItems] = useState([
    { label: 'Food', value: 'Food' },
    { label: 'Drink', value: 'Drink' },
    { label: 'Music', value: 'Music' },
    { label: 'Sport', value: 'Sport' },
    { label: 'Show', value: 'Show' },
    { label: 'Game (non-sport)', value: 'Game' },
    { label: 'Outdoor Activity', value: 'outActivity' },
    { label: 'Classes (Yoga, Pilates, Mahjong, etc...)', value: 'Classes' },
  ]);
  const [timeItems, setTimeItems] = useState([
    { label: 'AM', value: 'AM' },
    { label: 'PM', value: 'PM' },
  ]);
  const mutation = useMutation({
    mutationFn: (newPost) => {
      return request
        .post(
          '/events',
          { desc, category, title, date, site },
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .then((res) => {
          if (res.status != 200) {
            Alert.alert('Error creating event.', `Error Creating Event: ${res.data}`);
          } else {
            queryClient.invalidateQueries({ queryKey: [queryKey] });
            close(false);
          }
        });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  function OnDateSelected(event: DateTimePickerEvent, datei?: Date | null) {
    if (datei) setDate(datei);
    console.log(datei);
  }

  const handleClick = (e: any) => {
    setErr('');
    e.preventDefault();
    if (title.trim() == '' || date == null || desc.trim() == '' || category == null) {
      setErr('Title, Description, DateTime, and Category are required!');
      return;
    }
    mutation.mutate();
  };

  return (
    <View className="flex-1">
      <TouchableOpacity className="absolute left-2 top-6 ml-4 w-7" onPress={() => close(false)}>
        <FontAwesome6 iconStyle="solid" size={25} color="#BBDEFB" name="arrow-left" />
      </TouchableOpacity>
      <View className="mt-10 w-[100%] flex-row">
        <Text className="flex-1 text-center text-3xl text-white">Create Event</Text>
      </View>
      <View className="m-3 flex-1 overflow-visible">
        <View className="justify-center">
          <Text className="ml-3 mt-5 text-white">Title</Text>
          <TextInput
            numberOfLines={3}
            className="rounded-lg border-2 border-gray-600 p-2 text-2xl text-white"
            placeholder="Title"
            onChangeText={setTitle}
          />
        </View>

        <View className=" mt-5 justify-center">
          <Text className="ml-3 text-white">Date</Text>
          {Platform.OS == 'web' ? (
            <DateSelection
              date={date}
              setDate={setDate}
              defValue={new Date()}
              type="datetime-local"
            />
          ) : (
            <DateTimePicker
              mode="datetime"
              style={{ marginLeft: 3 }}
              onChange={OnDateSelected}
              value={date}
            />
          )}
        </View>
        <View className="mt-5 justify-center">
          <Text className="ml-3  text-white">Details</Text>
          <TextInput
            numberOfLines={3}
            className="rounded-lg border-2 border-gray-600 p-2 text-lg text-white"
            placeholder="Details"
            onChangeText={setDesc}
          />
        </View>

        <View style={{ zIndex: open ? 1000 : 0 }}>
          <Text className="ml-3 mt-5 text-white">Category</Text>

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
            textStyle={{ color: 'black', fontSize: 18 }}
            containerStyle={{
              borderColor: 'white',
              backgroundColor: 'lightgray',
              overflow: 'visible',
              borderRadius: 20,
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
        <View className="mt-5 h-auto flex-col overflow-visible">
          <Text className="ml-3 text-white">Event URL (Optional)</Text>
          <TextInput
            className="rounded-lg border-2 border-gray-600 p-2 text-2xl text-white "
            placeholder="Reservation Link or Ticket Purchasing Link."
            onChangeText={setSite}
          />
        </View>
        <View className="mt-4 items-center justify-center">
          {err && <Text className="text-xl text-red-200">{err}</Text>}
          <TouchableOpacity
            className="rounded-full bg-[#BBDEFB] px-10 py-3 text-center text-xl"
            onPress={handleClick}>
            <Text>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Share;
