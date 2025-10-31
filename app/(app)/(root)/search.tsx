import { Text, View } from 'react-native';

export default function Search() {
  return (
    <View className="h-full bg-black">
      <View className="mt-5 w-[100%] flex-row">
        <Text className="flex-1 text-center text-5xl text-white">Search</Text>
      </View>
      <View className="m-3 flex-1 overflow-visible">
        <View className="flex-1 justify-center">
          <Text className="text-center text-xl text-white">Coming soon ...</Text>
        </View>
      </View>
    </View>
  );
}
