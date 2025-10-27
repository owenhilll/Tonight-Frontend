import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { QueryClient, useQuery } from '@tanstack/react-query';
import useAuth from 'Hooks/authContext';
import { Alert, FlatList, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { request } from 'utils/axios';

export default function Posts({ id, data }: { id: string; data: any | undefined }) {
  const queryClient = new QueryClient();
  const { user } = useAuth();
  let adminRights = id === user['user']['id'];

  const deletePost = async (e: number) => {
    console.log(e);
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
      .delete('/events/delete', { params: { eventid: id } })
      .then((res) => {
        queryClient.invalidateQueries({ queryKey: ['events' + id] });
      })
      .catch((err) => {
        Alert.alert(err);
      });
  };

  const Post = ({ item }: { item: any }) => {
    const date = new Date(item.date);
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    let time = date.toLocaleTimeString('en-US', options);

    return (
      <TouchableOpacity className="mt-5 w-full rounded-2xl border-2 border-purple-300 p-2 shadow-orange-50">
        <View className="flex-row">
          <View className="flex-column flex-1">
            <Text className=" mb-5 ml-2 text-base font-bold text-white">{item.title}</Text>
            <Text className="text-s ml-2 text-white">{item.desc}</Text>
            <Text className="text-s ml-2 mt-5 text-white">{date.toDateString()}</Text>
            <Text className="text-s ml-2 mt-1 text-white">{time}</Text>
          </View>
          {adminRights && (
            <View className="flex-column justify-between">
              <PencilIcon className="h-5 w-5 text-white" />
              <TrashIcon className="h-5 w-5 text-white" onClick={() => deletePost(item.id)} />
            </View>
          )}
        </View>
      </TouchableOpacity>
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
