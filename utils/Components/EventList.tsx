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

export default function EventList({ title, category }: { title: string; category: string }) {
  const { longitude, latitude, user, radius, token } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
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
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.error('Failed to get featured local events');
        }),
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: [category] });
  }, [token]);

  return (
    <View>
      <Modal visible={isModalVisible} transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              width: Platform.OS == 'web' ? 600 : '95%',
              height: Platform.OS == 'web' ? 700 : '85%',
              justifyContent: 'center',
              backgroundColor: '#262626',
            }}
            className="rounded-xl">
            <View
              className="mt-2 flex-1 pt-10 "
              style={{ marginHorizontal: Platform.OS == 'web' ? '10%' : '5%', padding: '2%' }}>
              <TouchableOpacity
                className="absolute left-5 top-5 z-50"
                onPress={() => setIsModalVisible(false)}>
                <FontAwesome6 iconStyle="solid" size={25} color="#BBDEFB" name="arrow-left" />
              </TouchableOpacity>
              <Posts
                header={category}
                querystring={'/events/near?category=' + category + '&radius=' + radius}
                id={user['user']['id']}
                queryKey={category}
                profile={true}
              />
            </View>
          </View>
        </View>
      </Modal>

      <View className="flex-1 overflow-hidden rounded-xl p-2 text-xl text-white">
        <View className="m-5 flex-row items-center justify-between">
          <Text className="text-xl font-bold text-white">{title}</Text>
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            <FontAwesome6 iconStyle="solid" size={20} color="#BBDEFB" name="arrow-right" />
          </TouchableOpacity>
        </View>
        {dataLoading ? (
          <View>
            <LoadingIndicator />
          </View>
        ) : dataError || data == null || data.length == 0 ? (
          <Text className="align-center justify-center text-center text-xl text-white">
            No {title} events near you!
          </Text>
        ) : (
          <FlatList
            className="flex-1 px-2 py-2"
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
