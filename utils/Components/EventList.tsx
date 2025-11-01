import { View, Text, ScrollView, FlatList, TouchableOpacity, Image, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';

import { useQuery } from '@tanstack/react-query';
import useAuth from '../../Hooks/authContext';
import { request } from '../axios';
import { useRouter } from 'expo-router';
import Modal from 'react-native-modal';
import Posts from '../Modals/Posts';
import { SmallEventCard } from './SmallEventCard';
export default function EventList({ title, category }: { title: string; category: string }) {
  const { longitude, latitude, user, radius } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();
  const {
    isLoading: dataLoading,
    error: dataError,
    data: data,
  } = useQuery({
    queryKey: [category],
    queryFn: () =>
      request
        .get('/events/near?category=' + category + '&radius=' + radius + '&limit=' + true, {
          params: {
            y: latitude,
            x: longitude,
          },
        })
        .then((res) => {
          return res.data;
        }),
  });

  return (
    <View>
      <Modal
        isVisible={isModalVisible}
        style={{
          backgroundColor: 'black',
          borderRadius: 10,
          shadowColor: 'white',
          shadowRadius: 2,
          margin: Platform.OS == 'web' ? '10%' : 20,
          paddingTop: 10,
        }}>
        <TouchableOpacity
          className="absolute left-5 top-5 z-50"
          onPress={() => setIsModalVisible(false)}>
          <FontAwesome6 iconStyle="solid" color="#8500ED" name="arrow-left" />
        </TouchableOpacity>
        <Posts
          header={category}
          querystring={'/events/near?category=' + category + '&radius=' + radius}
          id={user['user']['id']}
          queryKey={category}
          profile={true}
        />
      </Modal>

      <View className="flex-1 overflow-hidden rounded-xl border-2 border-purple-800 bg-[#262626] p-2 text-xl text-white">
        <View className="m-5 flex-row items-center justify-between">
          <Text className="font-bold text-white">{title}</Text>
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            <FontAwesome6 iconStyle="solid" color="#8500ED" name="arrow-right" />
          </TouchableOpacity>
        </View>
        {dataError || data == null ? (
          <Text className="align-center justify-center text-center text-xl text-white">
            No {title} events near you!
          </Text>
        ) : (
          <FlatList
            className="flex-1 px-2 pb-2"
            data={data}
            horizontal={true}
            renderItem={({ item }) => <SmallEventCard item={item} />}
            keyExtractor={(item) => item.id.toString()}
            initialNumToRender={5}></FlatList>
        )}
      </View>
    </View>
  );
}
