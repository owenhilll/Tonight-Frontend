import Share from './Share';
import { request } from '../../../utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import { Box, Grid, Stack } from '@mui/material';
import useAuth from '../../../Hooks/authContext';
import { Text, View, Image } from 'react-native';
import { Link } from 'expo-router';
import { MapPinIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const { user } = useAuth();

  const queryClient = useQueryClient();

  const {
    isLoading: businessLoading,
    error: businessError,
    data: business,
  } = useQuery({
    queryKey: ['user'],
    queryFn: () =>
      request.get('/businesses/find/' + user.user.id).then((res) => {
        console.log(res.data);
        return res.data;
      }),
  });
  const [index, setIndex] = useState(0);
  const FirstRoute = () => <Share />;
  const SecondRoute = () => <View style={{ backgroundColor: '#ff4081' }} />;
  const renderScene = SceneMap({
    share: FirstRoute,
    posts: SecondRoute,
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: 'white' }}
      style={{ backgroundColor: 'black' }}
    />
  );

  const routes = [
    { key: 'share', title: 'Share' },
    { key: 'posts', title: 'Posts' },
  ];

  const {
    isLoading: followersLoading,
    error: followerError,
    data: followers,
  } = useQuery({
    queryKey: ['followersQuery'],
    queryFn: () =>
      request.get('/relationship?id=' + user.user.id).then((res) => {
        return res.data;
      }),
  });

  const followMutation = useMutation({
    mutationFn: (following: any) => {
      if (following) return request.delete('/relationship?id=' + user.user.id);
      return request.post('/relationship?id=' + user.user.id);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['followersQuery'] });
    },
  });

  const handleFollow = () => {
    followMutation.mutate(followers?.includes(user));
  };

  return (
    <View className="align-center w-[100%] flex-1 justify-center p-16">
      {businessLoading || followersLoading ? (
        <Text className="text-white">Loading</Text>
      ) : businessError ? (
        <Text className="text-white">Error</Text>
      ) : (
        <View className="flex-column flex-1">
          <View className="flex-column mb-[5%] h-[30%] items-center">
            <View className=" mb-3 h-[65%] overflow-hidden rounded-full border-2 border-purple-800 shadow-lg shadow-white">
              <Image
                src={business.profilepic}
                resizeMode="cover"
                style={{ flex: 1, width: 200 }}
                defaultSource={require('../../../assets/img.png')}
              />
            </View>
            <View className="h-[30%] items-center">
              <Text className="text-xl text-white">{business.name}</Text>
              <View className="text-white">
                {followersLoading ? 'Loading' : followers.length} followers
              </View>
              <View className="flex-row items-center justify-center">
                <MapPinIcon color="white" height={'100%'} />
                <Text className="text-white">{business.city}</Text>
              </View>
              <Text className="text-white">Website: {business.website}</Text>
              <Link href="edit">edit</Link>
            </View>
          </View>

          <View className="mt-[5%] h-[65%]">
            <TabView
              navigationState={{ index, routes }}
              renderScene={renderScene}
              onIndexChange={setIndex}
              renderTabBar={renderTabBar}
              initialLayout={{ height: 65 }}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default Profile;
