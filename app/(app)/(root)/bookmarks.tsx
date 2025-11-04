import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../Hooks/authContext';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { request } from '../../../utils/axios';
import Posts from '../../../utils/Modals/Posts';

export default function BookMarks() {
  const { user, token, logout } = useAuth();
  const {
    isLoading: bookmarksLoading,
    error: bookmarksError,
    data: bookmarks,
  } = useQuery({
    queryKey: ['bookmarks' + user['user']['id']],
    queryFn: () =>
      request
        .get('/bookmarks/get?userid=' + user['user']['id'], {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          let ls: any[] = [];
          res.data.forEach((event: any) => {
            request
              .get('/events/get?eventid=' + event['eventid'], {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
              .then((res) => {
                ls.push(res.data[0]);
              });
          });
          return ls;
        }),
  });

  return (
    <View className="flex-1">
      <View className="mt-5 w-[100%] flex-row items-center justify-center">
        <Text className="text-center text-5xl text-white">Bookmarks</Text>
      </View>
      {!user['guest'] ? (
        <View className="h-full flex-1 items-center justify-center">
          {bookmarks && bookmarks.length > 0 ? (
            <Posts
              id={user['user']['id']}
              header={''}
              querystring={'/bookmarks/get?userid=' + user['user']['id']}
              profile={false}
              queryKey={user['user']['id']}
            />
          ) : (
            <View className="">
              <Text className="text-center text-2xl text-white">Nothing bookmarked.</Text>
              <Text className="text-center text-sm text-white">
                Start discovering events in the home page!
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View className="h-full flex-1 items-center justify-center">
          <Text className="text-center text-xl text-white">
            Create a user account to start bookmarking events!
          </Text>
          <Text className="text-xm text-center text-white">
            User accounts earn rewards, and get notified when their favorite venues post!
          </Text>
          <TouchableOpacity
            className="z-50 items-center justify-center rounded-full bg-slate-300 p-2"
            onPress={logout}>
            <Text className="items-center text-black">Sign in</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
