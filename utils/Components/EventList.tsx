import {
  View,
  Text,
  ScrollView,
  Modal,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { FontAwesome6 } from '@expo/vector-icons';
import LoadingIndicator from './LoadingIndicator';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../Hooks/authContext';
import { request } from '../axios';
import { useRouter } from 'expo-router';
import Posts from '../Modals/Posts';
import { SmallEventCard } from './SmallEventCard';

export default function EventList({
  title,
  queryKey,
  nearest = false,
}: {
  title: string;
  queryKey: string;
  nearest?: boolean;
}) {
  const { longitude, latitude, user, radius, token } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [data, setData] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  if (longitude != undefined && latitude != undefined) {
    request
      .get(queryKey, {
        params: {
          y: latitude,
          x: longitude,
          radius: radius,
        },
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setData(res.data);
        setDataLoading(false);
      })
      .catch((err) => {
        console.error('Failed to get featured local events');
        setDataLoading(false);
      });
  } else {
    return [];
  }

  return (
    <View>
      <View className="flex-1 overflow-hidden rounded-xl p-2 text-xl text-white">
        <View className="m-5 flex-row items-center justify-between">
          <Text className="text-xl font-bold text-white">{title}</Text>
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            <FontAwesome6 iconStyle="solid" size={20} color="#00E0FF" name="arrow-right" />
          </TouchableOpacity>
        </View>
        {dataLoading ? (
          <View>
            <LoadingIndicator />
          </View>
        ) : data == null || data.length == 0 ? (
          <Text className="align-center justify-center text-center text-xl text-white">
            No {title} events near you!
          </Text>
        ) : (
          <FlatList
            className="flex-1 px-2 py-2"
            data={data}
            horizontal={true}
            renderItem={({ item }) => <SmallEventCard item={item} nearest={nearest} />}
            keyExtractor={(item: any) => item.id.toString()}
            initialNumToRender={5}
          />
        )}
      </View>
    </View>
  );
}
