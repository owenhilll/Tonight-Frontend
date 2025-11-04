import { Image, View, Text, TextInput, ScrollView, TouchableOpacity, Platform } from 'react-native';

import Categories from '../../../utils/Components/Categories';

import useAuth from '../../../Hooks/authContext';
import EventList from '../../../utils/Components/EventList';
import Slider from '@react-native-community/slider';

import { useQueryClient } from '@tanstack/react-query';
import SetRadiusSlider from '../../../utils/Components/SetRadiusSlider';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const { radius, setRadius, logout, user } = useAuth();

  const queryClient = useQueryClient();

  return (
    <View className="m-0 flex-1 p-0">
      <View className="-mt-4 w-full flex-row ">
        <View className="absolute top-5 z-50" style={{ right: Platform.OS == 'web' ? 10 : 0 }}>
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
            style={{
              padding: 0,
              margin: 0,
              width: Platform.OS == 'web' ? 100 : 'auto',
              height: Platform.OS == 'web' ? 100 : 'auto',
            }}
          />
        </View>
      </View>

      <View
        className="h-12 items-center"
        style={{ marginHorizontal: Platform.OS == 'web' ? '3%' : '2%' }}>
        <Categories />
      </View>

      <View className="h-7 flex-col items-center">
        <Text className="text-center text-lg font-bold text-white">Featured</Text>
      </View>

      <View className="flex-row items-center">
        <SetRadiusSlider />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginHorizontal: Platform.OS == 'web' ? '3%' : '2%' }}
        className="my-[1%] mb-2 flex-1 rounded-lg bg-[#262626]"
        contentContainerStyle={{ flexGrow: 1 }}>
        {/* Sports*/}
        <View className="my-[1%] h-auto">
          <EventList title={'Sports'} category={'Sport'} />
        </View>
        {/* Specialls*/}
        <View className="my-[1%] h-auto ">
          <EventList title={'Drinks'} category={'Drink'} />
        </View>
        {/* Movies Shows*/}
        <View className="my-[1%] h-auto ">
          <EventList title={'Foods'} category={'Food'} />
        </View>
      </ScrollView>
    </View>
  );
}
