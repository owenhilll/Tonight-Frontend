import { View, Text, ScrollView, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import EventCard from '../Cards/EventCard';
import { ArrowLeftIcon, ArrowRightIcon, BackwardIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import useAuth from 'Hooks/authContext';
import { request } from 'utils/axios';
import { useRouter } from 'expo-router';
import Modal from 'react-native-modal';
import Posts from '../../app/(app)/(root)/Posts';
export default function EventList({ title, category }) {
  const { longitude, latitude, user } = useAuth();
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
    const [profileUri, setProfileUri] = useState('');

    request
      .get(`/businesses/edit/profilepic?id=${item['businessid']}&fetchtype=getObject`)
      .then((json) => {
        setProfileUri(json.data);
      });

    return (
      <TouchableOpacity className="mx-1 w-auto rounded-2xl border-2 border-purple-300 p-2 shadow-orange-50">
        <View className="flex-row">
          <View className="flex-column">
            <Text className=" mb-5 ml-2 text-base font-bold text-white">{item.title}</Text>
            <Text className="text-s ml-2 text-white">{item.desc}</Text>
            <Text className="text-s ml-2 mt-5 text-white">{date.toDateString()}</Text>
            <Text className="text-s ml-2 mt-1 text-white">{time}</Text>
          </View>
          <View className=" border-1 mb-3 ml-2 h-[50%] overflow-hidden rounded-full border-purple-500 shadow-sm shadow-white">
            <Image
              style={{ width: 90, height: 90, margin: 0, padding: 0 }}
              resizeMode="center"
              source={{
                uri: profileUri,
              }}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <Modal
        isVisible={isModalVisible}
        style={{
          backgroundColor: '#262626',
          borderRadius: 10,
          margin: 20,
          paddingLeft: 10,
          paddingTop: 10,
        }}>
        <TouchableOpacity onPress={() => setIsModalVisible(false)}>
          <ArrowLeftIcon width={20} className="text-white" />
        </TouchableOpacity>
        <Posts data={data} id={user['user']['id']} />
      </Modal>
      <View className="flex-1 rounded-xl border-2 border-purple-400 p-2 text-xl text-white">
        <View className="m-5 flex-row items-center justify-between">
          <Text className="font-bold text-white">{title}</Text>
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            <ArrowRightIcon color={'#8500ED'} width={20} />
          </TouchableOpacity>
        </View>
        {dataError || data == null ? (
          <Text className="align-center justify-center text-center text-xl text-white">
            No {title} near you!
          </Text>
        ) : (
          <FlatList
            className="flex-1 px-2 pb-2"
            data={data}
            horizontal={true}
            renderItem={({ item }) => <Item item={item} />}
            keyExtractor={(item) => item.id.toString()}
            initialNumToRender={5}></FlatList>
        )}
      </View>
    </View>
  );
}
