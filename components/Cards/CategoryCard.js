import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';

export default function CategoryCard({ imgUrl, title }) {
  return (
    <TouchableOpacity className="relative mr-2 h-[10vh] w-[10vw] items-center bg-black shadow-white">
      <View className="flex-1 justify-center">
        <Image source={imgUrl} className="w-30 h-30 " />
      </View>

      <Text className="text-center align-bottom font-bold text-white">{title}</Text>
    </TouchableOpacity>
  );
}
