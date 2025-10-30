import useAuth from '../../Hooks/authContext';
import { request } from '../axios';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, Image, Platform } from 'react-native';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BackwardIcon,
  BookmarkIcon,
  CalendarDateRangeIcon,
  EyeIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
//for use in rendering events in the home page (the horizontal list)
export const SmallEventCard = ({ item }: { item: any }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const bookmarkItem = async () => {
    const eventid = item.id;
    const businessid = item.businessid;
    const userid = user['user']['id'];
    await request
      .post('/bookmarks/add', { eventid, businessid, userid })
      .then((res) => {
        queryClient.invalidateQueries({
          queryKey: ['bookmarks' + item.id + '' + user['user']['id']],
        });
        queryClient.invalidateQueries({
          queryKey: ['bookmarks' + item.id],
        });
      })
      .catch((err) => {});
  };

  const removeBookmark = async () => {
    const eventid = item.id;
    const businessid = item.businessid;
    const userid = user['user']['id'];
    await request
      .delete('/bookmarks/delete?userid=' + userid + '&eventid=' + eventid)
      .then((res) => {
        queryClient.invalidateQueries({
          queryKey: ['bookmarks' + item.id + '' + user['user']['id']],
        });
        queryClient.invalidateQueries({
          queryKey: ['bookmarks' + item.id],
        });
      })
      .catch((err) => {});
  };

  const {
    isLoading: bookmarkedLoading,
    error: bookmarkedError,
    data: bookmarked,
  } = useQuery({
    queryKey: ['bookmarks' + item.id + '' + user['user']['id']],
    queryFn: () =>
      request
        .get('/bookmarks/get?userid=' + user['user']['id'] + '&eventid=' + item.id)
        .then((res) => {
          return res.data.length == 1;
        }),
  });

  const {
    isLoading: bookmarksLoading,
    error: bookmarksError,
    data: bookmarks,
  } = useQuery({
    queryKey: ['bookmarks' + item.id],
    queryFn: () =>
      request.get('/bookmarks/get?eventid=' + item.id).then((res) => {
        return res.data.length;
      }),
  });

  const date = new Date(item.date);
  let options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
  let time = date.toLocaleTimeString('en-US', options);
  const [profileUri, setProfileUri] = useState('');
  //fetch the profile uri for the business, and increment the view this event got.
  useEffect(() => {
    request
      .get(`/businesses/profilepic?id=${item['businessid']}&fetchtype=getObject`)
      .then((json) => {
        setProfileUri(json.data);
      });
    request
      .get(`/events/update/view?eventid=${item['id']}`)
      .then(() => {})
      .catch(() => {});
  }, []);

  return (
    <View className="mx-2">
      <TouchableOpacity className="mx-1 w-80 rounded-2xl border-2 border-purple-300 bg-[#4c4c4c] p-2 shadow-orange-50">
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
          <View className="flex-col">
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
            <View className="mr-1 w-full flex-1 flex-row items-end justify-end">
              <TouchableOpacity onPress={bookmarked ? removeBookmark : bookmarkItem}>
                <BookmarkIcon
                  className="w-6 text-white"
                  fill={bookmarked ? 'white' : 'transparent'}
                />
              </TouchableOpacity>
              <Text className="ml-1 text-white">({bookmarks})</Text>
            </View>
            <View className="mr-1 w-full flex-row items-end justify-end">
              <TouchableOpacity>
                <EyeIcon className="w-6 text-white" />
              </TouchableOpacity>
              <Text className="mb-1 ml-1 text-white">({item.views})</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
