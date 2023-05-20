import { View, Text } from 'react-native'
import React from 'react'
import { ArrowRightIcon } from 'react-native-heroicons/outline'

export default function Featured({ title, description }) {
    return (
        <View>
            <View className="flex-row justify-between pt-4 px-3 ">
                <Text className="font-bold  text-lg">
                    {title}
                </Text>
                <ArrowRightIcon color={"#8500ED"} />
            </View>

            <Text className="px-3 text-xs">{description}</Text>
        </View>


    )
}