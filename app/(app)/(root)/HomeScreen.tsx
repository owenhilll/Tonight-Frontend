import { Image, View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Categories from '../../../components/CardHolders/Categories';
import Sports from '../../../components/CardHolders/Sports';
import Specials from '../../../components/CardHolders/Specials';
import MovieShows from '../../../components/CardHolders/MovieShows';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { UserIcon } from '@heroicons/react/24/outline';
import { AdjustmentsVerticalIcon } from '@heroicons/react/24/outline';

export default function HomeScreen() {
  const navigateToProfile = () => {};

  return (
    <SafeAreaView className="align-center flex-1 bg-black">
      <View className="flex-row justify-center space-x-20">
        <Image
          source={require('../../../assets/Logo.png')}
          style={{ width: '5vw', height: '5vh' }}
        />
        <View className="flex-row">
          <MagnifyingGlassIcon color={'#8500ED'} width={30} />
          <TextInput id="Search" placeholder="Search Event" keyboardType="default" />
        </View>
        <TouchableOpacity onPress={navigateToProfile}>
          <UserIcon color={'white'} width={40} />
        </TouchableOpacity>
      </View>

      <View>
        <Categories />
      </View>
      <ScrollView className="align-center items-center">
        <hr
          color="#8500ED"
          style={{ color: '#8500ED', height: 3, marginTop: 20, marginBottom: 10, border: 0 }}
        />
        <View className=" items-center">
          <Text className=" -mb-2 text-lg font-bold text-white">Featured</Text>
          <View className="flex-row items-center">
            <Text className=" text-xs underline">Learn how to Promote your place of Event</Text>
          </View>
        </View>

        {/* Sports*/}
        <View className=" mb-1">
          <Sports />
        </View>
        {/* Specialls*/}
        <View className=" mb-1 bg-inherit">
          <Specials />
        </View>
        {/* Movies Shows*/}
        <View>
          <MovieShows />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
