import { View, Text } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native'
import SpecialsCard from '../Cards/SpecialsCard'
import { ArrowRightIcon } from 'react-native-heroicons/outline'

export default function Specials() {
    return (
        <View>
            <View className="flex-row items-center mt-2 justify-between mx-4">
                <Text className="font-bold ">
                    Specials
                </Text>

                <ArrowRightIcon color={"#8500ED"} />
            </View>
            <ScrollView horizontal className="mb-2"
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 15,
                    paddingTop: 10
                }}>
                <SpecialsCard hours={"5pm-2am"} place={"Central City Tavern"} description={"$2 Drink Night"} />
                <SpecialsCard hours={"5-9"} place={"Mozzies"} description={"$5 UFC watch party"} />
            </ScrollView>
        </View>
    )
}