import { request } from '../axios';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';

import React, { SetStateAction, useContext, useEffect, useState } from 'react';

import useAuth from '../../Hooks/authContext';
import { Text, View, Image, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';

import Modal from 'react-native-modal';

import { DateSelection } from '../DateTimePicker';

import { useQuery, useQueryClient } from '@tanstack/react-query';

export const Post = ({
  item,
  profile,
  queryKey,
}: {
  item: any;
  profile: boolean;
  queryKey: string;
}) => {
  const { user, token } = useAuth();
  const date = new Date(item.date);
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };
  let time = date.toLocaleTimeString('en-US', options);
  const [edit, setEdit] = useState(false);

  const adminRights = user['user']['id'] === item['businessid'];
  const [editDate, setEditDate] = useState(item.date);
  const [editTitle, setEditTitle] = useState(item.title);
  const [editDesc, setEditDesc] = useState(item.desc);
  const queryClient = useQueryClient();

  const deletePost = async (e: number) => {
    if (Platform.OS === 'web') {
      const result = window.confirm('Are you sure you want to delete this Post?');
      if (!result) return;
    } else {
      Alert.alert('Deletion Confirmation', 'Are you sure you want to delete this Post?', [
        {
          text: 'Cancel',
          onPress: () => {
            return;
          },
          style: 'cancel',
        },
        { text: 'YES' },
      ]);
    }
    await request
      .delete('/events/delete?id=', {
        params: { eventid: e },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      })
      .catch((err) => {
        Alert.alert(err);
      });
  };
  const [profileUri, setProfileUri] = useState('');
  const [business, setBusiness] = useState<any>(null);

  //anytime it renders, do these things. Fetch profile pic, get the corresponding business details, and increment view.
  useEffect(() => {
    request
      .get(`/businesses/profilepic?id=${item['businessid']}&fetchtype=getObject`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((json) => {
        setProfileUri(json.data);
      });

    request
      .get(`/events/update/view?eventid=${item['id']}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {})
      .catch(() => {});

    request
      .get(`/businesses/find/${item['businessid']}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((json) => {
        setBusiness(json.data);
      });
  }, []);

  const bookmarkItem = async () => {
    const eventid = item.id;
    const businessid = item.businessid;
    const userid = user['user']['id'];
    await request
      .post(
        '/bookmarks/add',
        { eventid, businessid, userid },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
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
          Authorization: `Bearer ${token}`,
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
            Authorization: `Bearer ${token}`,
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
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          return res.data.length;
        }),
  });
  return (
    <View
      style={{
        marginLeft: Platform.OS == 'web' ? innerWidth / 10 : 10,
        marginRight: Platform.OS == 'web' ? innerWidth / 10 : 10,
      }}
      className="mt-5 justify-center rounded-2xl bg-[#4c4c4c] p-2">
      <View>
        <View className="flex-row">
          <View className="flex-column w-[65%] justify-evenly">
            <View className="">
              {!edit && <Text className="mx-2 text-2xl font-bold text-white">{item.title}</Text>}
              {edit && (
                <TextInput
                  onChangeText={setEditTitle}
                  defaultValue={editTitle}
                  style={{ borderColor: 'gray', borderWidth: 1 }}
                  className="mx-2 p-2 text-base font-bold text-white"
                />
              )}
            </View>
            <View className="flex-row items-center">
              <FontAwesome6
                size={20}
                style={{ marginLeft: 3 }}
                iconStyle="solid"
                color="#00E0FF"
                name="info"
              />
              {!edit && <Text className="text-s mx-2 ml-3 text-white">{item.desc}</Text>}
              {edit && (
                <TextInput
                  style={{
                    borderColor: 'gray',
                    borderWidth: 1,
                    paddingLeft: 2,
                    paddingBottom: 2,
                    paddingTop: 2,
                  }}
                  onChangeText={setEditDesc}
                  defaultValue={editDesc}
                  className="text-s ml-2 py-2 text-white"
                />
              )}
            </View>

            <View className="flex-row flex-wrap items-center ">
              <FontAwesome6
                size={18}
                className="w-8"
                iconStyle="solid"
                color="#00E0FF"
                name="calendar"
              />
              {!edit && <Text className="text-s ml-2 text-white">{date.toLocaleString()}</Text>}
              {edit && (
                <DateSelection
                  defValue={item.time}
                  date={editDate}
                  setDate={setEditDate}
                  type="datetime-local"
                />
              )}
            </View>
            <View className="flex-row">
              <View className="flex-1 flex-row items-center">
                <TouchableOpacity
                  disabled={user['business']}
                  onPress={bookmarked ? removeBookmark : bookmarkItem}>
                  <FontAwesome6
                    color="#00E0FF"
                    size={20}
                    name="bookmark"
                    selectionColor={bookmarked ? 'white' : 'transparent'}
                  />
                </TouchableOpacity>
                <Text className="mx-2 flex-1 text-white">({bookmarks})</Text>
              </View>
              <View className="flex-1 flex-row items-center">
                <FontAwesome6 size={20} iconStyle="solid" color="#00E0FF" name="eye" />
                <Text className="mx-2 flex-1 text-white">({item.views})</Text>
              </View>
            </View>
            <View className="flex-row justify-between">
              <TouchableOpacity className="flex-1 text-white">
                <Text className="text-[#00E0FF] underline">Share</Text>
              </TouchableOpacity>
              {adminRights && (
                <View className="flex-1 flex-row justify-between text-right">
                  {!edit && (
                    <Text className="text-[#00E0FF] underline" onPress={() => setEdit(true)}>
                      Edit
                    </Text>
                  )}
                  {edit && (
                    <View className="rounded-full bg-white p-2 text-purple-900">
                      <TouchableOpacity
                        onPress={() => {
                          if (
                            editDate != item.date ||
                            editTitle != item.title ||
                            editDesc != item.desc
                          ) {
                            request
                              .put('/events/update?id=' + item.id, {
                                editTitle,
                                editDesc,
                                editDate,
                              })
                              .then(() => {
                                queryClient.invalidateQueries({ queryKey: [queryKey] });
                              });
                          }
                          setEdit(false);
                        }}>
                        Save
                      </TouchableOpacity>
                    </View>
                  )}
                  <Text
                    className="mr-3 text-[#00E0FF] underline"
                    onPress={() => deletePost(item.id)}>
                    Delete
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View className=" w-[35%] flex-col border-l-2 border-purple-300 pl-3">
            <View className="mb-3 items-center justify-center overflow-hidden rounded-full border-2 border-purple-800 bg-white shadow-lg shadow-white">
              <Image
                style={{ width: 100, height: 100, margin: 0, padding: 0 }}
                resizeMode="contain"
                source={{
                  uri: profileUri,
                }}
              />
            </View>
            <Text className="text-center text-white">{business?.name}</Text>
            <Text className="text-center text-white">{business?.address}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
