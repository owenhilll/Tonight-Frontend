import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import SportsCard from '../Cards/SportsCard';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
export default function Sports() {
  return (
    <View>
      <View className="mx-4 mt-2 flex-row items-center justify-between">
        <Text className="font-bold text-white">Sporting Events</Text>

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
        <SportsCard
          team={'Braves'}
          opponent={'yankees'}
          price={'$25'}
          theme={'BobbleHead'}
          logo={'wait'}
        />
        <SportsCard
          team={'Hawks'}
          opponent={'Celtics'}
          price={'$55'}
          theme={'BobbleHead'}
          logo={'wait'}
        />
      </ScrollView>
    </View>
  );
}
