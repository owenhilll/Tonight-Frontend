import { View, Text, ScrollView, FlatList, TouchableOpacity, Image, Platform } from 'react-native';
import React, { useState } from 'react';
import EventCard from '../Modals/EventCard';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BackwardIcon,
  CalendarDateRangeIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../Hooks/authContext';
import { request } from '../axios';
import { useRouter } from 'expo-router';
import Modal from 'react-native-modal';
import Posts from '../Modals/Posts';
export default function EventList({ title, category }: { title: string; category: string }) {
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

  const [showEventModal, setShowEventModal] = useState(false);

  const Item = ({ item }: { item: any }) => {
    const date = new Date(item.date);
    let options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    let time = date.toLocaleTimeString('en-US', options);
    const [profileUri, setProfileUri] = useState('');

    request
      .get(`/businesses/profilepic?id=${item['businessid']}&fetchtype=getObject`)
      .then((json) => {
        setProfileUri(json.data);
      });

    return (
      <View className="mx-2">
        <Modal
          isVisible={showEventModal}
          style={{
            backgroundColor: '#262626',
            borderRadius: 10,
            margin: Platform.OS == 'web' ? '15%' : 20,
            paddingTop: 20,
          }}>
          <TouchableOpacity
            className="ml-5 mt-5 h-8 w-8 text-white"
            onPress={() => setShowEventModal(false)}>
            <ArrowLeftIcon className="h-8 w-8 text-white" />
          </TouchableOpacity>
          <EventCard item={item} date={date} time={time} />
        </Modal>
        <TouchableOpacity
          onPress={() => setShowEventModal(true)}
          className="mx-1 w-80 rounded-2xl border-2 border-purple-300 bg-[#4c4c4c] p-2 shadow-orange-50">
          <View className="flex-row">
            <View className="flex-column h-48 w-44">
              <Text className="mb-5 ml-2 flex-1 text-xl font-bold text-white">{item.title}</Text>
              <View className="mt-4 flex-row items-center justify-center">
                <InformationCircleIcon className="w-8" />
                <Text className="text-s ml-2 flex-1 text-white">{item.desc}</Text>
              </View>
              <View className="mt-4 flex-row items-center justify-center">
                <CalendarDateRangeIcon className="w-8" />
                <Text className="text-s ml-2 flex-1 text-white">
                  {date.toDateString()} - {time}
                </Text>
              </View>
            </View>
            <View className=" border-1 mb-3 ml-5 h-24 w-24 items-center justify-center overflow-hidden rounded-full border-purple-500 bg-white shadow-sm shadow-white">
              <Image
                style={{ width: 90, height: 90, margin: 0, padding: 0 }}
                className="h-auto w-auto"
                resizeMode="center"
                source={{
                  uri: profileUri,
                }}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View>
      <Modal
        isVisible={isModalVisible}
        style={{
          backgroundColor: '#262626',
          borderRadius: 10,
          margin: Platform.OS == 'web' ? '10%' : 20,
          paddingTop: 20,
        }}>
        <TouchableOpacity className="ml-5 mt-5" onPress={() => setIsModalVisible(false)}>
          <ArrowLeftIcon className="w-8 text-white" />
        </TouchableOpacity>
        <Posts data={data} id={user['user']['id']} queryKey={category} profile={true} />
      </Modal>

      <View className="flex-1 rounded-xl border-2 border-purple-800 p-2 text-xl text-white">
        <View className="m-5 flex-row items-center justify-between">
          <Text className="font-bold text-white">{title}</Text>
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            <ArrowRightIcon color={'#8500ED'} width={20} />
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
            renderItem={({ item }) => <Item item={item} />}
            keyExtractor={(item) => item.id.toString()}
            initialNumToRender={5}></FlatList>
        )}
      </View>
    </View>
  );
}
