import { useContext, useEffect } from 'react';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';

import { useState } from 'react';
import { request } from '../axios';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../Hooks/authContext';
import { Alert, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { DateSelection } from '../DateTimePicker';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { isAxiosError } from 'axios';
import { Picker } from '@react-native-picker/picker'; // Or import { Picker } from 'react-native' for web

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
  const [hours, setHours] = useState('0');
  const [days, setDays] = useState('0');
  const [totalHours, setTotalHours] = useState(0);

  const daysMap = Array.from({ length: 30 }, (v, i) => i.toString()); // 1 to 10

  const hoursMap = Array.from({ length: 24 }, (v, i) => i.toString()); // 1 to 10

  let [date, setDate] = useState(new Date());
  const [category, setCategory] = useState('');

  const [open, setOpen] = useState(false);

  const [err, setErr] = useState('');
  const { session } = useAuth();
  const ses = JSON.parse(session ?? '');

  const token = ses.token;
  const [items, setItems] = useState([
    {
      label: 'Food',
      value: 'Food',
      icon: () => <FontAwesome6 color="orange" iconStyle="solid" name="utensils" size={15} />,
    },
    {
      label: 'Drink',
      value: 'Drink',
      icon: () => <FontAwesome6 color="blue" iconStyle="solid" name="glass-water" size={15} />,
    },
    {
      label: 'Music',
      value: 'Music',
      icon: () => <FontAwesome6 color="lightblue" iconStyle="solid" name="music" size={15} />,
    },
    {
      label: 'Shop',
      value: 'Shop',
      icon: () => <FontAwesome6 color="purple" iconStyle="solid" name="shop" size={15} />,
    },
    {
      label: 'Sport',
      value: 'Sport',
      icon: () => <FontAwesome6 color="green" iconStyle="solid" name="football" size={15} />,
    },
    {
      label: 'Show',
      value: 'Show',
      icon: () => <FontAwesome6 color="red" iconStyle="solid" name="film" size={15} />,
    },
    {
      label: 'Game (non-sport)',
      value: 'Game',
      icon: () => <FontAwesome6 color="violet" iconStyle="solid" name="gamepad" size={15} />,
    },
    {
      label: 'Outdoor Activity',
      value: 'outActivity',
      icon: () => <FontAwesome6 color="yellow" iconStyle="solid" name="sun" size={15} />,
    },
    {
      label: 'Classes (Yoga, Pilates, Mahjong, etc...)',
      value: 'Classes',
      icon: () => <FontAwesome6 color="pink" iconStyle="solid" name="school" size={15} />,
    },
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
          { desc, category, title, date, totalHours, site },
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
            queryClient.invalidateQueries({ queryKey: [queryKey + 'full'] });
            close(false);
          }
        })
        .catch((err) => {
          if (isAxiosError(err)) {
            setErr(err.response?.data.message);
          }
        });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });

  useEffect(() => {
    const e = parseInt(days) * 24 + parseInt(hours);
    if (!isNaN(e)) {
      setTotalHours(e);
    }
  }, [hours, days]);

  function OnDateSelected(event: DateTimePickerEvent, datei?: Date | null) {
    if (datei) setDate(datei);
  }

  const handleClick = (e: any) => {
    setErr('');
    e.preventDefault();
    if (title.trim() == '' || date == null || desc.trim() == '' || category == null) {
      setErr('Title, Description, DateTime, and Category are required!');
      return;
    }
    if (isNaN(totalHours) || totalHours == 0) {
      setErr('Duration is incorrectly set!');
      return;
    }
    mutation.mutate();
  };

  return (
    <View className="flex-1" style={{ paddingHorizontal: '2%' }}>
      <TouchableOpacity className="absolute left-2 top-6 ml-4 w-7" onPress={() => close(false)}>
        <FontAwesome6 iconStyle="solid" size={25} color="#00E0FF" name="arrow-left" />
      </TouchableOpacity>
      <View className="mt-10 w-[100%] flex-row">
        <Text className="flex-1 text-center text-3xl text-white">Create Event</Text>
      </View>
      <View className="m-3 flex-1 overflow-visible">
        <View>
          <TextInput
            className="rounded-lg border-2 border-gray-600 p-2 text-2xl text-white"
            placeholder="Title"
            onChangeText={setTitle}
          />
        </View>
        <View className="mt-5">
          <TextInput
            multiline={true}
            numberOfLines={3}
            className="rounded-lg border-2 border-gray-600 p-2 text-lg text-white"
            placeholder="Details"
            onChangeText={setDesc}
          />
        </View>

        <View className=" mt-5 ">
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
        <View className="mt-5 rounded-lg border-2 border-gray-500">
          <Text className="ml-4 text-white">Duration</Text>
          <View className="flex-row">
            <View className="mx-4 my-4 flex-1">
              <Text className="text-white">Days</Text>
              <Picker
                style={{ backgroundColor: '#292d3d', color: '#bfc7d4' }}
                selectedValue={days}
                onValueChange={(itemvalue, itemIndex) => setDays(itemvalue)}>
                {daysMap.map((number) => (
                  <Picker.Item key={number} label={number} value={number} />
                ))}
              </Picker>
            </View>
            <View className="mx-4 my-4 flex-1">
              <Text className="text-white">Hours</Text>
              <Picker
                style={{ backgroundColor: '#292d3d', color: '#bfc7d4' }}
                selectedValue={hours}
                numberOfLines={5}
                onValueChange={(itemvalue, itemIndex) => setHours(itemvalue)}>
                {hoursMap.map((number) => (
                  <Picker.Item key={number} label={number} value={number} />
                ))}
              </Picker>
            </View>
          </View>
          <Text className="ml-4 text-white">Total Duration (hrs): {totalHours}</Text>
        </View>

        <View style={{ zIndex: open ? 1000 : 0 }}>
          <Text className="ml-3 mt-5 text-white">Category</Text>

          <DropDownPicker
            placeholder="Select event Category"
            theme="DARK"
            mode="BADGE"
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
            className="rounded-lg border-2 border-gray-600 p-2 text-lg text-white "
            placeholder="Reservation or Ticket Purchasing Link."
            onChangeText={setSite}
          />
        </View>
        <View className="mt-4 items-center justify-center">
          {err && <Text className="text-xl text-red-200">{err}</Text>}
          <TouchableOpacity
            className="rounded-full bg-[#00E0FF] px-10 py-3 text-center text-xl"
            onPress={handleClick}>
            <Text>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Share;
