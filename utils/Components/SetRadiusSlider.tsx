import Slider from '@react-native-community/slider';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../Hooks/authContext';
import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';

export default function SetRadiusSlider() {
  const { radius, setRadius } = useAuth();
  const [tempRadius, setTempRadius] = useState<number>(radius);
  const [showRadius, setShowRadius] = useState(false);
  const queryClient = useQueryClient();
  return (
    <View className="w-full flex-col items-center justify-center">
      <View className="flex-row">
        <Text className=" text-center text-white">Search Radius</Text>
        <TouchableOpacity
          className="ml-2 items-center justify-center text-black"
          onPress={() => setShowRadius(!showRadius)}>
          <FontAwesome6
            color="white"
            size={15}
            name="caret-down"
            iconStyle="solid"
            className=" text-white"
          />
        </TouchableOpacity>
      </View>
      {showRadius && (
        <View className="w-full flex-row items-center">
          <Slider
            renderStepNumber={true}
            step={1}
            value={tempRadius}
            thumbTintColor="blue"
            minimumTrackTintColor="blue"
            minimumValue={1}
            maximumValue={25}
            onValueChange={setTempRadius}
            style={{ margin: '5%', marginRight: 0, flex: 1 }}
          />
          <Text className="mx-5 text-lg text-white">{tempRadius} mi.</Text>
          <TouchableOpacity
            className="mr-5 rounded-full bg-purple-600 p-2 text-center text-xl"
            onPress={() => {
              setRadius(tempRadius);
              queryClient.invalidateQueries({ queryKey: ['Food'] });
              queryClient.invalidateQueries({ queryKey: ['Drink'] });
              queryClient.invalidateQueries({ queryKey: ['Sport'] });
            }}>
            <Text>Apply</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
