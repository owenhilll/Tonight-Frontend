import { Image, View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Categories from '../../../components/CardHolders/Categories';
import Sports from '../../../components/CardHolders/EventList';
import Specials from '../../../components/CardHolders/Specials';
import MovieShows from '../../../components/CardHolders/MovieShows';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { UserIcon } from '@heroicons/react/24/outline';
import { router } from 'expo-router';
import useAuth from 'Hooks/authContext';
import EventList from '../../../components/CardHolders/EventList';
import Modal from 'react-native-modal';
import Profile from './Profile';
export default function HomeScreen() {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <SafeAreaView className="align-center flex-1 bg-[#262626]">
      <Modal
        isVisible={showProfile}
        className="ml-[10%] bg-black"
        animationIn="slideInRight"
        style={{ margin: 0, marginLeft: 20, backgroundColor: 'black' }}
        animationOut="slideOutRight">
        <View className="flex-1">
          <Profile />
          <TouchableOpacity
            className="absolute right-[5%] top-[4%] z-10 h-[10%] align-top"
            onPress={() => setShowProfile(!showProfile)}>
            <UserIcon color={'white'} width={40} />
          </TouchableOpacity>
          <TouchableOpacity
            className="absolute right-[5%] top-[10%] z-10 h-[10%] align-top"
            onPress={logout}>
            <Text className="justify-center text-xl text-white underline">Log out</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View className="h-[8%] w-full flex-row justify-center space-x-20">
        <View className="w-[10%]">
          <Image
            source={require('../../../assets/Logo.png')}
            style={{ width: '100%', height: '100%' }}
            resizeMode="stretch"
          />
        </View>

        <View className="flex-1 flex-row rounded-full border-2 border-purple-800 p-2 text-xl text-white">
          <MagnifyingGlassIcon color={'#8500ED'} width={30} />
          <TextInput
            id="Search"
            className="w-full"
            placeholder="Search Event"
            keyboardType="default"
          />
        </View>
        <View className="z-10 h-[100%] w-[10%] justify-center">
          {user['business'] ? (
            <TouchableOpacity onPress={() => setShowProfile(!showProfile)}>
              <UserIcon color={'white'} width={40} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={logout}>
              <Text className="justify-center text-xl text-white underline">Log out</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View className="h-[10%] w-full justify-center">
        <Categories />
      </View>
      <ScrollView className="w-full flex-1 bg-[#222222]" contentContainerStyle={{ flexGrow: 1 }}>
        <hr
          color="#8500ED"
          style={{ color: '#8500ED', height: 3, marginTop: 20, marginBottom: 10, border: 0 }}
        />
        <View className="h-[10%] items-center">
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
        <View className="mb-1 h-auto">
          <EventList title={'Sport'} category={'Sport'} />
        </View>
        {/* Specialls*/}
        <View className=" mb-1 h-auto">
          <EventList title={'Drink'} category={'Drink'} />
        </View>
        {/* Movies Shows*/}
        <View className=" mb-1 h-auto">
          <EventList title={'Food'} category={'Food'} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
