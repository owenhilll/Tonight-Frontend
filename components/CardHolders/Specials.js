import { View, Text } from 'react-native';
import React from 'react';
import { ScrollView } from 'react-native';
import SpecialsCard from '../Cards/SpecialsCard';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
export default function Specials() {
  return (
    <View>
      <View className="mx-4 mt-2 flex-row items-center justify-between">
        <Text className="font-bold text-white">Specials</Text>

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
        <SpecialsCard
          hours={'5pm-2am'}
          place={'Central City Tavern'}
          description={'$2 Drink Night'}
        />
        <SpecialsCard hours={'5-9'} place={'Mozzies'} description={'$5 UFC watch party'} />
      </ScrollView>
    </View>
  );
}
