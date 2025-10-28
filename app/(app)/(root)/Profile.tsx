import Share from './Share';
import Posts from './Posts';
import { request } from '../../../utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import React, { SetStateAction, useContext, useState } from 'react';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import * as ImagePicker from 'react-native-image-picker';
import { Box, Grid, Stack } from '@mui/material';
import useAuth from '../../../Hooks/authContext';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { MapPinIcon } from '@heroicons/react/24/outline';

const Profile = ({ close }: { close: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const { user } = useAuth();

  const queryClient = useQueryClient();

  const {
    isLoading: businessLoading,
    error: businessError,
    data: business,
  } = useQuery({
    queryKey: ['user'],
    queryFn: () =>
      request.get('/businesses/find/' + user['user']['id']).then((res) => {
        return res.data;
      }),
  });

  const {
    isLoading: postsLoading,
    error: postsError,
    data: posts,
  } = useQuery({
    queryKey: ['events' + user['user']['id']],
    queryFn: () =>
      request.get('/events/' + user['user']['id']).then((res) => {
        return res.data;
      }),
  });

  const [index, setIndex] = useState(0);
  const [profilepic, setProfilePic] = useState(
    `https://tonight-profiles.s3.us-east-1.amazonaws.com/business_${user['user']['id']}_profile_pic`
  );
  const FirstRoute = () => <Share close={close} />;
  const SecondRoute = () => (
    <Posts id={user['user']['id']} data={posts} queryKey={'events' + user['user']['id']} />
  );
  const renderScene = SceneMap({
    share: FirstRoute,
    posts: SecondRoute,
  });

  const SetProfilePic = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, async (response) => {
      if (response.didCancel || response.errorCode) return;

      await request
        .get(`/businesses/profilepic?id=${user['user']['id']}&fetchtype=putObject`)
        .then(async (json) => {
          const url = json.data;
          const res = await fetch(response.assets![0].uri!);
          const blob = await res.blob();
          const file = new File([blob], 'name');
          await fetch(url, {
            method: 'PUT',
            body: file,
            headers: {
              'Content-Type': 'image/png',
            },
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  const GetProfilePic = () => {
    request
      .get(`/businesses/profilepic?id=${user['user']['id']}&fetchtype=getObject`)
      .then((json) => {
        setProfilePic(json.data);
      });
  };

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: 'white' }}
      style={{ backgroundColor: 'black', overflow: 'visible' }}
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
      request.get('/relationship?id=' + user['user']['id']).then((res) => {
        return res.data;
      }),
  });

  const followMutation = useMutation({
    mutationFn: (following: any) => {
      if (following) return request.delete('/relationship?id=' + user['user']['id']);
      return request.post('/relationship?id=' + user['user']['id']);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['followersQuery'] });
    },
  });

  const handleFollow = () => {
    followMutation.mutate(followers?.includes(user));
  };

  GetProfilePic();

  return (
    <View className="align-center w-[100%] flex-1 justify-center p-16">
      {businessLoading || followersLoading ? (
        <Text className="text-white">Loading</Text>
      ) : businessError ? (
        <Text className="text-white">Error</Text>
      ) : (
        <View className="flex-column h-full flex-1">
          <View className="flex-column items-center">
            <View className="mb-3 items-center overflow-hidden rounded-full border-2 border-purple-800 bg-white shadow-lg shadow-white">
              <Image
                style={{ width: 150, height: 150, margin: 0, padding: 0 }}
                resizeMode="stretch"
                source={{
                  uri: profilepic,
                }}
              />
            </View>
            <View className="h-[30%] items-center">
              <TouchableOpacity onPress={SetProfilePic}>
                <Text className="text-center text-white underline">Change</Text>
              </TouchableOpacity>
              <Text className="text-xl text-white">{business.name}</Text>
              <View className="text-white">
                {followersLoading ? 'Loading' : followers.length} followers
              </View>
              <View className="flex-row items-center justify-center">
                <MapPinIcon color="white" height={'100%'} />
                <Text className="text-white">{business.city}</Text>
              </View>
              <Text className="text-white">{business.website}</Text>
              <Link href="edit">edit</Link>
            </View>
          </View>

          <View className="flex-1">
            <TabView
              navigationState={{ index, routes }}
              renderScene={renderScene}
              onIndexChange={setIndex}
              renderTabBar={renderTabBar}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default Profile;
