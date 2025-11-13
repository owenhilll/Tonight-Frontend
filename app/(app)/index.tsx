import { Image, View, Text, TextInput, ScrollView, TouchableOpacity, Platform } from 'react-native';

import useAuth from '../../Hooks/authContext';
import EventList from '../../utils/Components/EventList';
import Slider from '@react-native-community/slider';

import { useQueryClient } from '@tanstack/react-query';
import SetRadiusSlider from '../../utils/Components/SetRadiusSlider';
import { LinearGradient } from 'expo-linear-gradient';

import { useEffect, useLayoutEffect } from 'react';

export default function HomeScreen() {
  const { radius, setRadius, logout, session } = useAuth();

  const queryClient = useQueryClient();

  const ses = JSON.parse(session ?? '');

  return (
    <View className="m-0 flex-1 p-0">
      <View className="flex-col">
        <View className="flex-row items-center justify-center">
          <View className="flex-1 p-0">
            <Image
              source={require('../../assets/logo4.png')}
              resizeMode="contain"
              style={{
                width: Platform.OS == 'web' ? 100 : 100,
                height: Platform.OS == 'web' ? 100 : 100,
              }}
            />
          </View>
          <View className=" h-7 flex-col">
            <Text className="text-center text-lg font-bold text-white">Featured Events</Text>
          </View>

          <View
            className="z-50 flex-1 items-end justify-center"
            style={{ right: Platform.OS == 'web' ? 10 : 0 }}>
            {ses?.guest && (
              <TouchableOpacity
                className="z-50 items-center justify-center rounded-full bg-[#00E0FF] p-2"
                onPress={logout}>
                <Text className="items-center text-black">Sign in</Text>
              </TouchableOpacity>
            )}
            {!ses?.guest && !ses?.business && (
              <TouchableOpacity
                className="z-50 items-center justify-center rounded-full bg-[#00E0FF] p-2"
                onPress={logout}>
                <Text className="items-center text-black">Log out</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View>
          <SetRadiusSlider />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="my-[1%] mb-2 flex-1 rounded-lg bg-[#262626]"
        contentContainerStyle={{ flexGrow: 1 }}>
        {/* Sports*/}

        <View className="my-[1%] h-auto ">
          <EventList title={'Promoted'} queryKey="/events/promoted" />
        </View>
        {/* Specialls*/}
        <View className="my-[1%] h-auto ">
          <EventList title={'Popular'} queryKey="/events/popular" />
        </View>
        <View className="my-[1%] h-auto">
          <EventList title={'Nearest'} queryKey="/events/nearest" nearest={true} />
        </View>
        {/* Movies Shows*/}
      </ScrollView>
    </View>
  );
}
