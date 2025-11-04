import useAuth from '../../Hooks/authContext';
import { request } from '../axios';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Modal,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';

//for use in rendering events in the home page (the horizontal list)
export const SmallEventCard = ({ item }: { item: any }) => {
  const { user, token } = useAuth();
  const queryClient = useQueryClient();
  const bookmarkItem = async () => {
    const eventid = item.id;
    const businessid = item.businessid;
    const userid = user['user']['id'];
    await request
      .post('/bookmarks/add', {
        headers: {
          Authorization: token,
        },
        eventid,
        businessid,
        userid,
      })
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
      .delete('/bookmarks/delete?userid=' + userid + '&eventid=' + eventid, {
        headers: {
          Authorization: token,
        },
      })
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
        .get('/bookmarks/get?userid=' + user['user']['id'] + '&eventid=' + item.id, {
          headers: {
            Authorization: token,
          },
        })
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
      request
        .get('/bookmarks/get?eventid=' + item.id, {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          return res.data.length;
        }),
  });
  const [showProfile, setShowProfile] = useState(false);
  const date = new Date(item.date);
  let options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
  let time = date.toLocaleTimeString('en-US', options);
  const [profileUri, setProfileUri] = useState('');
  const [business, setBusiness] = useState<any>();
  //fetch the profile uri for the business, and increment the view this event got.
  useEffect(() => {
    request
      .get(`/businesses/profilepic?id=${item['businessid']}&fetchtype=getObject`, {
        headers: {
          Authorization: token,
        },
      })
      .then((json) => {
        setProfileUri(json.data);
      });
    request
      .get(`/businesses/find/${item['businessid']}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((json) => {
        setBusiness(json.data);
      });
    request
      .put(`/events/update/view?eventid=${item['id']}`, {
        headers: {
          Authorization: token,
        },
      })
      .then(() => {})
      .catch(() => {});
  }, []);

  return (
    <View className="mx-2 w-80 rounded-2xl bg-[#4c4c4c] p-2 shadow-lg">
      <View className="flex-row">
        <View className="flex-column h-48 w-44">
          <Text className="mb-5 ml-2 flex-1 text-xl font-bold text-white">{item.title}</Text>
          <View className="mt-4 flex-row items-center justify-center">
            <FontAwesome6 iconStyle="solid" size={20} color="#00E0FF" name="circle-info" />
            <Text className="text-s ml-2 flex-1 text-white">{item.desc}</Text>
          </View>
          <View className="mt-4 flex-row items-center justify-center">
            <FontAwesome6 iconStyle="solid" size={20} color="#00E0FF" name="calendar" />
            <Text className="text-s ml-2 flex-1 text-white">
              {date.toDateString()} - {time}
            </Text>
          </View>
        </View>
        <View className="flex-col">
          <TouchableOpacity
            onPress={() => setShowProfile(!showProfile)}
            className=" border-1 mb-3 ml-5 h-24 w-24 items-center justify-center overflow-hidden rounded-full border-purple-500 bg-white shadow-sm shadow-white">
            <Image
              style={{ width: 90, height: 90, margin: 0, padding: 0 }}
              className="h-auto w-auto"
              resizeMode="center"
              source={{
                uri: profileUri,
              }}
            />
            <Modal visible={showProfile} transparent={true}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}>
                <View
                  style={{
                    width: Platform.OS == 'web' ? 300 : '70%',
                    height: Platform.OS == 'web' ? 300 : '50%',
                    justifyContent: 'center',
                    backgroundColor: 'black',
                    borderRadius: '20%',
                  }}>
                  <View className="mt-2 flex-1 items-center justify-center">
                    <TouchableOpacity
                      className="absolute left-5 top-5 z-50"
                      onPress={() => setShowProfile(false)}>
                      <FontAwesome6 iconStyle="solid" size={25} color="#BBDEFB" name="arrow-left" />
                    </TouchableOpacity>
                    <View className=" border-1 mb-3 h-24 w-24 items-center justify-center overflow-hidden rounded-full border-purple-500 bg-white shadow-sm shadow-white">
                      <Image
                        style={{ width: 90, height: 90, margin: 0, padding: 0 }}
                        className="h-auto w-auto"
                        resizeMode="center"
                        source={{
                          uri: profileUri,
                        }}
                      />
                    </View>
                    <View className="items-center space-y-4">
                      <Text className="text-center text-xl text-white">{business?.name}</Text>
                      <View className="flex-row">
                        <FontAwesome6 iconStyle="solid" color="#00E0FF" size={15} name="map-pin" />
                        <Text className="ml-3 text-white">{business?.address}</Text>
                      </View>

                      {business?.number && (
                        <View className="flex-row">
                          <FontAwesome6 iconStyle="solid" color="#00E0FF" size={15} name="phone" />
                          <Text className="ml-3 text-white">{business?.number}</Text>
                        </View>
                      )}
                      {business?.website && (
                        <View className="flex-row">
                          <Text className="ml-3 text-center text-white">{business?.website}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </Modal>
          </TouchableOpacity>
          {!user['business'] && !user['guest'] && (
            <View className="mr-1 flex-row items-end justify-end">
              <TouchableOpacity onPress={bookmarked ? removeBookmark : bookmarkItem}>
                <FontAwesome6
                  color="#00E0FF"
                  name="bookmark"
                  size={15}
                  iconStyle="solid"
                  className="text-white"
                  selectionColor={bookmarked ? 'white' : 'transparent'}
                />
              </TouchableOpacity>
              <Text className="ml-2 text-white">({bookmarks})</Text>
            </View>
          )}
          <View className="mr-1 flex-row items-end justify-end">
            <TouchableOpacity>
              <FontAwesome6 iconStyle="solid" color="#00E0FF" size={15} name="eye" />
            </TouchableOpacity>
            <Text className="ml-1 text-white">({item.views})</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
