import { View, Text, ScrollView, Modal, TouchableOpacity, Image, Platform } from 'react-native';

import CategoryCard from './CategoryCard';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';

import Animated, { FadeInLeft, FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import Posts from '../Modals/Posts';
import useAuth from '../../Hooks/authContext';
import { useQuery } from '@tanstack/react-query';
import { request } from '../axios';
import { useState } from 'react';

export default function Categories() {
  const [index, setIndex] = useState(0);
  const { user, longitude, latitude, radius } = useAuth();
  const [data, setData] = useState([]);
  const [category, setCategory] = useState('');
  const handleNext = () => {
    setIndex(index + 1);
  };
  const handlePrev = () => {
    setIndex(index - 1);
  };
  const handleClick = (ctg: string) => {
    setCategory(ctg);
    setIsModalVisible(true);
  };
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <View className="w-full bg-black">
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
              width: Platform.OS == 'web' ? 300 : '90%',
              height: Platform.OS == 'web' ? 300 : '85%',
              justifyContent: 'center',
              backgroundColor: '#262626',
              borderRadius: '10%',
            }}>
            <View className="mt-2 flex-1 pt-10 ">
              <TouchableOpacity
                className="absolute left-5 top-5 z-50"
                onPress={() => setIsModalVisible(false)}>
                <FontAwesome6 iconStyle="solid" color="#8500ED" size={25} name="arrow-left" />
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

      {index == 0 && (
        <Animated.View entering={FadeInRight.duration(500)} exiting={FadeOutLeft.duration(500)}>
          <View className="mx-5 flex-row">
            <CategoryCard handleClick={() => handleClick('Drink')}>
              <FontAwesome6 iconStyle="solid" size={15} color="#8500ED" name="glass-water" />
              <Text className="text-center text-sm text-white">Drinks</Text>
            </CategoryCard>
            <CategoryCard handleClick={() => handleClick('Show')}>
              <FontAwesome6 iconStyle="solid" size={15} color="#8500ED" name="film" />
              <Text className="text-center text-sm text-white">Shows</Text>
            </CategoryCard>
            <CategoryCard handleClick={() => handleClick('Music')}>
              <FontAwesome6 color="#8500ED" size={15} iconStyle="solid" name="music" />
              <Text className="text-center text-sm text-white">Music</Text>
            </CategoryCard>
            <CategoryCard handleClick={() => handleClick('Food')}>
              <FontAwesome6 color="#8500ED" size={15} iconStyle="solid" name="utensils" />
              <Text className="text-center text-sm text-white">Food</Text>
            </CategoryCard>
            <CategoryCard handleClick={() => handleClick('Sport')}>
              <FontAwesome6 iconStyle="solid" size={15} color="#8500ED" name="football" />
              <Text className="text-center text-sm text-white">Sports</Text>
            </CategoryCard>
          </View>
          <TouchableOpacity
            className="absolute right-0 top-2 mr-0 w-7 text-white"
            onPress={handleNext}>
            <FontAwesome6 iconStyle="solid" color="#8500ED" name="arrow-right" />
          </TouchableOpacity>
        </Animated.View>
      )}
      {index == 1 && (
        <Animated.View entering={FadeInRight.duration(500)} exiting={FadeOutLeft.duration(500)}>
          <TouchableOpacity className="absolute left-0 top-2 w-7 text-white" onPress={handlePrev}>
            <FontAwesome6 color="#8500ED" size={15} iconStyle="solid" name="arrow-left" />
          </TouchableOpacity>
          <View className="mx-5 flex-row justify-center">
            <CategoryCard handleClick={() => handleClick('Game')}>
              <FontAwesome6 color="#8500ED" size={15} iconStyle="solid" name="gamepad" />
              <Text className="text-center text-sm text-white">Games</Text>
            </CategoryCard>
            <CategoryCard handleClick={() => handleClick('outActivity')}>
              <FontAwesome6 color="#8500ED" size={15} iconStyle="solid" name="sun" />
              <Text className="text-center text-sm text-white">Outdoors</Text>
            </CategoryCard>
            <CategoryCard handleClick={() => handleClick('Classes')}>
              <FontAwesome6 color="#8500ED" size={15} iconStyle="solid" name="school" />
              <Text className="text-center text-sm text-white">Classes</Text>
            </CategoryCard>
          </View>
        </Animated.View>
      )}
    </View>
  );
}
