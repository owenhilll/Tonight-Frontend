import { Image, View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Categories from '../../../utils/Components/Categories';

import useAuth from '../../../Hooks/authContext';
import EventList from '../../../utils/Components/EventList';
import Slider from '@react-native-community/slider';

import { useQueryClient } from '@tanstack/react-query';
import SetRadiusSlider from '../../../utils/Components/SetRadiusSlider';

export default function HomeScreen() {
  const { radius, setRadius, logout, user } = useAuth();

  const queryClient = useQueryClient();

  return (
    <View className="m-0 flex-1 bg-black p-0">
      <View className="-mt-4 w-full flex-row ">
        <View className="absolute right-0 top-5">
          {user['guest'] && (
            <TouchableOpacity
              className="z-50 items-center justify-center rounded-full bg-slate-300 p-2"
              onPress={logout}>
              <Text className="items-center text-black">Sign in</Text>
            </TouchableOpacity>
          )}
        </View>
        <View className="w-full items-center p-0">
          <Image
            source={require('../../../assets/logo4.png')}
            className="h-24"
            resizeMode="contain"
            style={{ padding: 0, margin: 0 }}
          />
        </View>
      </View>

      <View className="h-10 w-full items-center">
        <Categories />
      </View>

      <View className="h-7 flex-col items-center">
        <Text className="text-center text-lg font-bold text-white">Featured</Text>
      </View>

      <View className="flex-row items-center">
        <SetRadiusSlider />
      </View>

      <ScrollView className="mb-2 w-full flex-1 bg-black" contentContainerStyle={{ flexGrow: 1 }}>
        {/* Sports*/}
        <View className="mx-[2%] my-[1%] h-auto">
          <EventList title={'Sports'} category={'Sport'} />
        </View>
        {/* Specialls*/}
        <View className="mx-[2%] my-[1%] h-auto ">
          <EventList title={'Drinks'} category={'Drink'} />
        </View>
        {/* Movies Shows*/}
        <View className="mx-[2%] my-[1%] h-auto ">
          <EventList title={'Foods'} category={'Food'} />
        </View>
      </ScrollView>
    </View>
  );
}
