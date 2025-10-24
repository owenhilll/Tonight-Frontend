import { View, Text, ScrollView, FlatList } from 'react-native';
import React from 'react';
import SportsCard from '../Cards/SportsCard';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import useAuth from 'Hooks/authContext';
import { request } from 'utils/axios';
export default function EventList({ title, category }) {
  const { coords } = useAuth();
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
            x: coords.x,
            y: coords.y,
          },
        })
        .then((res) => {
          return res.data;
        }),
  });

  const item = ({ item }) => {
    <SportsCard
      team={'Braves'}
      opponent={'yankees'}
      price={'$25'}
      theme={'BobbleHead'}
      logo={'wait'}
    />;
  };

  return (
    <View className="flex-1 overflow-hidden rounded-[5%] border-2 border-purple-400 p-2 text-xl text-white">
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
          data={data}
          renderItem={item}
          keyExtractor={(item) => item.id.toString()}
          initialNumToRender={5}></FlatList>
      )}
    </View>
  );
}
