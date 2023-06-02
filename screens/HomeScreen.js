import {
  Image,
  SafeAreaView,
  View,
  Text,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  UserIcon,
  ChevronDownIcon,
  AdjustmentsVerticalIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
} from "react-native-heroicons/outline";
import Categories from "../components/CardHolders/Categories";
import Sports from "../components/CardHolders/Sports";
import Specials from "../components/CardHolders/Specials";
import MovieShows from "../components/CardHolders/MovieShows";

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="pt-5 flex-1">
      <View className="flex-row pb-3 px-2 items-center mx-4 space-x-2">
        <Image
          source={require("../assets/Images/Logo.png")}
          className="h-7 w-7"
        />

        <View className="flex-1">
          <Text className="font-bold text-black text-xl">
            Events
            <ChevronDownIcon size={20} color={"#8500ED"} />
          </Text>
        </View>
        <UserIcon size={35} color={"#000000"} />
      </View>

      {/* Search */}
      <View className="flex-row items-center px-2 pb-4 space-x-2">
        <View className="flex-row  flex-1 space-x-2 p-3 bg-stone-200">
          <MagnifyingGlassIcon size={20} color={"#8500ED"} />
          <TextInput
            id="Search"
            placeholder="Specials, Events, Happy Hour, Concerts ..."
            keyboardType="default"
          />
        </View>
        <AdjustmentsVerticalIcon color={"#8500ED"} />
      </View>

      <ScrollView className="mb-3">
        <ScrollView
          className="bg-blend-darken"
          contentContainerStyle={{ paddingBottom: 10 }}
        >
          <Categories />
        </ScrollView>
        <View className=" items-center">
          <Text className=" -mb-2  font-bold text-lg">Featured</Text>
          <View className="flex-row items-center">
            <Text className=" text-xs underline">
              Learn how to Promote your place of Event
            </Text>
          </View>
        </View>

        {/* Sports*/}
        <View className=" mb-1">
          <Sports />
        </View>
        {/* Specialls*/}
        <View className=" bg-inherit mb-1">
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
