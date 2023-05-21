import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import SportsCard from '../Cards/SportsCard'
import { ArrowRightIcon } from 'react-native-heroicons/outline'

export default function Sports() {
    return (
        <View>
            <View className="flex-row items-center mt-2 justify-between mx-4">
                <Text className="font-bold ">
                    Sporting Events
                </Text>

                <ArrowRightIcon color={"#8500ED"} />
            </View>
            <ScrollView horizontal className="mb-2"
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 15,
                    paddingTop: 10
                }}>
                <SportsCard
                    team={"Braves"}
                    opponent={"yankees"}
                    price={"$25"}
                    theme={"BobbleHead"}
                    logo={"wait"}
                />
                <SportsCard
                    team={"Hawks"}
                    opponent={"Celtics"}
                    price={"$55"}
                    theme={"BobbleHead"}
                    logo={"wait"}
                />
            </ScrollView>
        </View>
    )
}