import { FontAwesome6 } from '@expo/vector-icons';
import useAuth from '../../../Hooks/authContext';
import { useState } from 'react';
import { FlatList, Image, Modal, Platform, Text, TouchableOpacity, View } from 'react-native';
import Posts from '../../../utils/Modals/Posts';

export default function Search() {
  const [category, setCategory] = useState('');

  const { user, radius } = useAuth();

  const handleClick = (ctg: string) => {
    setCategory(ctg);
    setIsModalVisible(true);
  };

  const DATA = [
    {
      id: '1',
      title: 'Drinks',
      background: 'blue',
      category: 'Drink',
      image: <FontAwesome6 iconStyle="solid" size={35} color="blue" name="glass-water" />,
    },
    {
      id: '2',
      title: 'Shows',
      background: 'red',
      category: 'Show',
      image: <FontAwesome6 iconStyle="solid" size={35} color="red" name="film" />,
    },
    {
      id: '3',
      title: 'Shop',
      background: 'purple',
      category: 'Shop',
      image: <FontAwesome6 color="purple" size={35} iconStyle="solid" name="shop" />,
    },
    {
      id: '4',
      title: 'Food',
      background: 'orange',
      category: 'Food',
      image: <FontAwesome6 color="orange" size={35} iconStyle="solid" name="utensils" />,
    },
    {
      id: '5',
      title: 'Sports',
      background: 'green',
      category: 'Sport',
      image: <FontAwesome6 iconStyle="solid" size={35} color="green" name="football" />,
    },
    {
      id: '6',
      title: 'Games',
      background: 'yellow',
      category: 'Game',
      image: <FontAwesome6 color="yellow" size={35} iconStyle="solid" name="gamepad" />,
    },

    {
      id: '7',
      title: 'Music',
      background: 'lightblue',
      category: 'Music',

      image: <FontAwesome6 color="lightblue" size={35} iconStyle="solid" name="music" />,
    },
    {
      id: '8',
      title: 'Outdoors',
      category: 'outActivity',
      background: 'violet',
      image: <FontAwesome6 color="violet" size={35} iconStyle="solid" name="sun" />,
    },
    {
      id: '9',
      title: 'Classes',
      background: 'pink',
      category: 'Classes',

      image: <FontAwesome6 color="pink" size={35} iconStyle="solid" name="school" />,
    },
  ];

  const [isModalVisible, setIsModalVisible] = useState(false);

  const renderItem = ({ item }: { item: any }) => {
    const color = item.background;
    const ctg = item.category;
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          height: 200,
          backgroundColor: '#4c4c4c',
          margin: Platform.OS == 'web' ? '3%' : 5,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => handleClick(ctg)}
        className="rounded-lg shadow-lg">
        <View>{item.image}</View>
        <Text className="text-xl" style={{ color: color }}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

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
                querystring={'/events/near?category=' + category + '&radius=' + radius}
                id={user['user']['id']}
                queryKey={''}
                header={category}
                profile={false}
              />
            </View>
          </View>
        </View>
      </Modal>

      <View className="m-3 flex-1 overflow-visible rounded-lg bg-[#262626]">
        <FlatList
          showsVerticalScrollIndicator={false}
          data={DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          style={{ flex: 1 }}
          contentContainerStyle={{
            flex: 1,
            height: 300,
          }}
        />
      </View>
    </View>
  );
}
