import { View, Text, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';

import CategoryCard from './CategoryCard';
import SportsBarIcon from '@mui/icons-material/SportsBarRounded';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import CasinoIcon from '@mui/icons-material/Casino';
import SunnyIcon from '@mui/icons-material/Sunny';
import SchoolIcon from '@mui/icons-material/School';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import { useState } from 'react';

import {
  ArrowLeftCircleIcon,
  ArrowLeftIcon,
  ArrowRightCircleIcon,
  ArrowRightIcon,
  SunIcon,
} from '@heroicons/react/24/outline';

import Animated, { FadeInLeft, FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import Modal from 'react-native-modal';
import Posts from '../Modals/Posts';
import useAuth from '../../Hooks/authContext';
import { useQuery } from '@tanstack/react-query';
import { request } from '../axios';

export default function Categories() {
  const [index, setIndex] = useState(0);
  const { user, longitude, latitude } = useAuth();
  const [data, setData] = useState([]);

  const handleNext = () => {
    setIndex(index + 1);
  };
  const handlePrev = () => {
    setIndex(index - 1);
  };
  const handleClick = (ctg: string) => {
    request
      .get('/events/near?category=' + ctg, {
        params: {
          y: latitude,
          x: longitude,
        },
      })
      .then((res) => {
        return setData(res.data);
      });
    setIsModalVisible(true);
  };
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <View className="bg-black">
      <Modal
        isVisible={isModalVisible}
        style={{
          backgroundColor: '#262626',
          borderRadius: 10,
          margin: Platform.OS == 'web' ? '10%' : 20,
          paddingTop: 20,
        }}>
        <TouchableOpacity className="ml-5 mt-5" onPress={() => setIsModalVisible(false)}>
          <ArrowLeftIcon className="w-8 text-white" />
        </TouchableOpacity>
        <Posts data={data} id={user['user']['id']} queryKey={''} profile={false} />
      </Modal>

      {index == 0 && (
        <Animated.View entering={FadeInRight.duration(500)} exiting={FadeOutLeft.duration(500)}>
          <View className="flex-row">
            <CategoryCard handleClick={() => handleClick('Drink')}>
              <SportsBarIcon sx={{ color: '#8500ED' }} />
              <Text className="text-center text-sm text-white">Drinks</Text>
            </CategoryCard>
            <CategoryCard handleClick={() => handleClick('Show')}>
              <SlideshowIcon sx={{ color: '#8500ED' }} />
              <Text className="text-center text-sm text-white">Movies/Shows</Text>
            </CategoryCard>
            <CategoryCard handleClick={() => handleClick('Music')}>
              <MusicNoteIcon sx={{ color: '#8500ED' }} />
              <Text className="text-center text-sm text-white">Music</Text>
            </CategoryCard>
            <CategoryCard handleClick={() => handleClick('Food')}>
              <FastfoodIcon sx={{ color: '#8500ED' }} />
              <Text className="text-center text-sm text-white">Food</Text>
            </CategoryCard>
            <CategoryCard handleClick={() => handleClick('Sport')}>
              <SportsFootballIcon sx={{ color: '#8500ED' }} />
              <Text className="text-center text-sm text-white">Sports</Text>
            </CategoryCard>
            <TouchableOpacity className="absolute right-0 top-2 mr-5 w-7 text-white">
              <ArrowRightIcon className="w-7 text-white" onClick={handleNext} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
      {index == 1 && (
        <Animated.View entering={FadeInRight.duration(500)} exiting={FadeOutLeft.duration(500)}>
          <View className="flex-row justify-center">
            <TouchableOpacity className="absolute left-0 top-2 ml-5 w-7 text-white">
              <ArrowLeftIcon className="w-7 text-white" onClick={handlePrev} />
            </TouchableOpacity>
            <CategoryCard handleClick={() => handleClick('Game')}>
              <CasinoIcon sx={{ color: '#8500ED' }} />
              <Text className="text-center text-sm text-white">Games</Text>
            </CategoryCard>
            <CategoryCard handleClick={() => handleClick('outActivity')}>
              <SunnyIcon sx={{ color: '#8500ED' }} />
              <Text className="text-center text-sm text-white">Outdoor Activites</Text>
            </CategoryCard>
            <CategoryCard handleClick={() => handleClick('Classes')}>
              <SchoolIcon sx={{ color: '#8500ED' }} />
              <Text className="text-center text-sm text-white">Classes</Text>
            </CategoryCard>
          </View>
        </Animated.View>
      )}
    </View>
  );
}
