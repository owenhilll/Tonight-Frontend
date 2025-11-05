import Share from '../../../utils/Components/Share';
import Posts from '../../../utils/Modals/Posts';
import { request } from '../../../utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';

import { useState } from 'react';
import * as ImagePicker from 'react-native-image-picker';
import useAuth from '../../../Hooks/authContext';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Linking,
  Modal,
  Platform,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

const Profile = () => {
  const { user, logout, token } = useAuth();

  const queryClient = useQueryClient();

  const {
    isLoading: businessLoading,
    error: businessError,
    data: business,
  } = useQuery({
    queryKey: ['user'],
    queryFn: () =>
      request
        .get('/businesses/find/' + user['user']['id'], {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          return res.data;
        })
        .catch(() => {}),
  });

  const [index, setIndex] = useState(0);
  const [profilepic, setProfilePic] = useState(
    `https://tonight-profiles.s3.us-east-1.amazonaws.com/business_${user['user']['id']}_profile_pic`
  );

  const SetProfilePic = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, async (response) => {
      if (response.didCancel || response.errorCode) return;

      await request
        .get(`/businesses/profilepic?id=${user['user']['id']}&fetchtype=putObject`, {
          headers: {
            Authorization: token,
          },
        })
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

  const [website, setWebsite] = useState(business?.website);
  const [number, setNumber] = useState(business?.cell);

  const updateInfo = () => {
    const id = user['user']['id'];
    if (number === '' || website === '') {
      return;
    }
    request
      .put('/businesses/update', {
        headers: {
          Authorization: token,
        },

        number,
        website,
        id,
      })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['user'] });
        setShowEdit(false);
      })
      .catch(() => {});
  };

  const GetProfilePic = () => {
    request
      .get(`/businesses/profilepic?id=${user['user']['id']}&fetchtype=getObject`, {
        headers: {
          Authorization: token,
        },
      })
      .then((json) => {
        setProfilePic(json.data);
      })
      .catch(() => {});
  };

  const [showShare, setShowShare] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const {
    isLoading: followersLoading,
    error: followerError,
    data: followers,
  } = useQuery({
    queryKey: ['followersQuery'],
    queryFn: () =>
      request
        .get('/relationship?id=' + user['user']['id'], {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
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
    <View className=" my-3 flex-1 ">
      <Modal visible={showShare} transparent={true}>
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
              <Share close={setShowShare} queryKey={'events' + user['user']['id']} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showEdit} transparent={true}>
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
              height: Platform.OS == 'web' ? 'auto' : '70%',
              justifyContent: 'center',
              backgroundColor: 'black',
              paddingHorizontal: Platform.OS == 'web' ? '10%' : '3%',
            }}
            className="rounded-2xl">
            <TouchableOpacity className="mt-2 w-7" onPress={() => setShowEdit(false)}>
              <FontAwesome6 iconStyle="solid" size={25} color="#BBDEFB" name="arrow-left" />
            </TouchableOpacity>
            <View className="flex-1 items-center">
              <Text className="text-center text-3xl text-white">Edit Profile</Text>
              <View className=" border-1 my-2 items-center justify-center rounded-full border-purple-500 bg-white p-2 shadow-sm shadow-white">
                <TouchableOpacity onPress={SetProfilePic}>
                  <Image
                    style={{ width: 180, height: 180, margin: 0, padding: 0 }}
                    resizeMode="center"
                    source={{
                      uri: profilepic,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View className="my-2 flex-row justify-center">
                <TextInput
                  value={website}
                  onChangeText={setWebsite}
                  className="flex-1 rounded-lg border-gray-200 px-2 py-2 text-xl text-white"
                  placeholder="Business Website"
                  style={{ borderWidth: 1 }}
                />
              </View>
              <View className="my-2 flex-row justify-center">
                <TextInput
                  value={number}
                  onChangeText={setNumber}
                  className="flex-1 rounded-lg border-gray-200 px-2 py-2 text-xl text-white"
                  placeholder="Cell Phone"
                  style={{ borderWidth: 1 }}
                />
              </View>
              <TouchableOpacity
                onPress={updateInfo}
                className="my-2 items-center justify-center rounded-lg bg-[#4c4c4c] p-2">
                <Text className=" text-white">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {businessLoading || followersLoading ? (
        <Text className="text-white">Loading</Text>
      ) : businessError ? (
        <Text className="text-white">Error</Text>
      ) : (
        <View className="flex-column  flex-1">
          <View className="mb-2 flex-row items-center justify-center" style={{ padding: '4%' }}>
            <View className=" border-1 h-24 w-24 items-center justify-center overflow-hidden rounded-full border-purple-500 bg-white shadow-sm shadow-white">
              <TouchableOpacity>
                <Image
                  style={{ width: 90, height: 90, margin: 0, padding: 0 }}
                  resizeMode="center"
                  source={{
                    uri: profilepic,
                  }}
                />
              </TouchableOpacity>
            </View>
            <View className="ml-7 flex-col justify-center">
              <Text className="text-3xl font-bold text-white">{business.name}</Text>

              <View className="flex-row">
                <Text className="text-lg text-white">{business.address}</Text>
              </View>

              <View className="">
                <Text
                  onPress={() => Linking.openURL(business.website)}
                  className="text-white underline">
                  {business.website}
                </Text>
              </View>
            </View>
            <View className="ml-4 items-center">
              <TouchableOpacity
                className="mb-3 rounded-full bg-[#4c4c4c] p-2"
                onPress={() => setShowEdit(true)}>
                <Text className="text-lg text-white">Edit Profile</Text>
              </TouchableOpacity>
            </View>

            <View className="ml-4 items-center">
              <TouchableOpacity className="mb-3 rounded-full bg-[#4c4c4c] p-2" onPress={logout}>
                <Text className="text-lg text-white">Log out</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mb-2 flex-1 rounded-lg bg-[#262626] p-2">
            <View className="mb-2 items-center justify-center">
              <TouchableOpacity
                className="flex-row items-center rounded-full bg-[#00E0FF] px-4 py-2"
                onPress={() => setShowShare(true)}>
                <Text className="mr-2 text-xl text-black">Create</Text>
                <FontAwesome6 iconStyle="solid" color="black" size={15} name="plus" />
              </TouchableOpacity>
            </View>
            <Text className="ml-10 text-xl text-white">Your Posts</Text>
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
