import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { MapPinIcon } from 'react-native-heroicons/outline'

export default function SportsCard({ team, logo, price, opponent, theme }) {
    return (
        <TouchableOpacity className="mr-4 mb-2 bg-white shadow-sm shadow-blue-500
         rounded-md h-40 w-60">
            <View>
                <Text
                    className="text-black ml-2 font-bold text-base absolute left-0 top-0">
                    {team} vs {opponent}
                </Text>
                <Text
                    className="text-black mt-5 ml-2 text-s">
                    {price}
                </Text>
            </View>

            <View className="absolute mb-2 left-0 bottom-0 ml-2">
                <MapPinIcon></MapPinIcon>
            </View>
        </TouchableOpacity>
    )
}