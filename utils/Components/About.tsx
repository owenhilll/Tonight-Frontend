import { FlatList, Text, View } from 'react-native';

export default function About() {
  return (
    <View className="mx-5 my-4 space-y-4">
      <Text className="text-center text-2xl text-white">
        Discover all your local offerings and events, all in one place.
      </Text>
      <View className="mx-[10%] border-2 border-blue-300" />
      <View>
        <Text className="text-center text-lg text-white">Browse by categories including:</Text>
        <FlatList
          contentContainerStyle={{ alignItems: 'center' }}
          data={['Movies/Shows', 'Drinks', 'Food', 'Sports', 'Outdoor', 'Classes', '+ many more!']}
          renderItem={({ item }) => <Text className="mt-2 text-white">{item}</Text>}
        />
      </View>
      <View className="mx-[10%] border-2 border-blue-300" />

      <Text className="text-center text-xl text-white">
        Businesses share upcoming offers and events directly to their local populus.
      </Text>

      <View className="mx-[10%] border-2 border-blue-300" />

      <Text className="text-center text-lg text-white">
        Some events share their reservation/ticketing portal directly through the app, making
        booking easy!
      </Text>
    </View>
  );
}
