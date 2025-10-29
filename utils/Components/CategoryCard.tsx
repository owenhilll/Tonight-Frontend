import { View, Text, TouchableOpacity, Image, GestureResponderEvent } from 'react-native';
import React, { useState } from 'react';
import SportsBarIcon from '@mui/icons-material/SportsBar';

export default function CategoryCard({
  children,
  handleClick,
}: {
  children: any;
  handleClick: (event: GestureResponderEvent) => void;
}) {
  return (
    <TouchableOpacity onPress={handleClick} className="w-[20%]">
      <View className="flex-1 items-center">{children}</View>
    </TouchableOpacity>
  );
}
