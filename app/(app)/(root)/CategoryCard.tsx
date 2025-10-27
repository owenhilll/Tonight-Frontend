import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import SportsBarIcon from '@mui/icons-material/SportsBar';

export default function CategoryCard({ children }: { children: any }) {
  return (
    <TouchableOpacity className="h-[10%] w-[20%]">
      <View className="flex-1 items-center">{children}</View>
    </TouchableOpacity>
  );
}
