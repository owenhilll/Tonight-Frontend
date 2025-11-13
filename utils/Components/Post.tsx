import { request } from '../axios';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';

import React, { SetStateAction, useContext, useEffect, useState } from 'react';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import useAuth from '../../Hooks/authContext';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Platform,
  Alert,
} from 'react-native';

import { DateSelection } from '../DateTimePicker';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';
import { Payment } from './Payment';
import { Link } from 'expo-router';
import Checkout from '../../app/(app)/profile/checkout';

export const Post = ({
  item,
  profile,
  queryKey,
}: {
  item: any;
  profile: boolean;
  queryKey: string;
}) => {
  const { session } = useAuth();
  const ses = JSON.parse(session ?? '');
  const user = ses.user;
  const token = ses.token;

  const date = new Date(item.date);
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  let time = date.toLocaleTimeString('en-US', options);
  const [edit, setEdit] = useState(false);

  const adminRights = user?.user.id === item['businessid'];
  const [editDate, setEditDate] = useState(item.date);

  const [editHours, setEditHours] = useState((item.duration % 24).toString());
  const [editDays, setEditDays] = useState((item.duration / 24).toString());
  const [profileUri, setProfileUri] = useState('');
  const [business, setBusiness] = useState<any>(null);
  const [err, setErr] = useState<string>('');

  let endDate = new Date(item.date);
  endDate.setHours(endDate.getHours() + item.duration);

  const [totalHours, setTotalHours] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const daysMap = Array.from({ length: 30 }, (v, i) => i.toString()); // 1 to 10

  const hoursMap = Array.from({ length: 24 }, (v, i) => i.toString()); // 1 to 10
  let endTime = endDate.toLocaleTimeString('en-US', options);
  const [status, setStatus] = useState('');

  const [editTitle, setEditTitle] = useState(item.title);
  const [editDesc, setEditDesc] = useState(item.desc);
  const queryClient = useQueryClient();
  const [showProfile, setShowProfile] = useState(false);

  function OnDateSelected(event: DateTimePickerEvent, datei?: Date | null) {
    if (datei) setEditDate(datei);
  }

  const deletePost = async () => {
    if (Platform.OS === 'web') {
      console.log(queryKey);
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
      .delete('/events/delete?eventid=' + item.id, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      })
      .catch((err) => {
        Alert.alert(err);
      });
  };

  //anytime it renders, do these things. Fetch profile pic, get the corresponding business details, and increment view.
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
      .get(`/events/update/view?eventid=${item['id']}`, {
        headers: {
          Authorization: token,
        },
      })
      .then(() => {})
      .catch(() => {});

    const currDate = new Date();
    if (currDate > endDate) setStatus('expired');
    else if (currDate > date) setStatus('live');
    else setStatus('upcoming');

    request
      .get(`/businesses/find/${item['businessid']}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((json) => {
        setBusiness(json.data);
      });
  }, []);

  useEffect(() => {
    const e = parseInt(editDays) * 24 + parseInt(editHours);
    if (!isNaN(e)) {
      setTotalHours(e);
    }
  }, [editDays, editHours]);

  const bookmarkItem = async () => {
    const eventid = item.id;
    const businessid = item.businessid;
    const userid = user?.user.id;
    await request
      .post(
        '/bookmarks/add',
        { eventid, businessid, userid },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        queryClient.invalidateQueries({
          queryKey: ['bookmarks' + item.id + '' + user?.user.id],
        });
        queryClient.invalidateQueries({
          queryKey: ['bookmarks' + item.id],
        });
        queryClient.invalidateQueries({
          queryKey: ['bookmarks' + user?.user.id],
        });
      })
      .catch((err) => {});
  };

  const removeBookmark = async () => {
    const eventid = item.id;
    const businessid = item.businessid;
    const userid = user?.user.id;
    await request
      .delete('/bookmarks/delete?userid=' + userid + '&eventid=' + eventid, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        queryClient.invalidateQueries({
          queryKey: ['bookmarks' + item.id + '' + user?.user.id],
        });
        queryClient.invalidateQueries({
          queryKey: ['bookmarks' + item.id],
        });
        queryClient.invalidateQueries({
          queryKey: ['bookmarks' + user?.user.id],
        });
      })
      .catch((err) => {});
  };

  const {
    isLoading: bookmarkedLoading,
    error: bookmarkedError,
    data: bookmarked,
  } = useQuery({
    queryKey: ['bookmarks' + item.id + '' + user?.user.id],
    queryFn: () =>
      request
        .get('/bookmarks/get?userid=' + user?.user.id + '&eventid=' + item.id, {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          return res.data.length == 1;
        }),
  });

  const {
    isLoading: promotedLoading,
    error: promotedError,
    data: promoted,
  } = useQuery({
    queryKey: ['promoted' + item.id + '' + user?.user.id],
    queryFn: () =>
      request
        .get(`/events/promoted/${item.id}`, {
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

  return (
    <View className="m-5 rounded-xl bg-[#4c4c4c] p-2">
      <Modal visible={showPayment} transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              width: Platform.OS == 'web' ? 'auto' : '90%',
              height: Platform.OS == 'web' ? 'auto' : '80%',
              padding: Platform.OS == 'web' ? '5%' : 0,
              backgroundColor: 'black',
            }}
            className="rounded-xl shadow-lg shadow-[#fa7b32]">
            <View className="mt-2 flex-1">
              <TouchableOpacity className="w-7" onPress={() => setShowPayment(false)}>
                <FontAwesome6 iconStyle="solid" size={25} color="#BBDEFB" name="arrow-left" />
              </TouchableOpacity>

              <Checkout eventid={item.id} />
            </View>
          </View>
        </View>
      </Modal>
      <View>
        <View className="flex-row">
          <View className="flex-column mr-2 w-[65%] justify-evenly">
            <View className="flex-row items-center">
              {!edit && (
                <Text className="mb-2 flex-1 text-2xl font-bold text-white">{item.title}</Text>
              )}
              {edit && (
                <TextInput
                  onChangeText={setEditTitle}
                  defaultValue={editTitle}
                  style={{ borderColor: 'gray', borderWidth: 1 }}
                  className="m-3 flex-1 p-2 text-base font-bold text-white"
                />
              )}
              {!edit && adminRights && !promoted && (
                <TouchableOpacity
                  className="rounded-lg bg-[#00E0FF] p-2 font-bold"
                  onPress={() => setShowPayment(!showPayment)}>
                  <Text className="font-bold">Promote</Text>
                </TouchableOpacity>
              )}
              {!edit && adminRights && promoted && (
                <Text className="text-2xl font-bold text-green-400">Promoted</Text>
              )}
            </View>
            <View className="flex-row items-center">
              <FontAwesome6 size={18} iconStyle="solid" color="#00E0FF" name="circle-info" />
              {!edit && <Text className="text-s mx-2 my-2 text-white">{item.desc}</Text>}
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
                  className="text-s m-3 py-2 text-white"
                />
              )}
            </View>

            <View className="flex-row flex-wrap items-center">
              <FontAwesome6
                size={18}
                className="w-8"
                iconStyle="solid"
                color="#00E0FF"
                name="calendar"
              />
              {!edit && (
                <Text className="text-s ml-2 flex-1 text-white">
                  {date.toDateString() == endDate.toDateString()
                    ? `${date.toLocaleDateString()} ${time} - ${endTime}`
                    : `${date.toLocaleDateString()} ${time} - ${endDate.toLocaleDateString()} ${endTime}`}
                </Text>
              )}
              {edit && (
                <View className="mx-3 flex-col items-start">
                  {Platform.OS == 'web' ? (
                    <DateSelection
                      defValue={item.time}
                      date={editDate}
                      setDate={setEditDate}
                      type="datetime-local"
                    />
                  ) : (
                    <DateTimePicker
                      mode="datetime"
                      style={{ marginLeft: 3 }}
                      onChange={OnDateSelected}
                      value={date}
                    />
                  )}
                  <View className="my-2 flex-1 border-2 border-gray-500">
                    <Text className="text-white">Duration</Text>
                    <View className="flex-row">
                      <View className="mx-2 flex-1">
                        <Text className="text-white">Days</Text>
                        <Picker
                          style={{ backgroundColor: '#292d3d', color: '#bfc7d4' }}
                          selectedValue={editDays}
                          onValueChange={(itemvalue, itemIndex) => setEditDays(itemvalue)}>
                          {daysMap.map((number) => (
                            <Picker.Item key={number} label={number} value={number} />
                          ))}
                        </Picker>
                      </View>
                      <View className="mx-2 flex-1">
                        <Text className="text-white">Hours</Text>
                        <Picker
                          style={{ backgroundColor: '#292d3d', color: '#bfc7d4' }}
                          selectedValue={editHours}
                          onValueChange={(itemvalue, itemIndex) => setEditHours(itemvalue)}>
                          {hoursMap.map((number) => (
                            <Picker.Item key={number} label={number} value={number} />
                          ))}
                        </Picker>
                      </View>
                    </View>
                    <Text className="text-white">Event Duration (hrs): {totalHours}</Text>
                  </View>
                </View>
              )}
            </View>
            <View className="mt-2 flex-row">
              <View className="flex-row items-center">
                <TouchableOpacity
                  disabled={user?.business}
                  onPress={bookmarked ? removeBookmark : bookmarkItem}>
                  <FontAwesome color={bookmarked ? 'blue' : 'gray'} size={20} name="bookmark" />
                </TouchableOpacity>
                <Text className="mx-2 flex-1 text-white">({bookmarks})</Text>
              </View>
              <View className="flex-1 flex-row items-center">
                <View className="mr-4 flex-1 flex-row items-center">
                  <TouchableOpacity>
                    <FontAwesome6 iconStyle="solid" color="#00E0FF" size={18} name="eye" />
                  </TouchableOpacity>
                  <Text className="ml-2 text-white">({item.views})</Text>
                </View>
                <View className="flex-row items-center">
                  <Text
                    style={{
                      color: status == 'expired' ? 'red' : status == 'live' ? 'green' : 'purple',
                    }}
                    className="text-lg">
                    {status}
                  </Text>
                  <View
                    className="ml-2 h-4 w-4 rounded-full"
                    style={{
                      backgroundColor:
                        status == 'expired' ? 'red' : status == 'live' ? 'green' : 'purple',
                    }}
                  />
                </View>
              </View>
            </View>
            <View className="mt-2 flex-row justify-between">
              <TouchableOpacity className="flex-1 justify-end text-white">
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
                    <View className="mt-2 rounded-lg bg-white px-2 text-black">
                      <TouchableOpacity
                        onPress={() => {
                          setEdit(false);
                        }}>
                        Cancel
                      </TouchableOpacity>
                    </View>
                  )}
                  {edit && (
                    <View className="mt-2 rounded-lg bg-white px-2 text-black">
                      {err && <Text className="text-red-400">{err}</Text>}
                      <TouchableOpacity
                        onPress={() => {
                          if (isNaN(totalHours) || totalHours == 0) {
                            setErr('Duration is incorrectly set!');
                            return;
                          }
                          if (
                            editDate != item.date ||
                            editTitle != item.title ||
                            editDesc != item.desc ||
                            totalHours != item.duration
                          ) {
                            request
                              .put(
                                '/events/update?id=' + item.id,
                                {
                                  editTitle,
                                  editDesc,
                                  editDate,
                                  totalHours,
                                },
                                {
                                  headers: {
                                    Authorization: token,
                                  },
                                }
                              )
                              .then(() => {
                                queryClient.invalidateQueries({ queryKey: [queryKey] });
                              })
                              .catch((err) => {
                                setErr(err);
                              });
                          }
                          setEdit(false);
                        }}>
                        Save
                      </TouchableOpacity>
                    </View>
                  )}
                  <View className="justify-end">
                    <Text className="mr-3 text-[#00E0FF] underline" onPress={() => deletePost()}>
                      Delete
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
          <View className=" w-[35%] flex-col items-center  border-l-2 pl-3">
            <TouchableOpacity
              onPress={() => setShowProfile(!showProfile)}
              className=" border-1 mb-3 h-24 w-24 items-center justify-center overflow-hidden rounded-full border-purple-500 bg-white shadow-sm shadow-white">
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
                        <FontAwesome6
                          iconStyle="solid"
                          size={25}
                          color="#BBDEFB"
                          name="arrow-left"
                        />
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
                          <FontAwesome6
                            iconStyle="solid"
                            color="#00E0FF"
                            size={15}
                            name="map-pin"
                          />
                          <Text className="ml-3 text-white">{business?.address}</Text>
                        </View>

                        {business?.number && (
                          <View className="flex-row">
                            <FontAwesome6
                              iconStyle="solid"
                              color="#00E0FF"
                              size={15}
                              name="phone"
                            />
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
            <Text className="text-center text-white">{business?.name}</Text>
            <Text className="text-center text-white">{business?.address}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
