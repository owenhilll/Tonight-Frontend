import {
  ArrowLeftIcon,
  BookmarkIcon,
  CalendarDateRangeIcon,
  InformationCircleIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../Hooks/authContext';

import {
  Alert,
  FlatList,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { request } from '../axios';
import { useEffect, useState } from 'react';
import Modal from 'react-native-modal';

import { DateSelection } from '../DateTimePicker';
import { Post } from '../Components/Post';

export default function Posts({
  id,
  querystring,
  queryKey,
  profile,
  header,
}: {
  id: string;
  profile: boolean;
  querystring: any | undefined;
  queryKey: string;
  header: string;
}) {
  const queryClient = useQueryClient();
  const { longitude, latitude, user, radius } = useAuth();

  const {
    isLoading: dataLoading,
    error: dataError,
    data: data,
  } = useQuery({
    queryKey: [queryKey + 'full'],
    queryFn: () =>
      request
        .get(querystring, {
          params: {
            y: latitude,
            x: longitude,
          },
        })
        .then((res) => {
          return res.data;
        }),
  });
  const [modifiedHeader, setModifiedHeader] = useState('');
  useEffect(() => {
    switch (header) {
      case 'Show':
        setModifiedHeader('Shows/Movies');
        break;
      case 'Drink':
        setModifiedHeader('Drinks');
        break;
      case 'Food':
        setModifiedHeader('Food/Meals');
        break;
      case 'Game':
        setModifiedHeader('Games (non-sporting)');
        break;
      case 'outActivity':
        setModifiedHeader('Outdoor Activities');
        break;
      case 'Classes':
        setModifiedHeader('Classes');
        break;
      case 'Music':
        setModifiedHeader('Concerts and DJs');
        break;
      case 'Sport':
        setModifiedHeader('Sporting Events');
        break;
      default:
        break;
    }
  }, []);

  return (
    <View className="flex-1">
      <Text className="mt-0 text-center text-3xl text-white">{modifiedHeader}</Text>
      {data && data.length > 0 ? (
        <ScrollView>
          <FlatList
            data={data}
            renderItem={({ item }) => <Post item={item} profile={profile} queryKey={queryKey} />}
            keyExtractor={(item) => item.id.toString()}
            initialNumToRender={5}></FlatList>
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center">
          {profile ? (
            <Text></Text>
          ) : (
            <View className="">
              <Text className="text-center text-2xl text-white">No events.</Text>
              <Text className="text-center text-sm text-white">
                Try expanding your search radius in home page!
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
