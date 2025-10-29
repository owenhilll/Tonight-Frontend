import {
  ArrowLeftIcon,
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
import { useState } from 'react';
import Modal from 'react-native-modal';
import EventCard from './EventCard';
import { DateSelection } from '../DateTimePicker';

export default function Posts({
  id,
  data,
  queryKey,
  profile,
}: {
  id: string;
  profile: boolean;
  data: any | undefined;
  queryKey: string;
}) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

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

  const [showEventModal, setShowEventModal] = useState(false);
  const [edit, setEdit] = useState(false);

  const Post = ({ item }: { item: any }) => {
    const date = new Date(item.date);
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    let time = date.toLocaleTimeString('en-US', options);
    const adminRights = id === item['businessid'];
    const [editDate, setEditDate] = useState(item.date);
    const [editTitle, setEditTitle] = useState(item.title);
    const [editDesc, setEditDesc] = useState(item.desc);
    return (
      <View className="mx-2 mt-5  w-full rounded-2xl border-2 border-purple-300 bg-[#262626] p-2">
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
            onPress={() => {
              if (!profile) setShowEventModal(false);
            }}>
            <ArrowLeftIcon className="h-8 w-8 text-white" />
          </TouchableOpacity>
          <EventCard item={item} date={date} time={time} />
        </Modal>
        <TouchableOpacity
          disabled={edit}
          onPress={() => {
            if (!profile) setShowEventModal(true);
          }}>
          <View className="flex-row">
            <View className="flex-column flex-1">
              {!edit && (
                <Text className=" mb-5 ml-2 text-base font-bold text-white">{item.title}</Text>
              )}
              {edit && (
                <TextInput
                  onChangeText={setEditTitle}
                  defaultValue={editTitle}
                  style={{ borderColor: 'gray', borderWidth: 1 }}
                  className=" mb-5 ml-2 p-2 text-base font-bold text-white"
                />
              )}
              <View className="flex-row items-center">
                <InformationCircleIcon className="w-8 text-white" />
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
              <View className="mt-5 flex-row items-center">
                <CalendarDateRangeIcon className="w-8 text-white" />
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
            </View>
            {adminRights && (
              <View className="flex-column justify-between">
                <PencilIcon className="h-7 text-white" onClick={() => setEdit(true)} />
                {!edit && (
                  <TrashIcon className="h-7 text-white" onClick={() => deletePost(item.id)} />
                )}
                {edit && (
                  <View className="rounded-full bg-white p-2 text-purple-900">
                    <TouchableOpacity
                      onPress={() => {
                        console.log(editDate);
                        console.log(editDesc);
                        console.log(editTitle);
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
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView className="w-full flex-1">
      <FlatList
        className="flex-1 px-2 pb-2"
        data={data}
        renderItem={({ item }) => <Post item={item} />}
        keyExtractor={(item) => item.id.toString()}
        initialNumToRender={5}></FlatList>
    </ScrollView>
  );
}
