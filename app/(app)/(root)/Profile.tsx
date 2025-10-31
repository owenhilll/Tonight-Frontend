import Share from '../../../utils/Components/Share';
import Posts from '../../../utils/Modals/Posts';
import { request } from '../../../utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import React, { SetStateAction, useContext, useState } from 'react';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import * as ImagePicker from 'react-native-image-picker';
import { Box, Grid, Modal, Stack } from '@mui/material';
import useAuth from '../../../Hooks/authContext';
import { Text, View, Image, TouchableOpacity, TextInput, Linking } from 'react-native';
import { Link } from 'expo-router';
import { MapPinIcon, PlusIcon } from '@heroicons/react/24/outline';
import ErrorIcon from '@mui/icons-material/Error';

const Profile = ({ close }: { close: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const { user, logout } = useAuth();

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

  const [index, setIndex] = useState(0);
  const [profilepic, setProfilePic] = useState(
    `https://tonight-profiles.s3.us-east-1.amazonaws.com/business_${user['user']['id']}_profile_pic`
  );

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

  const [website, setWebsite] = useState('');

  const updatewebsite = () => {
    const id = user['user']['id'];
    request
      .put('/businesses/website', { website, id })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['user'] });
      })
      .catch(() => {});
  };

  const GetProfilePic = () => {
    request
      .get(`/businesses/profilepic?id=${user['user']['id']}&fetchtype=getObject`)
      .then((json) => {
        setProfilePic(json.data);
      });
  };

  const [showShare, setShowShare] = useState(false);

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
    <View className="align-center w-[100%] flex-1 justify-center bg-black pt-[5%]">
      <Modal open={showShare} className="m-[10%] h-auto w-auto rounded-lg bg-[#262626]">
        <Share close={setShowShare} queryKey={'events' + user['user']['id']} />
      </Modal>

      {businessLoading || followersLoading ? (
        <Text className="text-white">Loading</Text>
      ) : businessError ? (
        <Text className="text-white">Error</Text>
      ) : (
        <View className="flex-column h-full flex-1">
          <View className="w-full flex-row">
            <View className="flex-1 items-center justify-center">
              <TouchableOpacity
                className="flex-row rounded-full bg-purple-400 p-4"
                onPress={() => setShowShare(true)}>
                <Text className="text-xl text-white">Create</Text>
                <PlusIcon className="ml-3" />
              </TouchableOpacity>
            </View>
            <View className="flex-column flex-1 items-center">
              <View className="h-[30%] items-center space-y-4">
                <Text className="text-2xl text-white">{business.name}</Text>

                <View className="flex-row items-center justify-center">
                  <MapPinIcon color="white" className="w-7" />
                  <Text className="text-xl text-white">{business.address}</Text>
                </View>
                <TouchableOpacity
                  className="flex-row rounded-full bg-[#567eb9] p-2"
                  onPress={SetProfilePic}>
                  <Text className="text-center text-white">Edit Profile Picture</Text>
                </TouchableOpacity>
                <View>
                  {business.website == null ? (
                    <View className="flex-row items-center space-x-2">
                      <ErrorIcon className="w-5 text-red-500" />
                      <TextInput
                        value={website}
                        onChangeText={setWebsite}
                        className="rounded-full border-white px-2 text-lg text-white"
                        placeholder="Business Website"
                        style={{ borderWidth: 1 }}
                      />
                      <TouchableOpacity
                        onPress={updatewebsite}
                        className="flex-row rounded-full bg-[#4c4c4c] p-2">
                        <Text className="text-white">Save</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Text
                      onPress={() => Linking.openURL(business.website)}
                      className="text-white underline">
                      {business.website}
                    </Text>
                  )}
                </View>
              </View>
            </View>
            <View className="flex-1 items-center justify-center">
              <TouchableOpacity className="rounded-full bg-red-400 p-4" onPress={logout}>
                <Text className="text-xl text-white">Log out</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mb-2 flex-1">
            <Posts
              header=""
              id={user['user']['id']}
              queryKey={'events' + user['user']['id']}
              querystring={'/events/' + user['user']['id']}
              profile={true}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default Profile;
