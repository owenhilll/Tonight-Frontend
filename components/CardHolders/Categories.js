import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import Drinks from '../../assets/Images/CockTail.png'
import Movie from '../../assets/Images/Movie.png'
import Concert from '../../assets/Images/Concert.png'
import Sports from '../../assets/Images/Sports.png'
import Deals from '../../assets/Images/Deals.png'
import CategoryCard from '../Cards/CategoryCard'


export default function Categories() {
    return (
        <ScrollView horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
                paddingHorizontal: 15,
                paddingTop: 10
            }}>
            <CategoryCard imgUrl={Drinks} title={"Specials"} />
            <CategoryCard imgUrl={Movie} title={"Movies/Shows"} />
            <CategoryCard imgUrl={Concert} title={"Concerts"} />
            <CategoryCard imgUrl={Sports} title={"Sports"} />
            <CategoryCard imgUrl={Deals} title={"Deals"} />
        </ScrollView>
    )
}