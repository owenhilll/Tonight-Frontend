import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';

export default function MovieShowCard({ showtime, name, price }) {
  return (
    <TouchableOpacity
      className="mb-2 mr-4 h-40 w-60 rounded-lg 
        bg-white shadow-sm shadow-blue-500">
      <View>
        <Text className="absolute left-0 top-0 ml-2 text-base font-bold text-black">{name}</Text>
        <Text className="text-s ml-2 mt-5 text-black">{showtime}</Text>
      </View>

      <View className="absolute bottom-0 left-0 mb-2 ml-2">
        <MapPinIcon></MapPinIcon>
      </View>
    </TouchableOpacity>
  );
}
