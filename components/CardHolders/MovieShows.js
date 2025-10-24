import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import MovieShowCard from '../Cards/MovieShowCard';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function MovieShows() {
  return (
    <View>
      <View className="mx-4 mt-2 flex-row items-center justify-between">
        <Text className="font-bold text-white">Movies/Shows</Text>

        <ArrowRightIcon color={'#8500ED'} width={20} />
      </View>
      <ScrollView
        horizontal
        className="mb-2"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingTop: 10,
        }}>
        <MovieShowCard name={'Bert Kreischer'} showtime={'9:00pm'} />
        <MovieShowCard name={'Guardians Vol 3'} showtime={'10:00pm'} />
      </ScrollView>
    </View>
  );
}
