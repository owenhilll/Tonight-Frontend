import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { ArrowRightIcon } from 'react-native-heroicons/outline'
import MovieShowCard from '../Cards/MovieShowCard'

export default function MovieShows() {
    return (
        <View>
            <View className="flex-row items-center mt-2 justify-between mx-4">
                <Text className="font-bold ">
                    Movies/Shows
                </Text>

                <ArrowRightIcon color={"#8500ED"} />
            </View>
            <ScrollView horizontal className="mb-2"
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 15,
                    paddingTop: 10
                }}>
                <MovieShowCard name={"Bert Kreischer"} showtime={"9:00pm"} />
                <MovieShowCard name={"Guardians Vol 3"} showtime={"10:00pm"} />
            </ScrollView>
        </View >
    )
}