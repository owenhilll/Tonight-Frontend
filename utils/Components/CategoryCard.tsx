import { View, Text, TouchableOpacity, Image, GestureResponderEvent } from 'react-native';
import { useState } from 'react';

export default function CategoryCard({
  children,
  handleClick,
}: {
  children: any;
  handleClick: (event: GestureResponderEvent) => void;
}) {
  return (
    <TouchableOpacity onPress={handleClick} className="w-[20%]">
      <View className="items-center">{children}</View>
    </TouchableOpacity>
  );
}
