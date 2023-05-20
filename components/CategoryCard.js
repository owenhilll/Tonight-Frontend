import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'

export default function CategoryCard({ imgUrl, title }) {
    return (
        <TouchableOpacity className="relative mr-2 h-20 w-20 items-center bg-black">
            <Image source={imgUrl}
                className="h-16 w-16 rounded"
            />

            <Text
                className="absolute bottom-0 ml-1 left-0 text-white font-bold">
                {title}
            </Text>
        </TouchableOpacity>
    );
};