import { request } from '../axios';
import {
  ArrowDownOnSquareIcon,
  ArrowUpOnSquareIcon,
  BookmarkIcon,
  CalendarDateRangeIcon,
  EyeIcon,
  InformationCircleIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
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
  const { user } = useAuth();
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
      .delete('/events/delete?id=', { params: { eventid: e } })
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
      .get(`/businesses/profilepic?id=${item['businessid']}&fetchtype=getObject`)
      .then((json) => {
        setProfileUri(json.data);
      });

    request
      .get(`/events/update/view?eventid=${item['id']}`)
      .then(() => {})
      .catch(() => {});

    request.get(`/businesses/find/${item['businessid']}`).then((json) => {
      setBusiness(json.data);
    });
  }, []);

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
  return (
    <View
      style={{
        marginLeft: Platform.OS == 'web' ? innerWidth / 10 : 2,
        marginRight: Platform.OS == 'web' ? innerWidth / 10 : 2,
      }}
      className="mt-5 justify-center rounded-2xl border-2 border-purple-300 bg-[#262626] p-2">
      <View>
        <View className="flex-row">
          <View className="flex-column flex-1">
            <View className="flex-1">
              {!edit && <Text className="ml-2 text-2xl font-bold text-white">{item.title}</Text>}
              {edit && (
                <TextInput
                  onChangeText={setEditTitle}
                  defaultValue={editTitle}
                  style={{ borderColor: 'gray', borderWidth: 1 }}
                  className=" mb-5 ml-2 p-2 text-base font-bold text-white"
                />
              )}
            </View>
            <View className="flex-1 flex-row items-center">
              <InformationCircleIcon className="w-7 text-white" />
              {!edit && <Text className="text-s ml-2 text-white">{item.desc}</Text>}
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

            <View className="flex-1 flex-row items-center">
              <CalendarDateRangeIcon className="w-7 text-white" />
              {!edit && <Text className="text-s mx-2 text-white">{date.toDateString()}</Text>}
              {edit && (
                <DateSelection
                  defValue={item.time}
                  date={editDate}
                  setDate={setEditDate}
                  type="datetime-local"
                />
              )}
              {!edit && <Text className="text-s ml-2 text-white">{time}</Text>}
            </View>
            <View className="flex-row">
              <View className="flex-1 flex-row items-center">
                <TouchableOpacity onPress={bookmarked ? removeBookmark : bookmarkItem}>
                  <BookmarkIcon
                    className="h-7 w-7 text-white"
                    fill={bookmarked ? 'white' : 'transparent'}
                  />
                </TouchableOpacity>
                <Text className="flex-1 text-white">({bookmarks})</Text>
              </View>
              <View className="flex-1 flex-row items-center">
                <EyeIcon className="h-8 w-8 text-white" />
                <Text className="flex-1 text-white">({item.views})</Text>
              </View>
            </View>
          </View>
          {adminRights && (
            <View className="flex-column justify-between text-right">
              <PencilIcon className="h-7 text-white" onClick={() => setEdit(true)} />
              {!edit && (
                <TrashIcon className="h-7 text-white" onClick={() => deletePost(item.id)} />
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
            </View>
          )}
          <View className="flex-col">
            <View className="mb-3 items-center justify-center overflow-hidden rounded-full border-2 border-purple-800 bg-white shadow-lg shadow-white">
              <Image
                style={{ width: 150, height: 150, margin: 0, padding: 0 }}
                resizeMode="contain"
                source={{
                  uri: profileUri,
                }}
              />
            </View>
            <Text className="text-center text-white">{business?.name}</Text>
            <Text className="text-center text-white">{business?.address}</Text>
          </View>
          <View className="ml-10">
            <TouchableOpacity className="text-white">
              <ArrowUpOnSquareIcon className="w-7" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
