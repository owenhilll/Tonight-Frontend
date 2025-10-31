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
    <SafeAreaView className="flex-1 bg-black">
      <View className="h-20 w-full flex-row">
        <View className="w-[20%]" />
        <View className="h-20 w-[60%] items-center justify-center p-0">
          <Image
            source={require('../../../assets/logo4.png')}
            resizeMode="contain"
            style={{ flex: 1, padding: 0, margin: -10 }}
          />
        </View>
        <View className="mt-3 w-[20%] items-center">
          {!user['guest'] ? (
            <TouchableOpacity className="rounded-full bg-slate-300 p-2" onPress={logout}>
              <Text className="flex-1 text-black">Log out</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity className="rounded-full bg-slate-300 p-2" onPress={logout}>
              <Text className="flex-1 text-black">Sign in</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View className="h-[7%] w-full justify-center ">
        <Categories />
      </View>

      <View className="flex-col items-center justify-center">
        <Text className="text-center text-lg font-bold text-white">Featured</Text>
      </View>
      <View className="w-full flex-row items-center justify-center">
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
    </SafeAreaView>
  );
}
