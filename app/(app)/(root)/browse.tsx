import { FontAwesome6 } from '@expo/vector-icons';
import useAuth from '../../../Hooks/authContext';
import { useEffect, useState } from 'react';
import { FlatList, Image, Modal, Platform, Text, TouchableOpacity, View } from 'react-native';
import Posts from '../../../utils/Modals/Posts';
import DropDownPicker from 'react-native-dropdown-picker';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { request } from '../../../utils/axios';
import { SmallEventCard } from '../../../utils/Components/SmallEventCard';
import { Checkbox } from 'expo-checkbox';
import LoadingIndicator from 'utils/Components/LoadingIndicator';
import { LinearGradient } from 'expo-linear-gradient';

export default function Browse() {
  const [value, setvalue] = useState('');

  const { user, radius, latitude, longitude, token } = useAuth();

  const [open, setOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const queryClient = useQueryClient();

  const DATA = [
    {
      label: 'Drinks',
      value: 'Drink',
      icon: <FontAwesome6 iconStyle="solid" size={30} color="#0000CC" name="glass-water" />,
    },
    {
      label: 'Food',
      value: 'Food',
      icon: <FontAwesome6 color="#FF8000" size={30} iconStyle="solid" name="utensils" />,
    },
    {
      label: 'Shows',
      value: 'Show',
      icon: <FontAwesome6 iconStyle="solid" size={30} color="#FF0000" name="film" />,
    },
    {
      label: 'Shop',
      value: 'Shop',
      icon: <FontAwesome6 color="#6600CC" size={30} iconStyle="solid" name="shop" />,
    },

    {
      label: 'Sports',
      value: 'Sport',
      icon: <FontAwesome6 iconStyle="solid" size={30} color="#009900" name="football" />,
    },
    {
      label: 'Games',
      checked: false,
      value: 'Game',
      icon: <FontAwesome6 color="#009999" size={30} iconStyle="solid" name="gamepad" />,
    },

    {
      label: 'Music',
      value: 'Music',
      icon: <FontAwesome6 color="#66ffb2" size={30} iconStyle="solid" name="music" />,
    },
    {
      label: 'Outdoors',
      value: 'outActivity',
      icon: <FontAwesome6 color="#999900" size={30} iconStyle="solid" name="sun" />,
    },
    {
      label: 'Classes',
      value: 'Classes',
      icon: <FontAwesome6 color="#9999FF" size={30} iconStyle="solid" name="school" />,
    },
  ];
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (category != '') queryClient.invalidateQueries({ queryKey: ['browse'] });
  }, [category]);

  function changeColor(color: string, amount: number) {
    const clamp = (val: number) => Math.min(Math.max(val, 0), 0xff);
    const fill = (str: string) => ('00' + str).slice(-2);

    const num = parseInt(color.substr(1), 16);
    const red = clamp((num >> 16) + amount);
    const green = clamp(((num >> 8) & 0x00ff) + amount);
    const blue = clamp((num & 0x0000ff) + amount);
    return '#' + fill(red.toString(16)) + fill(green.toString(16)) + fill(blue.toString(16));
  }

  return (
    <View className="flex-1">
      <View className="w-[100%] flex-row">
        <View className="flex-1 p-0">
          <Image
            source={require('../../../assets/logo4.png')}
            resizeMode="contain"
            style={{
              width: Platform.OS == 'web' ? 100 : 'auto',
              height: Platform.OS == 'web' ? 100 : 'auto',
            }}
          />
        </View>
        <View className="flex-1 flex-col justify-center">
          <View className=" h-7 flex-col">
            <Text className="text-center text-lg font-bold text-white">Browse</Text>
          </View>
        </View>
        <View className="flex-1" />
      </View>
      <Modal visible={isModalVisible} transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View className="w-full flex-1 bg-black">
            <View
              className="mt-2 flex-1 pt-10 "
              style={{ marginHorizontal: Platform.OS == 'web' ? '5%' : '2%', padding: '2%' }}>
              <TouchableOpacity
                className="absolute left-5 top-3 z-50"
                onPress={() => setIsModalVisible(false)}>
                <FontAwesome6 iconStyle="solid" color="#BBDEFB" size={25} name="arrow-left" />
              </TouchableOpacity>
              <Posts
                querystring={'/events/near?category=' + category + '&radius=' + radius}
                id={user['user']['id']}
                queryKey={''}
                header={value}
                profile={false}
              />
            </View>
          </View>
        </View>
      </Modal>

      <View className="mb-2 h-full flex-1 items-center overflow-visible rounded-lg bg-[#262626]">
        <Text className="w-[50%] text-wrap text-center text-lg text-white">
          Find exactly what you’re looking for —{' '}
          <Text className="font-bold">
            restaurant offers, drink deals, shows, live music, watch parties, classes, shopping
          </Text>
          , and more.
        </Text>

        <View className="w-full flex-1">
          <FlatList
            showsVerticalScrollIndicator={false}
            className="flex-1 items-center justify-items-center"
            data={DATA}
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              let color = item.icon.props['color'];

              return (
                <LinearGradient
                  colors={[changeColor(color, 0.001), color]}
                  className="m-2 items-center rounded-lg">
                  <TouchableOpacity
                    onPress={() => {
                      setCategory(item.value);
                      setIsModalVisible(true);
                    }}
                    style={{
                      padding: 10,
                      margin: 5,
                      height: 150,
                      width: 300,
                    }}
                    className="flex-row items-center rounded-lg">
                    <View className="absolute right-2 top-2">{item.icon}</View>
                    <Text className="mx-2 flex-1 text-center text-2xl font-bold text-white">
                      {item.label}
                    </Text>
                    {/* <CheckBox value={item?.checked} onValueChange={() => test(index)} /> */}
                  </TouchableOpacity>
                </LinearGradient>
              );
            }}
          />
        </View>
      </View>
    </View>
  );
}
