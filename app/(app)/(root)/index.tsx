import { Image, View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Categories from '../../../utils/Components/Categories';

import { ArrowLeftIcon, ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { UserIcon } from '@heroicons/react/24/outline';
import { router } from 'expo-router';
import useAuth from '../../../Hooks/authContext';
import EventList from '../../../utils/Components/EventList';
import Modal from 'react-native-modal';
import Profile from './Profile';
export default function HomeScreen() {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <SafeAreaView className="align-center flex-1 bg-black">
      <View className="h-20 items-center justify-center p-0">
        <Image
          source={require('../../../assets/logo4.png')}
          resizeMode="center"
          style={{ flex: 1, padding: 0, margin: -10 }}
        />
      </View>

      <View className="h-[7%] w-[100%] justify-center ">
        <Categories />
      </View>

      <ScrollView className="my-2 w-full flex-1 bg-black" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="items-center">
          <Text className=" -mb-2 text-lg font-bold text-white">Featured</Text>
          <View className="flex-row items-center">
            {user['business'] && (
              <Text className=" text-xs text-white underline">
                Learn how to Promote your place of Event
              </Text>
            )}
          </View>
        </View>

        {/* Sports*/}
        <View className="mx-[2%] my-[1%] h-auto bg-[#262626]">
          <EventList title={'Sports'} category={'Sport'} />
        </View>
        {/* Specialls*/}
        <View className="mx-[2%] my-[1%] h-auto bg-[#262626]">
          <EventList title={'Drinks'} category={'Drink'} />
        </View>
        {/* Movies Shows*/}
        <View className="mx-[2%] my-[1%] h-auto bg-[#262626]">
          <EventList title={'Foods'} category={'Food'} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
