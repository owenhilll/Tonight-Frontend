import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import Drinks from '../../assets/CockTail.png';
import Movie from '../../assets/Movie.png';
import Concert from '../../assets/Concert.png';
import Sports from '../../assets/Sports.png';
import Deals from '../../assets/Deals.png';
import CategoryCard from '../Cards/CategoryCard';

export default function Categories() {
  return (
    <ScrollView
      className="justify-center"
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 15,
        paddingTop: 10,
      }}>
      <CategoryCard imgUrl={Drinks} title={'Specials'} />
      <CategoryCard imgUrl={Movie} title={'Movies/Shows'} />
      <CategoryCard imgUrl={Concert} title={'Concerts'} />
      <CategoryCard imgUrl={Sports} title={'Sports'} />
      <CategoryCard imgUrl={Deals} title={'Deals'} />
    </ScrollView>
  );
}
