import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  ArrowUpOnSquareStackIcon,
  BookmarkIcon,
  MapPinIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import { request } from '../axios';
export default function EventCard({ item, date, time }: { item: any; date: Date; time: string }) {
  const [profileUri, setProfileUri] = useState('');
  const [business, setBusiness] = useState<any>();

  useEffect(() => {
    request
      .get(`/businesses/profilepic?id=${item['businessid']}&fetchtype=getObject`)
      .then((json) => {
        setProfileUri(json.data);
      });

    request.get(`/businesses/find/${item['businessid']}`).then((json) => {
      setBusiness(json.data);
    });
  }, []);

  return (
    <View className="h-full py-10">
      <View className="mx-5">
        <View className="border-b-2 border-purple-400 pb-5">
          <View className="mb-3 items-center justify-center overflow-hidden rounded-full border-2 border-purple-800 bg-white shadow-lg shadow-white">
            <Image
              style={{ width: 150, height: 150, margin: 0, padding: 0 }}
              resizeMode="contain"
              source={{
                uri: profileUri,
              }}
            />
          </View>
          <Text className="text-center text-3xl font-bold text-white">{business?.name}</Text>
          <View className="mt-5 flex-row justify-center">
            <MapPinIcon className="w-7 text-blue-500" />
            <Text className="text-lg text-white">{business?.address}</Text>
          </View>
        </View>
        <Text className="mt-5 text-center text-5xl text-white">{item.title}</Text>
        <Text className="mt-5 text-center text-xl text-white">{item.desc}</Text>
        <Text className="mt-5 text-center text-2xl text-white">
          {date.toDateString()} - {time}
        </Text>
        <View className="my-10 flex-1 flex-row">
          <TouchableOpacity className="flex-1">
            {item.url && (
              <Text className="text-center text-lg text-white underline">
                Reserve or Purchase Tickets
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 items-center justify-center">
            <BookmarkIcon className="w-7 text-white" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 items-center justify-center">
            <ArrowUpOnSquareStackIcon className="w-7 text-white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
