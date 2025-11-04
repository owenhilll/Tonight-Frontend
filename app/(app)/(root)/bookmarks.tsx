import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../Hooks/authContext';
import { FlatList, Image, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
      <View className="w-[100%] flex-row">
        <View className="flex-1 p-0">
          <Image
            source={require('../../../assets/logo4.png')}
            resizeMode="contain"
            style={{
              width: Platform.OS == 'web' ? 100 : 'auto',
              height: Platform.OS == 'web' ? 100 : 'auto',
            }}
          />
        </View>
        <View className="flex-1 flex-col justify-center">
          <View className=" h-7 flex-col">
            <Text className="text-center text-lg font-bold text-white">Bookmarks</Text>
          </View>
        </View>
        <View className="flex-1" />
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
        <View className="flex-1 items-center justify-center">
          <Text className="text-center text-xl text-white">
            Create a user account to start bookmarking events!
          </Text>
          <Text className="text-xm text-center text-white">
            User accounts earn rewards, and get notified when their favorite venues post!
          </Text>
          <TouchableOpacity
            className="z-50 my-3 items-center justify-center rounded-full bg-[#00E0FF] p-2"
            onPress={logout}>
            <Text className="items-center text-black">Sign in</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
