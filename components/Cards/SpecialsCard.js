import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { MapPinIcon } from 'react-native-heroicons/outline'


export default function SpecialsCard({ place, hours, description }) {
    return (
        <TouchableOpacity className="rounded-md mb-2 shadow-sm shadow-blue-500
                                     h-40 w-60 bg-white mr-4 ">
            <View>
                <Text
                    className="text-black ml-2 font-bold text-base absolute left-0 top-0">
                    {description}
                </Text>
                <Text
                    className="text-black mt-5 ml-2 text-s">
                    {place}
                </Text>
            </View>

            <View className="absolute mb-2 left-0 bottom-0 ml-2">
                <MapPinIcon></MapPinIcon>
            </View>
        </TouchableOpacity>
    )
}