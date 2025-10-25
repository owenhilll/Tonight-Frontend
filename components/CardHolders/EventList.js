import { View, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';
import EventCard from '../Cards/EventCard';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import useAuth from 'Hooks/authContext';
import { request } from 'utils/axios';
export default function EventList({ title, category }) {
  const { longitude, latitude } = useAuth();

  const {
    isLoading: dataLoading,
    error: dataError,
    data: data,
  } = useQuery({
    queryKey: [category],
    queryFn: () =>
      request
        .get('/events/near?category=' + category, {
          params: {
            y: latitude,
            x: longitude,
          },
        })
        .then((res) => {
          return res.data;
        }),
  });

  const Item = ({ item }) => {
    const date = new Date(item.date);
    let options = { hour: 'numeric', minute: 'numeric', hour12: true };
    let time = date.toLocaleTimeString('en-US', options);

    return (
      <TouchableOpacity className="w-48 rounded-2xl border-2 border-purple-300 p-2 shadow-orange-50">
        <Text className=" mb-5 ml-2 text-base font-bold text-white">{item.title}</Text>
        <Text className="text-s ml-2 text-white">{item.desc}</Text>
        <Text className="text-s ml-2 mt-5 text-white">{date.toDateString()}</Text>
        <Text className="text-s ml-2 mt-1 text-white">{time}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 rounded-xl border-2 border-purple-400 p-2 text-xl text-white">
      <View className="m-5 flex-row items-center justify-between">
        <Text className="font-bold text-white">{title}</Text>
        <ArrowRightIcon color={'#8500ED'} width={20} />
      </View>
      {dataError || data == null ? (
        <Text className="align-center justify-center text-center text-xl text-white">
          No {title} near you!
        </Text>
      ) : (
        <FlatList
          className="flex-1 px-2 pb-2"
          data={data}
          renderItem={({ item }) => <Item item={item} />}
          keyExtractor={(item) => item.id.toString()}
          initialNumToRender={5}></FlatList>
      )}
    </View>
  );
}
