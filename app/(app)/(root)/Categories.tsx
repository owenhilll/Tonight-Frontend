import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';

import CategoryCard from './CategoryCard';
import SportsBarIcon from '@mui/icons-material/SportsBarRounded';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import CasinoIcon from '@mui/icons-material/Casino';
import SunnyIcon from '@mui/icons-material/Sunny';

import { useState } from 'react';

import {
  ArrowLeftCircleIcon,
  ArrowLeftIcon,
  ArrowRightCircleIcon,
  ArrowRightIcon,
  SunIcon,
} from '@heroicons/react/24/outline';

import Animated, { FadeInLeft, FadeInRight, FadeOutLeft } from 'react-native-reanimated';

export default function Categories() {
  const [index, setIndex] = useState(0);
  const handleNext = () => {
    setIndex(index + 1);
  };
  const handlePrev = () => {
    setIndex(index - 1);
  };
  return (
    <View>
      {index == 0 && (
        <Animated.View entering={FadeInRight.duration(500)} exiting={FadeOutLeft.duration(500)}>
          <View className="mt-[2%] flex-row">
            <CategoryCard>
              <SportsBarIcon sx={{ color: '#8500ED' }} />
              <Text className="text-center text-sm text-white">Drinks</Text>
            </CategoryCard>
            <CategoryCard>
              <SlideshowIcon sx={{ color: '#8500ED' }} />
              <Text className="text-center text-sm text-white">Movies/Shows</Text>
            </CategoryCard>
            <CategoryCard>
              <MusicNoteIcon sx={{ color: '#8500ED' }} />
              <Text className="text-center text-sm text-white">Music</Text>
            </CategoryCard>
            <CategoryCard>
              <LocalOfferIcon sx={{ color: '#8500ED' }} />
              <Text className="text-center text-sm text-white">Deals</Text>
            </CategoryCard>
            <CategoryCard>
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
          <View className="mt-[2%] flex-row justify-center">
            <TouchableOpacity className="absolute left-0 top-2 ml-5 w-7 text-white">
              <ArrowLeftIcon className="w-7 text-white" onClick={handlePrev} />
            </TouchableOpacity>
            <CategoryCard>
              <CasinoIcon sx={{ color: '#8500ED' }} />
              <Text className="text-center text-sm text-white">Games</Text>
            </CategoryCard>
            <CategoryCard>
              <SunnyIcon sx={{ color: '#8500ED' }} />
              <Text className="text-center text-sm text-white">Outdoor Activites</Text>
            </CategoryCard>
          </View>
        </Animated.View>
      )}
    </View>
  );
}
