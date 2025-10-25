import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';
export default function EventCard({ title, desc, time, date, businessid }) {
  return (
    <TouchableOpacity
      className="flex-1 rounded-md
         bg-white shadow-sm shadow-blue-500">
      <View>
        <Text className="absolute left-0 top-0 ml-2 text-base font-bold text-white">{title}</Text>
        <Text className="text-s ml-2 mt-5 text-white">{desc}</Text>
        <Text className="text-s ml-2 mt-5 text-white">{date}</Text>
        <Text className="text-s ml-2 mt-5 text-white">{time}</Text>
      </View>

      <View className="mb-2 ml-2">
        <MapPinIcon />
      </View>
    </TouchableOpacity>
  );
}
