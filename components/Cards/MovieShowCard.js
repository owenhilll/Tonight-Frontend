import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { MapPinIcon } from 'react-native-heroicons/outline'


export default function MovieShowCard({ showtime, name, price }) {
    return (
        <TouchableOpacity className="shadow-sm mb-2 rounded-lg shadow-blue-500 mr-4 
        h-40 w-60 bg-white">
            <View>
                <Text
                    className="text-black ml-2 font-bold text-base absolute left-0 top-0">
                    {name}
                </Text>
                <Text
                    className="text-black mt-5 ml-2 text-s">
                    {showtime}
                </Text>
            </View>

            <View className="absolute mb-2 left-0 bottom-0 ml-2">
                <MapPinIcon></MapPinIcon>
            </View>


        </TouchableOpacity>
    )
}