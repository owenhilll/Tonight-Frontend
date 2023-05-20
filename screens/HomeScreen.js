import { Image, SafeAreaView, View, Text, TextInput, ScrollView } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { UserIcon, ChevronDownIcon, AdjustmentsVerticalIcon, MagnifyingGlassIcon, ArrowRightIcon } from 'react-native-heroicons/outline';
import Categories from '../components/Categories';
import Featured from '../components/Featured';

export default function HomeScreen() {

    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    return (
        <SafeAreaView className=" bg-gray-300 pt-5">
            <View className="flex-row pb-3 px-2 items-center mx-4 space-x-2">
                <Image
                    className="h-7 w-7 p-4 bg-black rounded-full"
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
                        placeholder='Specials, Events, Happy Hour, Concerts ...'
                        keyboardType='default'
                    />
                </View>
                <AdjustmentsVerticalIcon color={"#8500ED"} />
            </ View>
            <ScrollView className="bg-gray-300 border-y-2 border-opacity-50 border-orange-50"
                contentContainerStyle={{ paddingBottom: 10 }}>
                <Categories />
            </ScrollView>
            <View className=" items-center">
                <Text className=" -mb-2  font-bold text-lg">Featured</Text>
                <View className="flex-row items-center">
                    <Text className=" text-xs font">
                        Learn how to Promote your place of business
                    </Text>
                    <ArrowRightIcon color={"#8500ED"} />
                </View>

            </View>

            <ScrollView>
                <Featured title={"Featured Sports"} description="Featured Sports Near You" />
                <Featured title={"Featured Specials"} description="Restaurant/Bar Specials" />
                <Featured title={"Featured Shows/Movies"} description="Movie Deals and Shows" />
            </ScrollView>

        </SafeAreaView>
    )
};


