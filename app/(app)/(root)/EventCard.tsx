import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { request } from '../../../utils/axios';
export default function EventCard({ item }: { item: any }) {
  const [profileUri, setProfileUri] = useState('');
  const [business, setB] = useState(null);

  request
    .get(`/businesses/profilepic?id=${item['businessid']}&fetchtype=getObject`)
    .then((json) => {
      setProfileUri(json.data);
    });

  request.get(`/businesses/find/${item['businessid']}`).then((json) => {
    setProfileUri(json.data);
  });

  return (
    <TouchableOpacity className="flex-1 rounded-md shadow-sm shadow-blue-500">
      <View>
        <Text className="ml-2 text-base font-bold text-white">Profile pic</Text>
        <Text className="text-s ml-2 font-bold text-white">title</Text>
        <Text className="text-s ml-2 mt-5 text-white">desc</Text>
        <Text className="text-s ml-2 mt-5 text-white">date</Text>
        <Text className="text-s ml-2 mt-5 text-white">timr</Text>
        <Text className="text-s ml-2 mt-5 text-white">Reservation portal</Text>
        <Text className="text-s ml-2 mt-5 text-white">Bookmark</Text>
        <Text className="text-s ml-2 mt-5 text-white">Share</Text>
      </View>

      <View className="mb-2 ml-2">
        <MapPinIcon className="w-10" />
      </View>
    </TouchableOpacity>
  );
}
