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
      icon: <FontAwesome6 iconStyle="solid" size={20} color="blue" name="glass-water" />,
    },
    {
      label: 'Food',
      value: 'Food',
      icon: <FontAwesome6 color="orange" size={20} iconStyle="solid" name="utensils" />,
    },
    {
      label: 'Shows',
      value: 'Show',
      icon: <FontAwesome6 iconStyle="solid" size={20} color="red" name="film" />,
    },
    {
      label: 'Shop',
      value: 'Shop',
      icon: <FontAwesome6 color="purple" size={20} iconStyle="solid" name="shop" />,
    },

    {
      label: 'Sports',
      value: 'Sport',
      icon: <FontAwesome6 iconStyle="solid" size={20} color="green" name="football" />,
    },
    {
      label: 'Games',
      checked: false,
      value: 'Game',
      icon: <FontAwesome6 color="violet" size={20} iconStyle="solid" name="gamepad" />,
    },

    {
      label: 'Music',
      value: 'Music',
      icon: <FontAwesome6 color="lightblue" size={20} iconStyle="solid" name="music" />,
    },
    {
      label: 'Outdoors',
      value: 'outActivity',
      icon: <FontAwesome6 color="yellow" size={20} iconStyle="solid" name="sun" />,
    },
    {
      label: 'Classes',
      value: 'Classes',
      icon: <FontAwesome6 color="pink" size={20} iconStyle="solid" name="school" />,
    },
  ];
  const [category, setCategory] = useState('Drink');

  const {
    isLoading: dataLoading,
    error: dataError,
    data: data,
  } = useQuery({
    queryKey: ['browse'],
    queryFn: () =>
      request
        .get('/events/near?category=' + category + '&radius=' + radius, {
          params: {
            y: latitude,
            x: longitude,
          },
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          return res.data;
        }),
  });

  useEffect(() => {
    if (category != '') queryClient.invalidateQueries({ queryKey: ['browse'] });
  }, [category]);

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
          <View
            style={{
              width: Platform.OS == 'web' ? 600 : '90%',
              height: Platform.OS == 'web' ? 700 : '85%',
              justifyContent: 'center',
              backgroundColor: 'black',
            }}
            className="rounded-xl">
            <View
              className="mt-2 flex-1 pt-10 "
              style={{ marginHorizontal: Platform.OS == 'web' ? '10%' : '5%', padding: '2%' }}>
              <TouchableOpacity
                className="absolute left-5 top-5 z-50"
                onPress={() => setIsModalVisible(false)}>
                <FontAwesome6 iconStyle="solid" color="#BBDEFB" size={25} name="arrow-left" />
              </TouchableOpacity>
              <Posts
                querystring={'/events/near?value=' + value + '&radius=' + radius}
                id={user['user']['id']}
                queryKey={''}
                header={value}
                profile={false}
              />
            </View>
          </View>
        </View>
      </Modal>

      <View className="mb-2 flex-1 items-center overflow-visible rounded-lg bg-[#262626]">
        <Text className="w-[50%] text-wrap text-center text-lg text-white">
          Find exactly what you’re looking for —{' '}
          <Text className="font-bold">
            restaurant offers, drink deals, shows, live music, watch parties, classes, shopping
          </Text>
          , and more.
        </Text>

        <View className="w-[100%] flex-1" style={{ flexDirection: 'row' }}>
          <View>
            <FlatList
              className="flex-none rounded-lg "
              data={DATA}
              numColumns={1}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => {
                const color = item.icon.props['color'];

                return (
                  <TouchableOpacity
                    onPress={() => setCategory(item.value)}
                    style={{
                      padding: 10,
                      margin: 5,
                      borderWidth: category == item.value ? 5 : 1,
                      borderColor: color,
                    }}
                    className="flex-1 flex-row items-center rounded-lg bg-[#000000]">
                    <View>{item.icon}</View>
                    <Text className="mx-2 flex-1 text-center text-lg" style={{ color: color }}>
                      {item.label}
                    </Text>
                    {/* <CheckBox value={item?.checked} onValueChange={() => test(index)} /> */}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
          <View className="flex-1">
            {data?.length == 0 && !dataLoading ? (
              <View className="flex-1 justify-center">
                <Text className=" text-center text-xl text-white">
                  No {category} Events in your Area!
                </Text>
              </View>
            ) : dataLoading ? (
              <LoadingIndicator />
            ) : (
              <FlatList
                className="flex-1"
                numColumns={2}
                data={data}
                renderItem={({ item }) => (
                  <View className="my-[2%] w-[50%] items-center justify-center">
                    <SmallEventCard item={item} />
                  </View>
                )}
                keyExtractor={(item) => item.id.toString()}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
